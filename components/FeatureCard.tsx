import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-start gap-2 p-4 bg-white/5 rounded-2xl border border-white/10">
      <Icon className={`w-8 h-8 ${iconColor} flex-shrink-0 mt-1`} />
      <div className="flex flex-col w-full items-start ">
        <h4 className="text-white w-full font-semibold mb-1">{title}</h4>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );
}
