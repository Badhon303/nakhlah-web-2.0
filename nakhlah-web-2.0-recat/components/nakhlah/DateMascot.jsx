import { motion } from "framer-motion";

const moodToSvg = {
  happy: "happy.svg",
  excited: "excited.svg",
  celebrating: "celebrating.svg",
  sleeping: "sleeping.svg",
  sad: "sad.svg",
  thinking: "thinking.svg",
  focused: "focused.svg",
  encouraging: "encouraging.svg",
  cool: "cool.svg",
  proud: "proud.svg",
  confident: "confident.svg",
  surprised: "surprised.svg",
  default: "default.svg",
};

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 80,
  xl: 100,
  xxl: 128,
  xxxl: 160,
  xxxxl: 192,
};

export const FreshDateMascot = ({
  mood = "happy",
  size = "md",
  className = "",
  message,
}) => {
  const dimensions = sizeMap[size] || sizeMap.md;
  const svgFile = moodToSvg[mood] || moodToSvg.default;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="shrink-0"
        style={{ width: dimensions, height: dimensions }}
      >
        <img
          src={`/mascots/${svgFile}`}
          alt={`Mascot ${mood}`}
          width={dimensions}
          height={dimensions}
          className="block w-full h-full object-contain"
        />
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mt-3 relative"
        >
          <div className="bg-card border-2 border-border rounded-2xl px-4 py-2 shadow-md max-w-[200px]">
            <p className="text-sm font-semibold text-foreground text-center">
              {message}
            </p>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-card border-l-2 border-t-2 border-border rotate-45" />
        </motion.div>
      )}
    </div>
  );
};
