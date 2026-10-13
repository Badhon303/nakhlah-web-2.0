import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GlowingStar } from "@/components/icons/GlowingStar";
import { useRouter } from "next/navigation";

export default function MotivationCard() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-accent text-accent-foreground shadow-lg"
    >
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-[22px] border-white/10" />
      <div className="relative p-6">
        <div className="mb-5 text-center">
          <GlowingStar size="lg" className="mx-auto pb-2 text-center" />
          <h3 className="mb-2 text-xl font-extrabold">Keep going!</h3>
          <p className="text-sm leading-6 text-accent-foreground/80">
            You&apos;re doing amazing! Keep up the great work and reach new
            heights.
          </p>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="w-full rounded-xl bg-card font-bold text-accent hover:bg-card/90"
        >
          Continue Learning
        </Button>
      </div>
    </motion.div>
  );
}
