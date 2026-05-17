import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "muted";
};

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20",
  outline: "bg-white text-green-700 ring-1 ring-inset ring-green-600",
  muted: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
