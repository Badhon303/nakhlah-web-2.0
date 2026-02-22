"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/nakhlah/ProgressSteps";
import { ThemeToggle } from "@/components/nakhlah/ThemeToggle";
import { LanguageStep } from "@/components/nakhlah/onboarding/LanguageStep";
import { ProficiencyStep } from "@/components/nakhlah/onboarding/ProficiencyStep";
import { GoalStep } from "@/components/nakhlah/onboarding/GoalStep";
import { QuizStep } from "@/components/nakhlah/onboarding/QuizStep";
import { AccountStep } from "@/components/nakhlah/onboarding/AccountStep";
import { UserSourceStep } from "@/components/nakhlah/onboarding/UserSourceStep";
import { CompletionStep } from "@/components/nakhlah/onboarding/CompletionStep";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authUtils";
import { createUserProfile } from "@/services/api/auth";
import { signIn, useSession } from "next-auth/react";
import { toast } from "@/components/nakhlah/Toast";

const steps = [
  { id: 1, label: "Level" },
  { id: 2, label: "Goal" },
  { id: 3, label: "Quiz" },
  { id: 4, label: "About You" },
  { id: 5, label: "Account" },
  { id: 6, label: "Ready!" },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [quizScore, setQuizScore] = useState(0);
  const [isRegistering, setIsRegistering] = useState(false);

  // user source and contact fields  
  const [userSource, setUserSource] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // account fields
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return proficiencyLevel !== "";
      case 2:
        return dailyGoal !== "";
      case 3:
        return true;
      case 4:
        return userSource !== "";
      case 5:
        return (
          name.trim().length >= 2 &&
          email.trim().includes("@") &&
          password.trim().length >= 6
        );

      default:
        return true;
    }
  };

  const handleNext = async () => {
    // If on account step (step 5), handle registration
    if (currentStep === 5) {
      await handleRegistration();
      return;
    }
    
    if (currentStep < steps.length) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleQuizComplete = (score) => {
    setQuizScore(score);
    setCurrentStep(4);
  };

  const handleRegistration = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsRegistering(true);

    try {
      // Register the user
      const result = await registerUser(email, password);

      if (!result.success) {
        toast.error(result.error || "Registration failed");
        setIsRegistering(false);
        return;
      }

      toast.success("Registration successful!");

      // Auto-login with NextAuth
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast.error("Registration successful but auto-login failed. Please login manually.");
        setIsRegistering(false);
        return;
      }

      // Move to completion step
      setCurrentStep(6);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleComplete = async () => {
    // Get the session to retrieve the token
    const session = await fetch('/api/auth/session')
      .then(res => res.json())
      .catch(() => null);
    
    const token = session?.accessToken;

    if (!token) {
      toast.error("Session not found. Please try logging in again.");
      return;
    }

    // Map proficiency level to API format
    const languageStrengthMap = {
      "beginner": "Basic",
      "elementary": "Elementary",
      "intermediate": "Intermediate",
      "advanced": "Advanced"
    };

    // Create user profile before completing onboarding
    const profileData = {
      onboardInfo: {
        age: age.toString(),
        country: "", // Can be collected in future or left empty
        purpose: "", // Can be collected in future or left empty
        goalTime: parseInt(dailyGoal) || 10,
        userSource: userSource,
        languageStrength: languageStrengthMap[proficiencyLevel] || "Basic"
      },
      fullName: name,
      // contactNumber: contactNumber
    };

    const profileResult = await createUserProfile(profileData, token);

    if (!profileResult.success) {
      toast.error(profileResult.error || "Failed to create profile");
      return;
    }

    localStorage.setItem(
      "nakhlah_onboarding",
      JSON.stringify({
        language: selectedLanguage,
        proficiencyLevel,
        dailyGoal,
        quizScore,
        name,
        age,
        email,
        completed: true,
      }),
    );
    
    toast.success("Profile created successfully!");
    router.push("/");
    router.refresh();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProficiencyStep
            selectedLevel={proficiencyLevel}
            onSelect={setProficiencyLevel}
          />
        );
      case 2:
        return <GoalStep selectedGoal={dailyGoal} onSelect={setDailyGoal} />;
      case 3:
        return <QuizStep onComplete={handleQuizComplete} />;
      case 4:
        return (
          <UserSourceStep
            userSource={userSource}
            contactNumber={contactNumber}
            onSelect={({ userSource: source, contactNumber: contact }) => {
              if (source !== undefined) setUserSource(source);
              if (contact !== undefined) setContactNumber(contact);
            }}
          />
        );
      case 5:
        return (
          <AccountStep
            name={name}
            age={age}
            email={email}
            onChange={(fields) => {
              if (fields.name !== undefined) setName(fields.name);
              if (fields.age !== undefined) setAge(fields.age);
              if (fields.email !== undefined) setEmail(fields.email);
              if (fields.password !== undefined) setPassword(fields.password);
            }}
          />
        );
      case 6:
        return (
          <CompletionStep
            language={selectedLanguage}
            dailyGoal={dailyGoal}
            quizScore={quizScore}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌴</div>
            <span className="text-xl font-bold text-foreground">Nakhlah</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Progress */}
      <div className=" container mx-auto px-4 py-6">
        <div className="max-w-[520px] mx-auto">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-6 flex items-start justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.28 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Nav */}
      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)]">
        <div className="container px-1 py-4 flex items-center justify-between max-w-xl mx-auto">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1 || isRegistering}
            className={cn("gap-2", currentStep === 1 && "invisible")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* If final step -> show done */}
          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isRegistering}
              className="gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
            >
              {isRegistering ? "Creating Account..." : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
            >
              Start Learning
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
