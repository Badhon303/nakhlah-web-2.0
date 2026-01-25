"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Zap,
  Calendar,
  TrendingUp,
  Check,
  Lock,
  Sparkles,
  Crown,
  Music,
  Brain,
  Clock,
  Flame,
  CreditCard,
  Wallet,
  ArrowLeft,
  Home,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const premiumFeatures = [
  {
    id: 1,
    name: "Unlocked Channels",
    description: "Get unlimited access to extra & exclusive courses",
    icon: BookOpen,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: 2,
    name: "Lessons Reminder",
    description: "Get daily lesson reminders to keep on track of learning",
    icon: Calendar,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: 3,
    name: "Learning Calendar",
    description:
      "Visualizing your streak, practicing and activities in calendar",
    icon: Calendar,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: 4,
    name: "Boost Your XP",
    description: "Unlock more XP from every single lesson finished",
    icon: Zap,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    id: 5,
    name: "Learning Music",
    description: "Unlock all music to boost your learning experience",
    icon: Music,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: 6,
    name: "Learn Better",
    description: "Get learning progress to improve your learning",
    icon: TrendingUp,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    id: 7,
    name: "No Waiting Time",
    description: "Get your quiz result without any waiting time",
    icon: Clock,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: 8,
    name: "Fire up the quiz",
    description: "With extra quiz to boost up your vocabulary",
    icon: Flame,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const benefitsList = [
  "Learning Material",
  "One Time Payment",
  "Lessons Reminder",
  "Learning Calendar",
  "Boost Your XP",
  "Learning Music",
  "Learn Better",
  "No Waiting Time",
  "Fire up the quiz",
  "Plus, get the Ads",
];

const subscriptionPlans = [
  {
    id: "1month",
    duration: "1 Month",
    price: "$10.00",
    savePercent: null,
  },
  {
    id: "3months",
    duration: "3 Months",
    price: "Save over 40%",
    originalPrice: "$30.00",
    actualPrice: "$25.00",
    savePercent: "40%",
  },
  {
    id: "6months",
    duration: "6 Months",
    price: "Save over 45%",
    originalPrice: "$60.00",
    actualPrice: "$45.00",
    savePercent: "45%",
    popular: true,
  },
  {
    id: "12months",
    duration: "12 Months",
    price: "Save over 50%",
    originalPrice: "$120.00",
    actualPrice: "$80.00",
    savePercent: "50%",
  },
];

const paymentMethods = [
  { id: "paypal", name: "PayPal", icon: CreditCard },
  { id: "google", name: "Google Pay", icon: Wallet },
  { id: "apple", name: "Apple Pay", icon: CreditCard },
];

export default function PremiumPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1); // 1: features, 2: benefits, 3: plans, 4: payment
  const [selectedPlan, setSelectedPlan] = useState("6months");
  const [selectedPayment, setSelectedPayment] = useState("paypal");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Header - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <Crown className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Store
            </h1>
          </div>
          <p className="text-muted-foreground">
            Unlock your full learning potential with exclusive features
          </p>
        </motion.div>

        {/* Step 1: Get a better & Features */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-accent p-8 md:p-12 lg:p-16 text-center shadow-lg">
              <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 relative">
                Get a better & super fast
                <br />
                learning up to 5x
              </h2>
              <p className="text-white/90 text-base md:text-lg relative max-w-2xl mx-auto">
                Unlock all premium channels and accelerate your learning journey
                with exclusive content
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {premiumFeatures.map((feature, index) => (
                <div
                  key={feature.id}
                  className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-card border border-border transition-all duration-300 text-center"
                >
                  <div
                    className={`p-4 rounded-2xl ${feature.iconBg} shadow-md`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground text-base mb-2">
                      {feature.name}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-2xl mx-auto">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNext}
              >
                <Crown className="w-5 h-5 mr-2" />
                Go Premium Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={() => router.push("/")}
              >
                No, Thanks
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Benefits List */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Back Button */}
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {/* Hero Card */}
            <div className="relative overflow-hidden rounded-3xl bg-accent p-8 md:p-12 lg:p-16 text-center shadow-lg">
              <Star className="w-16 h-16 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Go Premium and enjoy
                <br />
                the benefits!
              </h2>
              <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
                Everything you need for an extraordinary learning experience
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {benefitsList.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-accent" strokeWidth={3} />
                  </div>
                  <span className="text-foreground font-medium text-sm md:text-base">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 max-w-2xl mx-auto">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNext}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                I&apos;m Interested
              </Button>
              <Button
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={handleBack}
              >
                Go Back
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Subscription Plans */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Back Button */}
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Choose a subscription plan
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Select the perfect plan for your learning journey and save more
                with longer subscriptions
              </p>
            </motion.div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {subscriptionPlans.map((plan, index) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-center shadow-md hover:shadow-2xl ${
                    selectedPlan === plan.id
                      ? "border-primary bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 shadow-xl scale-105"
                      : "border-border bg-card hover:border-primary/30"
                  } ${plan.popular ? "lg:scale-110" : ""}`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white border-0 shadow-lg px-4 py-1">
                      <Star className="w-3 h-3 mr-1 inline" /> Most Popular
                    </Badge>
                  )}

                  <div className="space-y-4 pt-2">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full border-3 flex items-center justify-center transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-accent scale-110"
                          : "border-border bg-muted"
                      }`}
                    >
                      {selectedPlan === plan.id ? (
                        <Check className="w-8 h-8 text-white" strokeWidth={3} />
                      ) : (
                        <Crown
                          className={`w-8 h-8 ${selectedPlan === plan.id ? "text-white" : "text-muted-foreground"}`}
                        />
                      )}
                    </div>

                    <div>
                      <p className="font-bold text-foreground text-xl mb-1">
                        {plan.duration}
                      </p>
                      {plan.savePercent && (
                        <p className="text-sm text-primary font-semibold mb-2">
                          {plan.price}
                        </p>
                      )}
                    </div>

                    <div className="py-4 border-t border-border">
                      {plan.actualPrice ? (
                        <>
                          <p className="text-sm text-muted-foreground line-through mb-1">
                            {plan.originalPrice}
                          </p>
                          <p className="text-3xl md:text-4xl font-bold text-accent">
                            {plan.actualPrice}
                          </p>
                        </>
                      ) : (
                        <p className="text-3xl md:text-4xl font-bold text-foreground">
                          {plan.price}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        per billing cycle
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              <Button
                className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNext}
              >
                Continue to Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Payment Method */}
        {currentStep === 4 && (
          <motion.div
            key="step4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Back Button */}
            <Button variant="ghost" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Select payment method
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
                Choose your preferred payment option to complete your
                subscription
              </p>
            </motion.div>

            {/* Payment Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {paymentMethods.map((method, index) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`relative p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 shadow-md hover:shadow-2xl ${
                    selectedPayment === method.id
                      ? "border-primary bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 shadow-xl scale-105"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {selectedPayment === method.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  )}

                  <method.icon className="w-16 h-16 md:w-20 md:h-20 text-foreground" />
                  <span className="font-bold text-foreground text-lg md:text-xl">
                    {method.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Info Card */}
            <div className="max-w-3xl mx-auto">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      Verification Required
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      After confirmation, check the verification code in your
                      email or registered number to complete the payment process
                      securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              <Button
                className="w-full max-w-md bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setCurrentStep(5)}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirm Payment
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Success */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 text-center py-12 max-w-3xl mx-auto"
          >
            <div className="space-y-6">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Check
                  className="w-16 h-16 md:w-20 md:h-20 text-white"
                  strokeWidth={3}
                />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                  Payment successful!
                </h2>
                <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  Congratulations on your purchase! Your premium subscription is
                  now live & active. You can use all exclusive features whenever
                  you need. Enjoy your enhanced learning journey!
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => router.push("/")}
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
