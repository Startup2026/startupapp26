import { Rocket } from "lucide-react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "light" | "dark";
}

export function Logo({ size = "md", showText = true, className = "", variant = "default" }: LogoProps) {
  const sizeClasses = {
    xs: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textSizeClasses = {
    xs: "text-base",
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  const textColors = {
    default: "text-accent",
    light: "text-white",
    dark: "text-foreground",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-xl bg-accent flex items-center justify-center shadow-md shadow-accent/25`}>
        <Rocket className="text-accent-foreground" style={{ width: '60%', height: '60%' }} />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold ${variant === 'default' ? 'text-accent' : textColors[variant]}`}>
          Wostup
        </span>
      )}
    </div>
  );
}
