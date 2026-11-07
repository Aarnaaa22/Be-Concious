/**
 * Barcode Validation and GS1 Identification Utilities
 * Supports EAN-13, EAN-8, UPC-A, UPC-E, ITF-14, Code 128
 */

// Modulo 10 Checksum Algorithm (EAN/UPC standard)
export function validateEanUpcChecksum(code) {
  const clean = String(code || '').replace(/\D/g, '');
  if (![8, 12, 13, 14].includes(clean.length)) {
    // Other formats (e.g. Code 128) don't use this standard modulo 10 check
    return true;
  }

  const digits = clean.split('').map(Number);
  const checkDigit = digits[digits.length - 1];
  const payload = digits.slice(0, digits.length - 1);

  // EAN-13 / EAN-8 / UPC-A / ITF-14 modulo 10
  // Weight alternate 3 and 1 from right to left
  let sum = 0;
  let weight = 3;
  for (let i = payload.length - 1; i >= 0; i--) {
    sum += payload[i] * weight;
    weight = weight === 3 ? 1 : 3;
  }

  const calculatedCheck = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheck;
}

/**
 * Identify standard barcode format
 */
export function identifyBarcodeFormat(code) {
  const clean = String(code || '').trim();
  if (!clean) return 'UNKNOWN';

  if (/^\d{8}$/.test(clean)) return 'EAN-8';
  if (/^\d{12}$/.test(clean)) return 'UPC-A';
  if (/^\d{13}$/.test(clean)) return 'EAN-13';
  if (/^\d{14}$/.test(clean)) return 'ITF-14';
  if (/^[0-9A-Za-z\s\-\.\$\/\+\%]{1,80}$/.test(clean)) return 'CODE-128';
  return 'GENERIC';
}

/**
 * GS1 Country Prefix Lookup
 * Important: GS1 country prefix indicates the issuing GS1 national organization,
 * not necessarily the country of agricultural origin or final manufacturing.
 */
export function getGS1CountryPrefix(code) {
  const clean = String(code || '').replace(/\D/g, '');
  if (clean.length < 3) return null;

  const prefix3 = parseInt(clean.substring(0, 3), 10);
  const prefix2 = parseInt(clean.substring(0, 2), 10);

  // GS1 India
  if (prefix3 === 890) {
    return {
      country: 'India',
      organization: 'GS1 India',
      isIndian: true,
      notes: 'Registered with GS1 India (Prefix 890). Note that imported or multinational goods marketed in India may carry foreign or Indian prefixes interchangeably.'
    };
  }

  // Major global prefixes
  if (prefix3 >= 0 && prefix3 <= 139) {
    return { country: 'United States & Canada', organization: 'GS1 US / GS1 Canada', isIndian: false };
  }
  if (prefix3 >= 300 && prefix3 <= 379) {
    return { country: 'France', organization: 'GS1 France', isIndian: false };
  }
  if (prefix3 >= 400 && prefix3 <= 440) {
    return { country: 'Germany', organization: 'GS1 Germany', isIndian: false };
  }
  if (prefix3 >= 450 && prefix3 <= 459 || prefix3 >= 490 && prefix3 <= 499) {
    return { country: 'Japan', organization: 'GS1 Japan', isIndian: false };
  }
  if (prefix3 >= 500 && prefix3 <= 509) {
    return { country: 'United Kingdom', organization: 'GS1 UK', isIndian: false };
  }
  if (prefix3 >= 760 && prefix3 <= 769) {
    return { country: 'Switzerland', organization: 'GS1 Switzerland', isIndian: false };
  }
  if (prefix3 >= 800 && prefix3 <= 839) {
    return { country: 'Italy', organization: 'GS1 Italy', isIndian: false };
  }
  if (prefix3 >= 840 && prefix3 <= 849) {
    return { country: 'Spain', organization: 'GS1 Spain', isIndian: false };
  }
  if (prefix3 >= 880 && prefix3 <= 880) {
    return { country: 'South Korea', organization: 'GS1 Korea', isIndian: false };
  }
  if (prefix3 >= 885 && prefix3 <= 885) {
    return { country: 'Thailand', organization: 'GS1 Thailand', isIndian: false };
  }
  if (prefix3 >= 888 && prefix3 <= 888) {
    return { country: 'Singapore', organization: 'GS1 Singapore', isIndian: false };
  }
  if (prefix3 >= 893 && prefix3 <= 893) {
    return { country: 'Vietnam', organization: 'GS1 Vietnam', isIndian: false };
  }
  if (prefix3 >= 899 && prefix3 <= 899) {
    return { country: 'Indonesia', organization: 'GS1 Indonesia', isIndian: false };
  }

  return {
    country: 'International',
    organization: 'GS1 Member Organization',
    isIndian: false,
    notes: 'Standard GS1 retail barcode.'
  };
}

/**
 * Clean & normalize barcode input string
 */
export function normalizeBarcode(input) {
  if (!input) return '';
  return String(input)
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .trim()
    .replace(/\s+/g, '');
}
