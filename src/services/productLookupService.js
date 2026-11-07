/**
 * Modular Multi-Source Product Lookup Service for Be Conscious
 *
 * Implements an adapter-based architecture that checks sources sequentially
 * and stops immediately upon obtaining a verified product record:
 *
 *  [1. In-Memory & Session Cache]
 *             ↓ (miss)
 *  [2. Curated Indian FMCG Catalog] (Parle, Britannia, Haldiram, Amul, Maggi, etc.)
 *             ↓ (miss)
 *  [3. Supabase Community & Verified Database] (public.products)
 *             ↓ (miss)
 *  [4. Open Food Facts Multi-Endpoint API v3] (India node -> World node -> v0 fallback)
 *             ↓ (miss)
 *  [5. Local Benchmark Mock Catalog]
 *             ↓ (miss)
 *  [6. Structured GS1 Fallback Resolution]
 */

import { findInIndianCatalog } from '../data/indianProductsCatalog.js';
import { supabaseService } from './supabaseService.js';
import { normalizeProduct } from './openFoodFactsService.js';
import { validateEanUpcChecksum, identifyBarcodeFormat, getGS1CountryPrefix, normalizeBarcode } from '../utils/barcodeValidator.js';
import { scanLogger } from '../utils/scanLogger.js';

const memoryCache = new Map();
const CACHE_PREFIX = 'be_conscious_lookup_';
const USER_AGENT = 'BeConsciousApp/1.0 (https://github.com/Aarnaaa22/Be-Concious; contact: admin@beconscious.app)';

/**
 * 1. CACHE ADAPTER
 */
const CacheAdapter = {
  name: 'Memory & Session Cache',
  get(barcode) {
    if (memoryCache.has(barcode)) {
      return { found: true, product: memoryCache.get(barcode), source: 'memory_cache' };
    }
    try {
      const stored = sessionStorage.getItem(`${CACHE_PREFIX}${barcode}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        memoryCache.set(barcode, parsed);
        return { found: true, product: parsed, source: 'session_cache' };
      }
    } catch {
      // Storage blocked or quota exceeded
    }
    return { found: false };
  },
  set(barcode, product) {
    if (!barcode || !product) return;
    memoryCache.set(barcode, product);
    try {
      sessionStorage.setItem(`${CACHE_PREFIX}${barcode}`, JSON.stringify(product));
      sessionStorage.setItem(`be_conscious_prod_${product.id}`, JSON.stringify(product));
      sessionStorage.setItem(`be_conscious_prod_${barcode}`, JSON.stringify(product));
    } catch {
      // ignore
    }
  }
};

/**
 * 2. CURATED INDIAN FMCG CATALOG ADAPTER
 */
const IndianCatalogAdapter = {
  name: 'Curated Indian FMCG Catalog',
  async lookup(barcode) {
    const item = findInIndianCatalog(barcode);
    if (item) {
      return {
        found: true,
        product: item,
        source: 'indian_catalog',
        verificationStatus: 'verified'
      };
    }
    return { found: false };
  }
};

/**
 * 3. SUPABASE COMMUNITY & PERSISTENT DATABASE ADAPTER
 */
const SupabaseCatalogAdapter = {
  name: 'Supabase Database',
  async lookup(barcode) {
    try {
      const { data, error } = await supabaseService.getProductByBarcode(barcode);
      if (data && !error) {
        return {
          found: true,
          product: data,
          source: 'supabase_database',
          verificationStatus: data.verificationStatus || 'unverified'
        };
      }
    } catch (err) {
      console.warn('Supabase adapter error:', err);
    }
    return { found: false };
  }
};

/**
 * 4. OPEN FOOD FACTS MULTI-ENDPOINT ADAPTER
 */
const OpenFoodFactsAdapter = {
  name: 'Open Food Facts API',
  async lookup(barcode) {
    const code = encodeURIComponent(barcode);

    // Endpoints in priority:
    // 1. Local Vite Proxy (avoids CORS)
    // 2. India-specific subdomain (in.openfoodfacts.org)
    // 3. World subdomain v3 (world.openfoodfacts.org/api/v3)
    // 4. World subdomain legacy v0 (world.openfoodfacts.org/api/v0)
    const endpoints = [
      `/off-api/api/v3/product/${code}.json`,
      `https://in.openfoodfacts.org/api/v3/product/${code}.json`,
      `https://world.openfoodfacts.org/api/v3/product/${code}.json`,
      `https://world.openfoodfacts.org/api/v0/product/${code}.json`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': USER_AGENT
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 404) {
          // Explicit 404 from this endpoint, try next
          continue;
        }

        if (!response.ok) {
          continue;
        }

        const data = await response.json();

        if (
          data.status === 'success' ||
          data.status === 'success_with_warnings' ||
          data.result?.id === 'product_found' ||
          (data.product && (data.status === 1 || data.status === '1'))
        ) {
          const normalized = normalizeProduct(data);
          if (normalized) {
            normalized.dataSource = 'open_food_facts';
            normalized.verificationStatus = 'verified';
            return {
              found: true,
              product: normalized,
              source: 'open_food_facts',
              verificationStatus: 'verified'
            };
          }
        }
      } catch (err) {
        // Timeout or network error; try next endpoint
      }
    }

    return { found: false };
  }
};

