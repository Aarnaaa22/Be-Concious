import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  HelpCircle, 
  Award, 
  ScanLine, 
  ChevronDown, 
  ChevronUp,
  Flame,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "What does Be Conscious do?",
      a: "Be Conscious allows anyone to scan the barcode of packaged foods to instantly uncover calories, nutritional values, ingredients, allergens, and food processing degree (NOVA classification) without confusing marketing slogans."
    },
    {
      q: "What is NOVA Classification and why does it matter?",
      a: "NOVA is a widely recognized scientific food classification system created by researchers at the University of São Paulo. It categorizes foods into 4 groups based on how much industrial processing they undergo. Group 4 represents ultra-processed formulations containing industrial additives and artificial flavorings."
    },
    {
      q: "How is the Conscious Score calculated?",
      a: "The Conscious Score (0–100) evaluates ingredient purity, processing level, density of micronutrients vs refined sugars, presence of chemical additives, and healthy vs saturated fats. We never accept sponsorships or paid ranking boosts from food brands."
    },
    {
      q: "Where does the nutritional data come from?",
      a: "Our data is referenced against global food transparency databases including Open Food Facts and verified food manufacturer nutritional label declarations."
    },
    {
      q: "Is Be Conscious free to use?",
      a: "Yes! We believe that transparency about what enters your body is a fundamental human right. Be Conscious is 100% free with no hidden paywalls."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="warm" size="md">
          Our Story & Food Mission
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-berry leading-tight">
          Know What You Eat. <br />
          <span className="text-vibrant">Choose What Matters.</span>
        </h1>
        <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
          We created Be Conscious to remove the confusion, deceptive packaging buzzwords, and hidden chemicals from grocery shopping.
        </p>
      </div>

      {/* Philosophy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card className="bg-white border border-brand-border p-8 space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-berry text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6 text-warm" />
          </div>
          <h3 className="text-lg font-heading font-bold text-berry">
            100% Unbiased Truth
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            We don't take food manufacturer sponsorships. Our ratings and nutritional breakdowns are based entirely on open, peer-reviewed science.
          </p>
        </Card>

        <Card className="bg-white border border-brand-border p-8 space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-vibrant text-white flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-heading font-bold text-berry">
            Human-Friendly Clarity
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            Nutrition labels are deliberately printed in microscopic, hard-to-read text. We translate them into clean, intuitive visuals everyone can grasp.
          </p>
        </Card>

        <Card className="bg-white border border-brand-border p-8 space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-2xl bg-warm text-brand-text flex items-center justify-center font-bold">
            <Award className="w-6 h-6 text-berry" />
          </div>
          <h3 className="text-lg font-heading font-bold text-berry">
            Empowerment Over Guilt
          </h3>
          <p className="text-sm text-brand-muted leading-relaxed">
            We don't preach extreme diets or shame your cravings. We simply show you what is inside your food so you can make informed choices.
          </p>
        </Card>

      </div>

      {/* The 4 NOVA Groups Explained */}
      <section id="nova" className="space-y-6 scroll-mt-24">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
            Understanding The NOVA Processing Groups
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            The scientific benchmark we use to assess the processing severity of your food:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="bg-white border border-brand-border p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-warm flex items-center justify-center text-xs font-bold text-berry">1</span>
              <h4 className="font-heading font-bold text-berry text-base">NOVA 1: Minimally Processed</h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Natural edible parts of plants and animals (e.g. rolled oats, fresh milk, unpolished nuts, whole fruit). Cleaning, chilling, freezing, or boiling without added substances.
            </p>
          </Card>

          <Card className="bg-white border border-brand-border p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-soft flex items-center justify-center text-xs font-bold text-berry">2</span>
              <h4 className="font-heading font-bold text-berry text-base">NOVA 2: Culinary Ingredients</h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Substances derived directly from nature by pressing, refining, or grinding (e.g. cold-pressed olive oil, raw honey, butter, sea salt) used in cooking.
            </p>
          </Card>

          <Card className="bg-white border border-brand-border p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-berry-50 border border-berry-200 flex items-center justify-center text-xs font-bold text-berry">3</span>
              <h4 className="font-heading font-bold text-berry text-base">NOVA 3: Processed Foods</h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Simple products made by combining Group 1 foods with Group 2 culinary ingredients (e.g. sourdough bread, cheese, simple canned beans, smoked fish).
            </p>
          </Card>

          <Card className="bg-white border border-brand-border p-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-berry text-white flex items-center justify-center text-xs font-bold">4</span>
              <h4 className="font-heading font-bold text-berry text-base">NOVA 4: Ultra-Processed Foods</h4>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Industrial formulations created with synthetic flavor enhancers, colorings, emulsifiers, high-fructose corn syrups, and hydrogenated oils not found in kitchens.
            </p>
          </Card>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Badge variant="soft" size="md">FAQ</Badge>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-berry">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-brand-border bg-white overflow-hidden transition-all shadow-soft"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-heading font-bold text-brand-text text-sm sm:text-base">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-vibrant flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-berry flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-brand-muted leading-relaxed border-t border-brand-border/60 bg-brand-bg/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Action Banner */}
      <Card className="bg-berry text-white p-8 sm:p-10 text-center space-y-4">
        <h3 className="text-2xl font-heading font-bold text-white">
          Ready to discover what you eat?
        </h3>
        <p className="text-sm text-white/90 max-w-lg mx-auto">
          Try scanning any food barcode now or explore our verified database of conscious foods.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <Button to="/scan" variant="warm" size="md" icon={ScanLine}>
            Scan A Food
          </Button>
          <Button to="/explore" variant="outline" size="md" className="text-white border-white/50 hover:bg-white/10">
            Explore Foods
          </Button>
        </div>
      </Card>

    </div>
  );
};

