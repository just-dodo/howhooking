import { ReactNode } from "react";

interface FeatureSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  alignment?: "start" | "center" | "end";
}

export function FeatureSection({
  title,
  subtitle,
  children,
  alignment = "start",
}: FeatureSectionProps) {
  return (
    <>
      <div className="flex flex-col items-stretch gap-2 p-4 bg-white/0 rounded-3xl border border-white/10 w-full">
        <h2
          className={`font-bold text-white text-4xl text-${alignment} font-playfair italic leading-none`}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={`text-white/70 text-sm !mt-0 p-0 text-${alignment}`}>
            {subtitle}
          </p>
        )}
      <div className="grid grid-cols-2 gap-4">{children}</div>
      </div>
    </>
  );
}
