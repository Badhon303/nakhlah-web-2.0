"use client";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

export default function HelpCenterPage({ onBack, onNavigateContact }) {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: "general", label: "General" },
    { id: "account", label: "Account" },
    { id: "service", label: "Service" },
    { id: "language", label: "Language" },
  ];

  const faqs = [
    {
      question: "What is Elingo?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "How do I start a lesson?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "How do I buy diamonds?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "How do I take on the challenge?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      question: "How to close an Elingo account?",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
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
            <h1 className="text-2xl font-bold text-foreground">Help Center</h1>
          </div>
        </div>

        {/* Tabs - Removed the onClick for Contact us to prevent navigation */}
        <div className="flex gap-4 mb-6">
          <div
            className="px-4 py-2 rounded-lg font-medium bg-accent text-accent-foreground"
          >
            FAQ
          </div>
          <button
            onClick={() => onNavigateContact && onNavigateContact()}
            className="px-4 py-2 rounded-lg font-medium bg-muted/30 text-muted-foreground hover:bg-muted/50 transition-all"
          >
            Contact us
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium whitespace-nowrap hover:bg-accent/90 transition-all"
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              className="border border-border rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-all"
              >
                <span className="text-left font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}