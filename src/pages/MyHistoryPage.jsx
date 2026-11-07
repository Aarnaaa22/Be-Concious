import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Trash2, 
  ScanLine, 
  ArrowRight, 
  Sparkles, 
  Bookmark, 
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge, NovaBadge, ConsciousScoreBadge } from '../components/common/Badge';
import { useHistory } from '../context/HistoryContext';
import { mockProducts } from '../data/mockProducts';

export const MyHistoryPage = () => {
  const { history, clearHistory, savedProducts } = useHistory();
  const [activeTab, setActiveTab] = useState('scans'); // 'scans' | 'saved'

  const savedList = mockProducts.filter((p) => savedProducts.includes(p.id));

  const formatScanTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div className="space-y-1">
          <Badge variant="soft" size="md">
            Personal Food Log
          </Badge>
          <h1 className="text-3xl font-heading font-extrabold text-berry">
            My Scan History & Saved Foods
          </h1>
          <p className="text-sm text-brand-muted">
            Review your previously decoded foods and saved conscious favorites.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button to="/scan" variant="primary" size="md" icon={ScanLine}>
            Scan Food
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('scans')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all ${
              activeTab === 'scans'
                ? 'bg-berry text-white shadow-soft'
                : 'bg-white text-brand-text border border-brand-border hover:bg-soft-light'
            }`}
          >
            Recent Scans ({history.length})
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all ${
              activeTab === 'saved'
                ? 'bg-berry text-white shadow-soft'
                : 'bg-white text-brand-text border border-brand-border hover:bg-soft-light'
            }`}
          >
            Saved Items ({savedList.length})
          </button>
        </div>

        {activeTab === 'scans' && history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs font-semibold text-brand-muted hover:text-berry flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Scans Tab */}
      {activeTab === 'scans' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <Card className="bg-white border border-brand-border p-12 text-center max-w-md mx-auto space-y-4">
              <Clock className="w-12 h-12 text-berry mx-auto opacity-40" />
              <h3 className="text-lg font-heading font-bold text-berry">No Scanned Foods Yet</h3>
              <p className="text-xs text-brand-muted">
                Scan your first packaged food barcode or try one of our verified sample products.
              </p>
              <Button to="/scan" variant="primary" size="sm" icon={ScanLine}>
                Start First Scan
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <Card
                  key={`${item.id}-${index}`}
                  className="bg-white border border-brand-border p-4 sm:p-5 hover:shadow-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-brand-border flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-vibrant">
                          {item.brand}
                        </span>
                        <span className="text-xs text-brand-muted">•</span>
                        <span className="text-xs text-brand-muted">
                          {formatScanTime(item.scannedAt)}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-heading font-bold text-brand-text">
                        {item.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <NovaBadge group={item.novaGroup} showLabel={false} />
                        <span className="text-xs font-semibold text-berry bg-warm-light px-2 py-0.5 rounded-full border border-warm/60">
                          {item.caloriesPerServing} kcal
                        </span>
                        <span className="text-xs font-bold text-berry">
                          Score {item.consciousScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center">
                    <Link
                      to={`/analysis/${item.id}`}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-berry text-white text-xs font-heading font-bold hover:bg-berry-dark transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Re-examine</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Foods Tab */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedList.length === 0 ? (
            <Card className="bg-white border border-brand-border p-12 text-center max-w-md mx-auto space-y-4">
              <Bookmark className="w-12 h-12 text-berry mx-auto opacity-40" />
              <h3 className="text-lg font-heading font-bold text-berry">No Saved Foods Yet</h3>
              <p className="text-xs text-brand-muted">
                Save your favorite conscious products to quickly access their ingredients and nutrition later.
              </p>
              <Button to="/explore" variant="primary" size="sm">
                Browse Foods
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedList.map((item) => (
                <Card
                  key={item.id}
                  className="bg-white border border-brand-border p-5 space-y-3 hover:shadow-soft transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-brand-border"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-vibrant block">
                        {item.brand}
                      </span>
                      <h4 className="text-sm font-heading font-bold text-brand-text line-clamp-1">
                        {item.name}
                      </h4>
                      <span className="text-xs text-berry font-bold">
                        Score {item.consciousScore} • {item.caloriesPerServing} kcal
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-border flex items-center justify-between">
                    <NovaBadge group={item.novaGroup} />
                    <Link
                      to={`/analysis/${item.id}`}
                      className="text-xs font-heading font-bold text-vibrant hover:underline flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

