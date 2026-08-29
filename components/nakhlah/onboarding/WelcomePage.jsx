import { Button } from "@/components/ui/button";
import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

export function WelcomeStep({ onStart, onLogin }) {
  return (
    <div className="w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
      {/* speech bubble */}
      <div className="bg-card shadow-sm px-4 py-2 rounded-full text-sm mb-4">
        Hi there! I’m Ruthanah!
      </div>

      {/* mascot */}
      <FreshDateMascot mood="happy" size="xxl" />

      {/* app title */}
      <h1 className="text-3xl font-bold text-accent mb-2">Nakhlah</h1>

      <p className="text-muted-foreground mb-10">
        Learn Arabic whenever and wherever you want. It’s free and forever.
      </p>

      {/* buttons */}
      <Button
        className="w-full bg-accent text-accent-foreground font-semibold mb-3"
        onClick={onStart}
      >
        GET STARTED
      </Button>

      <Button
        variant="secondary"
        className="w-full bg-muted text-foreground"
        onClick={onLogin}
      >
        I ALREADY HAVE AN ACCOUNT
      </Button>
    </div>
  );
}
