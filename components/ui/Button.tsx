import { forwardRef } from "react";
import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]";

const variants: Record<"primary" | "secondary" | "ghost", string> = {
  primary:
    "rounded-full bg-gradient-to-r from-brand-orange to-brand-orange-dk px-7 py-3 text-white shadow-orange hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(249,115,22,0.45)] hover:brightness-110",
  secondary:
    "rounded-full border-2 border-brand-green bg-white px-7 py-3 text-brand-green-dk shadow-sm hover:-translate-y-0.5 hover:bg-brand-green-lt hover:shadow-green",
  ghost:
    "rounded-full px-4 py-2 text-brand-orange hover:bg-brand-orange-lt/40 hover:text-brand-orange-dk",
};

type ButtonBase = {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children?: React.ReactNode;
};

export type ButtonProps = ButtonBase &
  (
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
    | (Omit<LinkProps, "className" | "children"> & { href: string })
  );

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const { variant = "primary", className, children, ...rest } = props;
    const cls = cn(base, variants[variant], className);

    if ("href" in rest && typeof rest.href === "string") {
      const { href, prefetch, replace, scroll, shallow, locale, ...anchorRest } = rest;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          prefetch={prefetch}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          locale={locale}
          className={cls}
          {...anchorRest}
        >
          {children}
        </Link>
      );
    }

    const btn = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={btn.type ?? "button"}
        className={cls}
        {...btn}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";