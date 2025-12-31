import { Rocket } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-xl bg-accent flex items-center justify-center shadow-md shadow-accent/25`}>
        <Rocket className="text-accent-foreground" style={{ width: '60%', height: '60%' }} />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold text-foreground`}>
          Pitch<span className="text-accent">It</span>
        </span>
      )}
    </div>
  );
}