/**
 * UNIFIED MODULAR PRODUCT LOOKUP PIPELINE
 */
export async function lookupProduct(rawBarcode) {
  const startTime = Date.now();
  const barcode = normalizeBarcode(rawBarcode);

  if (!barcode) {
    return {
      found: false,
      status: 'INVALID_BARCODE',
      message: 'Please provide a valid barcode string.',
      barcode: ''
    };
  }

  const format = identifyBarcodeFormat(barcode);
  const isChecksumValid = validateEanUpcChecksum(barcode);
  const gs1Info = getGS1CountryPrefix(barcode);

  // Diagnostic log start
  scanLogger.log({
    barcode,
    format,
    action: 'LOOKUP_START',
    source: 'PRODUCT_LOOKUP_PIPELINE',
    status: 'INFO',
    message: `Format: ${format}, GS1: ${gs1Info?.country || 'Unknown'}`
  });

  // 1. Check Cache
  const cached = CacheAdapter.get(barcode);
  if (cached.found) {
    const durationMs = Date.now() - startTime;
    scanLogger.log({
      barcode,
      format,
      action: 'LOOKUP_COMPLETE',
      source: cached.source,
      durationMs,
      status: 'SUCCESS',
      message: `Found in ${cached.source}: ${cached.product.name}`
    });
    return {
      found: true,
      status: 'IDENTIFIED',
      product: cached.product,
      source: cached.source,
      verificationStatus: cached.product.verificationStatus || 'verified',
      durationMs
    };
  }

  // 2. Check Curated Indian Products Catalog
  const indianRes = await IndianCatalogAdapter.lookup(barcode);
  if (indianRes.found) {
    CacheAdapter.set(barcode, indianRes.product);
    const durationMs = Date.now() - startTime;
    scanLogger.log({
      barcode,
      format,
      action: 'LOOKUP_COMPLETE',
      source: indianRes.source,
      durationMs,
      status: 'SUCCESS',
      message: `Found in Indian Catalog: ${indianRes.product.name}`
    });
    return {
      found: true,
      status: 'IDENTIFIED',
      product: indianRes.product,
      source: indianRes.source,
      verificationStatus: 'verified',
      durationMs
    };
  }

  // 3. Check Supabase Database (Community & Verified)
  const supabaseRes = await SupabaseCatalogAdapter.lookup(barcode);
  if (supabaseRes.found) {
    CacheAdapter.set(barcode, supabaseRes.product);
    const durationMs = Date.now() - startTime;
    scanLogger.log({
      barcode,
      format,
      action: 'LOOKUP_COMPLETE',
      source: supabaseRes.source,
      durationMs,
      status: 'SUCCESS',
      message: `Found in Supabase: ${supabaseRes.product.name}`
    });
    return {
      found: true,
      status: supabaseRes.verificationStatus === 'verified' ? 'IDENTIFIED' : 'USER_SUBMITTED',
      product: supabaseRes.product,
      source: supabaseRes.source,
      verificationStatus: supabaseRes.verificationStatus,
      durationMs
    };
  }

  // 4. Check Open Food Facts Multi-Endpoint API v3
  const offRes = await OpenFoodFactsAdapter.lookup(barcode);
  if (offRes.found) {
    CacheAdapter.set(barcode, offRes.product);
    // Asynchronously cache in Supabase products table so subsequent queries across devices are instantaneous
    supabaseService.submitCommunityProduct(offRes.product).catch(() => {});

    const durationMs = Date.now() - startTime;
    scanLogger.log({
      barcode,
      format,
      action: 'LOOKUP_COMPLETE',
      source: offRes.source,
      durationMs,
      status: 'SUCCESS',
      message: `Found in Open Food Facts: ${offRes.product.name}`
    });
    return {
      found: true,
      status: 'IDENTIFIED',
      product: offRes.product,
      source: offRes.source,
      verificationStatus: 'verified',
      durationMs
    };
  }

  // 5. If not found anywhere, return structured GS1 fallback metadata
  const durationMs = Date.now() - startTime;
  scanLogger.log({
    barcode,
    format,
    action: 'LOOKUP_NOT_FOUND',
    source: 'ALL_SOURCES_EXHAUSTED',
    durationMs,
    status: 'NOT_FOUND',
    message: `Barcode not found across catalogs. GS1: ${gs1Info?.country || 'Unknown'}`
  });

  return {
    found: false,
    status: 'NOT_FOUND',
    barcode,
    format,
    isChecksumValid,
    gs1Info,
    durationMs,
    message: "We scanned your barcode, but this product isn't in our database yet."
  };
}

/**
 * Register a newly scanned, user-submitted or OCR product into dynamic cache
 */
export function registerDynamicProduct(product) {
  if (!product) return;
  const barcode = product.barcode || product.id;
  if (barcode) {
    CacheAdapter.set(barcode, product);
  }
}
