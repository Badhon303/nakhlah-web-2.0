"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/nakhlah/ProgressSteps";
import { ThemeToggle } from "@/components/nakhlah/ThemeToggle";
import { ProficiencyStep } from "@/components/nakhlah/onboarding/ProficiencyStep";
import { GoalStep } from "@/components/nakhlah/onboarding/GoalStep";
import { PurposeStep } from "@/components/nakhlah/onboarding/PurposeStep";
import { CountryStep } from "@/components/nakhlah/onboarding/CountryStep";
import { UserSourceStep } from "@/components/nakhlah/onboarding/UserSourceStep";
import { InterestsStep } from "@/components/nakhlah/onboarding/InterestsStep";
import { AccountStep } from "@/components/nakhlah/onboarding/AccountStep";
import { CompletionStep } from "@/components/nakhlah/onboarding/CompletionStep";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/authUtils";
import { createUserProfile, fetchUserOnboardingGlobals } from "@/services/api/auth";
import { signIn } from "next-auth/react";
import { toast } from "@/components/nakhlah/Toast";

const steps = [
  { id: 1, label: "Strength" },
  { id: 2, label: "Goal" },
  { id: 3, label: "Purpose" },
  { id: 4, label: "Country" },
  { id: 5, label: "Source" },
  { id: 6, label: "Interests" },
  { id: 7, label: "Account" },
  { id: 8, label: "Ready!" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [dailyGoal, setDailyGoal] = useState("");
  const [purpose, setPurpose] = useState("");
  const [country, setCountry] = useState("");
  const [userSource, setUserSource] = useState("");
  const [interests, setInterests] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [onboardingData, setOnboardingData] = useState(null);
  const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(true);
  const [loadingError, setLoadingError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const getMediaUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!API_URL) return url;
    return `${API_URL}${url}`;
  };

  const loadOnboardingData = async () => {
    setIsLoadingOnboarding(true);
    setLoadingError("");

    const session = await fetch("/api/auth/session")
      .then((res) => res.json())
      .catch(() => null);

    const token = session?.accessToken;

    if (!token) {
      setLoadingError("Please login first to continue onboarding.");
      setIsLoadingOnboarding(false);
      return;
    }

    const result = await fetchUserOnboardingGlobals(token);

    if (!result.success || !result.data) {
      setLoadingError(result.error || "Failed to load onboarding data");
      setIsLoadingOnboarding(false);
      return;
    }

    setOnboardingData(result.data);
    setIsLoadingOnboarding(false);
  };

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const selectedValues = useMemo(() => {
    const strength = onboardingData?.languageStrength?.strengthsList?.find(
      (item) => item.id === proficiencyLevel
    );
    const selectedPurpose = onboardingData?.purpose?.purposeList?.find(
      (item) => item.id === purpose
    );
    const selectedCountry = onboardingData?.Country?.countryList?.find(
      (item) => item.id === country
    );
    const selectedSource = onboardingData?.userSource?.sourceList?.find(
      (item) => item.id === userSource
    );
    const selectedInterests = onboardingData?.interests?.interestList?.filter((item) =>
      interests.includes(item.id)
    );

    return {
      strength,
      selectedPurpose,
      selectedCountry,
      selectedSource,
      selectedInterests,
    };
  }, [onboardingData, proficiencyLevel, purpose, country, userSource, interests]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return proficiencyLevel !== "";
      case 2:
        return dailyGoal !== "";
      case 3:
        return purpose !== "";
      case 4:
        return country !== "";
      case 5:
        return userSource !== "";
      case 6:
        return interests.length > 0;
      case 7:
        return (
          age !== "" &&
          name.trim().length >= 2 &&
          email.trim().includes("@") &&
          password.trim().length >= 6
        );
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep === 7) {
      await handleRegistration();
      return;
    }

    if (currentStep < steps.length) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const toggleInterest = (interestId) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleRegistration = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsRegistering(true);

    try {
      const result = await registerUser(email, password);

      if (!result.success) {
        toast.error(result.error || "Registration failed");
        setIsRegistering(false);
        return;
      }

      toast.success("Registration successful!");

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

      setCurrentStep(8);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleComplete = async () => {
    const session = await fetch("/api/auth/session")
      .then((res) => res.json())
      .catch(() => null);

    const token = session?.accessToken;

    if (!token) {
      toast.error("Session not found. Please try logging in again.");
      return;
    }

    const rawStrength = (selectedValues.strength?.strengthsTitle || "").toLowerCase();

    let languageStrength = "Basic";
    if (rawStrength.includes("some words") || rawStrength.includes("phrases")) {
      languageStrength = "Elementary";
    } else if (rawStrength.includes("simple conversation")) {
      languageStrength = "Intermediate";
    } else if (rawStrength.includes("intermediate") || rawStrength.includes("above")) {
      languageStrength = "Advanced";
    }

    const profileData = {
      onboardInfo: {
        age: age.toString(),
        country: selectedValues.selectedCountry?.countryName || "",
        purpose: "",
        goalTime: parseInt(dailyGoal) || 10,
        userSource: (selectedValues.selectedSource?.sourceName || "").toLowerCase(),
        languageStrength,
      },
    };

    const profileResult = await createUserProfile(profileData, token);

    if (!profileResult.success) {
      toast.error(profileResult.error || "Failed to create profile");
      return;
    }

    localStorage.setItem(
      "nakhlah_onboarding",
      JSON.stringify({
        proficiencyLevel,
        dailyGoal,
        purpose,
        country,
        userSource,
        interests,
        name,
        age,
        email,
        completed: true,
      })
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
            title={onboardingData?.languageStrength?.strengthsTitleTop}
            levels={onboardingData?.languageStrength?.strengthsList || []}
            selectedLevel={proficiencyLevel}
            onSelect={setProficiencyLevel}
            getMediaUrl={getMediaUrl}
          />
        );
      case 2:
        return (
          <GoalStep
            title={onboardingData?.Goal?.goalTimeTopTitle}
            goals={onboardingData?.Goal?.goalList || []}
            selectedGoal={dailyGoal}
            onSelect={setDailyGoal}
            getMediaUrl={getMediaUrl}
          />
        );
      case 3:
        return (
          <PurposeStep
            title={onboardingData?.purpose?.purposeTitleTop}
            purposes={onboardingData?.purpose?.purposeList || []}
            selectedPurpose={purpose}
            onSelect={setPurpose}
            getMediaUrl={getMediaUrl}
          />
        );
      case 4:
        return (
          <CountryStep
            title={onboardingData?.Country?.countryNameTop}
            countries={onboardingData?.Country?.countryList || []}
            selectedCountry={country}
            onSelect={setCountry}
            getMediaUrl={getMediaUrl}
          />
        );
      case 5:
        return (
          <UserSourceStep
            title={onboardingData?.userSource?.sourceNameTop}
            sources={onboardingData?.userSource?.sourceList || []}
            userSource={userSource}
            onSelect={({ userSource: source }) => {
              if (source !== undefined) setUserSource(source);
            }}
            getMediaUrl={getMediaUrl}
          />
        );
      case 6:
        return (
          <InterestsStep
            title={onboardingData?.interests?.interestTitleTop}
            interests={onboardingData?.interests?.interestList || []}
            selectedInterests={interests}
            onToggle={toggleInterest}
            getMediaUrl={getMediaUrl}
          />
        );
      case 7:
        return (
          <AccountStep
            name={name}
            age={age}
            email={email}
            ageOptions={onboardingData?.age?.ageList || []}
            onChange={(fields) => {
              if (fields.name !== undefined) setName(fields.name);
              if (fields.age !== undefined) setAge(fields.age);
              if (fields.email !== undefined) setEmail(fields.email);
              if (fields.password !== undefined) setPassword(fields.password);
            }}
          />
        );
      case 8:
        return (
          <CompletionStep
            language={"arabic"}
            dailyGoal={dailyGoal}
            quizScore={0}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🌴</div>
            <span className="text-xl font-bold text-foreground">Nakhlah</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className=" container mx-auto px-4 py-6">
        <div className="max-w-[520px] mx-auto">
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-6 flex items-start justify-center">
        {isLoadingOnboarding ? (
          <div className="w-full max-w-xl mx-auto text-center text-muted-foreground">
            Loading onboarding options...
          </div>
        ) : loadingError ? (
          <div className="w-full max-w-xl mx-auto text-center space-y-4">
            <p className="text-destructive">{loadingError}</p>
            <Button variant="outline" onClick={loadOnboardingData}>
              Retry
            </Button>
          </div>
        ) : (
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
        )}
      </main>

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

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              disabled={isLoadingOnboarding || !!loadingError || !canProceed() || isRegistering}
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
