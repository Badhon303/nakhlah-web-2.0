import { Mascot } from "@/components/nakhlah/Mascot";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AboutNakhlahPage({ onBack }) {
  const aboutItems = [
    { label: "Job Vacancy", action: () => {} },
    { label: "Fees", action: () => {} },
    { label: "Developer", action: () => {} },
    { label: "Partner", action: () => {} },
    { label: "Privacy Policy", action: () => {} },
    { label: "Accessibility", action: () => {} },
    { label: "Feedback", action: () => {} },
    { label: "Rate us", action: () => {} },
    { label: "Visit Our Website", action: () => {} },
    { label: "Follow us on Social Media", action: () => {} },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">About Nakhlah</h1>
          </div>
        </div>

        {/* Mascot Logo */}
        <div className="flex justify-center mb-8">
          <div className="rounded-2xl flex items-center justify-center">
            <Mascot size="xxl" mood="happy" />
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground mb-2">Nakhlah v2.0.0</h2>
          <p className="text-sm text-muted-foreground">Learn languages with fun and ease</p>
        </div>

        {/* About Items List */}
        <div className="space-y-1">
          {aboutItems.map((item, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              onClick={item.action}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-all rounded-lg group"
            >
              <span className="font-medium text-foreground">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}