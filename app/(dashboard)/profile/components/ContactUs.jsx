"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Mail,
  MessageCircle,
  Globe,
  Facebook,
  Instagram,
  Send,
  Loader2,
} from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/nakhlah/Toast";
import { submitContactForm } from "@/services/api/contact";
import { EMAIL_REGEX, EMAIL_ERROR_MESSAGE } from "@/lib/validation";

const directMethods = [
  {
    icon: Mail,
    title: "Email us",
    subtitle: "support@nakhlah.net",
    color: "from-blue-500 to-blue-600",
    href: "mailto:support@nakhlah.net",
  },
  {
    icon: Globe,
    title: "Website",
    subtitle: "www.nakhlah.net",
    color: "from-purple-500 to-purple-600",
    href: "https://www.nakhlah.net",
  },
];

const socialMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Facebook,
    title: "Facebook",
    color: "from-blue-600 to-blue-700",
  },
  {
    icon: FaXTwitter,
    title: "X",
    color: "from-neutral-800 to-black",
  },
  {
    icon: Instagram,
    title: "Instagram",
    color: "from-pink-500 to-rose-500",
  },
];

// Positions each social icon evenly around a circle centered on the mascot,
// starting from the top and going clockwise. The container is sized with
// enough margin so the icons never spill outside their box.
const ORBIT_RADIUS = 128;
const ORBIT_CENTER = 135;
const orbitPositions = socialMethods.map((_, index) => {
  const angle = -90 + index * (360 / socialMethods.length);
  const radians = (angle * Math.PI) / 180;
  return {
    left: ORBIT_CENTER + ORBIT_RADIUS * Math.cos(radians),
    top: ORBIT_CENTER + ORBIT_RADIUS * Math.sin(radians),
  };
});

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export default function ContactUsPage({ onBack }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field, value) => {
    switch (field) {
      case "name":
        return value.trim().length >= 2
          ? ""
          : "Please enter your full name (at least 2 characters).";
      case "email":
        return EMAIL_REGEX.test(value.trim()) ? "" : EMAIL_ERROR_MESSAGE;
      case "subject":
        return value.trim().length >= 3
          ? ""
          : "Please give your message a short subject.";
      case "message":
        return value.trim().length >= 10
          ? ""
          : "Please share a bit more detail (at least 10 characters).";
      default:
        return "";
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, form[field]),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = Object.fromEntries(
      Object.keys(INITIAL_FORM).map((field) => [
        field,
        validateField(field, form[field]),
      ]),
    );
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      toast.error("Please fix the highlighted fields before sending.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitContactForm(form);
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error || "Failed to send your message.");
      return;
    }

    toast.success(result.message || "Your message has been sent!");
    setForm(INITIAL_FORM);
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 md:mb-7">
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
        </div>

        {/* Hero: mascot with social links orbiting around it */}
        <div className="flex flex-col items-center text-center gap-6 mb-8">
          <div className="relative w-40 h-40 lg:w-80 lg:h-80 shrink-0">
            <div className="hidden lg:block absolute inset-8 rounded-full border-2 border-dashed border-accent/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <FreshDateMascot mood="happy" size="xl" />
            </div>
            <div className="hidden lg:block">
              {socialMethods.map((method, index) => {
                const IconComponent = method.icon;
                const { left, top } = orbitPositions[index];
                return (
                  <motion.button
                    key={method.title}
                    type="button"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.08 * index, duration: 0.35 }}
                    title={method.title}
                    aria-label={method.title}
                    className={`absolute w-12 h-12 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center shadow-md ring-4 ring-card hover:scale-110 transition-transform cursor-pointer`}
                    style={{
                      left: `${left}px`,
                      top: `${top}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                    <span className="sr-only">{method.title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Got a question, found a bug, or just want to say hi? We&apos;d love
            to hear from you. Drop us an email, or send a message using the form
            below and we&apos;ll get back to you as soon as we can.
          </p>
        </div>

        {/* Direct Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {directMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.a
                key={method.title}
                href={method.href}
                target={method.href.startsWith("http") ? "_blank" : undefined}
                rel={method.href.startsWith("http") ? "noreferrer" : undefined}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.04 * index, duration: 0.3 }}
                className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl border border-border/30 hover:bg-muted/50 hover:border-accent/50 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-base font-semibold text-foreground truncate">
                    {method.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {method.subtitle}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Message Form */}
        {/* <div className="bg-transparent lg:bg-card/60 border-0 lg:border lg:border-border rounded-none lg:rounded-2xl p-0 lg:p-6">
          <h2 className="text-lg font-bold text-foreground mb-1">
            Send us a message
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            Fill out the form and our team will reply to your email directly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                    errors.name
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border focus:ring-accent"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                    errors.email
                      ? "border-destructive focus:ring-destructive/40"
                      : "border-border focus:ring-accent"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                onBlur={() => handleBlur("subject")}
                placeholder="How can we help?"
                className={`w-full px-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                  errors.subject
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-border focus:ring-accent"
                }`}
              />
              {errors.subject && (
                <p className="text-xs text-destructive mt-1">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Message
              </label>
              <textarea
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className={`w-full px-4 py-3 bg-muted/30 border rounded-xl focus:outline-none focus:ring-2 text-foreground resize-none ${
                  errors.message
                    ? "border-destructive focus:ring-destructive/40"
                    : "border-border focus:ring-accent"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div> */}
      </motion.div>
    </div>
  );
}
