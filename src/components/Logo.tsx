interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "default" | "light" | "dark";
}

export function Logo({ size = "md", showText = true, className = "", variant = "default" }: LogoProps) {
  const sizeClasses = {
    xs: "h-7 w-7",
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
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
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white shadow-md ring-2 ring-border shrink-0`}>
        <img
          src="/wostup.png"
          alt="Wostup logo"
          className="h-full w-full object-cover"
        />
      </div>
      {showText && (
        <span className={`${textSizeClasses[size]} font-bold ${variant === 'default' ? 'text-accent' : textColors[variant]}`}>
          Wostup
        </span>
      )}
    </div>
  );
}
