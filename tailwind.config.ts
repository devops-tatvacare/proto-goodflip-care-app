import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        manrope: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Chart colors
        chart: {
          blue: "var(--chart-blue)",
          red: "var(--chart-red)",
          orange: "var(--chart-orange)",
          yellow: "var(--chart-yellow)",
          purple: "var(--chart-purple)",
          pink: "var(--chart-pink)",
        },
        // Metric semantic colors
        metric: {
          water: "var(--metric-water)",
          "blood-primary": "var(--metric-blood-primary)",
          "blood-secondary": "var(--metric-blood-secondary)",
          "nutrition-fat": "var(--metric-nutrition-fat)",
          "nutrition-diet": "var(--metric-nutrition-diet)",
          hormones: "var(--metric-hormones)",
          "hormones-secondary": "var(--metric-hormones-secondary)",
          sleep: "var(--metric-sleep)",
          muscle: "var(--metric-muscle)",
          "vitamins-green": "var(--metric-vitamins-green)",
          "vitamins-yellow": "var(--metric-vitamins-yellow)",
          minerals: "var(--metric-minerals)",
          "body-composition": "var(--metric-body-composition)",
          cardiovascular: "var(--metric-cardiovascular)",
          activity: "var(--metric-activity)",
          "nutrition-carbs": "var(--metric-nutrition-carbs)",
          "blood-pressure": "var(--metric-blood-pressure)",
          "lab-panel": "var(--metric-lab-panel)",
        },
        // Opacity tokens
        opacity: {
          primary: {
            5: "var(--primary-alpha-5)",
            8: "var(--primary-alpha-8)",
            10: "var(--primary-alpha-10)",
            15: "var(--primary-alpha-15)",
            20: "var(--primary-alpha-20)",
            30: "var(--primary-alpha-30)",
            40: "var(--primary-alpha-40)",
            50: "var(--primary-alpha-50)",
          },
          secondary: {
            5: "var(--secondary-alpha-5)",
            8: "var(--secondary-alpha-8)",
            10: "var(--secondary-alpha-10)",
            15: "var(--secondary-alpha-15)",
            20: "var(--secondary-alpha-20)",
          },
          white: {
            10: "var(--white-alpha-10)",
            12: "var(--white-alpha-12)",
            14: "var(--white-alpha-14)",
            15: "var(--white-alpha-15)",
            18: "var(--white-alpha-18)",
            20: "var(--white-alpha-20)",
            25: "var(--white-alpha-25)",
            40: "var(--white-alpha-40)",
            70: "var(--white-alpha-70)",
            90: "var(--white-alpha-90)",
            95: "var(--white-alpha-95)",
          },
          black: {
            5: "var(--black-alpha-5)",
            10: "var(--black-alpha-10)",
            20: "var(--black-alpha-20)",
            30: "var(--black-alpha-30)",
            50: "var(--black-alpha-50)",
            80: "var(--black-alpha-80)",
          },
        },
        // Surface and overlay colors
        overlay: {
          bg: "var(--overlay-bg)",
          "bg-heavy": "var(--overlay-bg-heavy)",
          "bg-light": "var(--overlay-bg-light)",
          border: "var(--overlay-border)",
          "border-light": "var(--overlay-border-light)",
        },
        surface: {
          elevated: "var(--surface-elevated)",
          glass: "var(--surface-glass)",
        },
      },
      backgroundColor: {
        "overlay-bg": "var(--overlay-bg)",
        "overlay-bg-heavy": "var(--overlay-bg-heavy)",
        "overlay-bg-light": "var(--overlay-bg-light)",
        "surface-elevated": "var(--surface-elevated)",
        "surface-glass": "var(--surface-glass)",
        "primary-5": "var(--primary-alpha-5)",
        "primary-10": "var(--primary-alpha-10)",
        "primary-15": "var(--primary-alpha-15)",
        "primary-20": "var(--primary-alpha-20)",
        "white-10": "var(--white-alpha-10)",
        "white-15": "var(--white-alpha-15)",
        "white-20": "var(--white-alpha-20)",
        "white-90": "var(--white-alpha-90)",
        "white-95": "var(--white-alpha-95)",
      },
      borderColor: {
        "overlay-border": "var(--overlay-border)",
        "overlay-border-light": "var(--overlay-border-light)",
        "primary-20": "var(--primary-alpha-20)",
        "white-10": "var(--white-alpha-10)",
        "white-20": "var(--white-alpha-20)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      transitionDuration: {
        'instant': 'var(--ds-transition-instant)',
        'fast': 'var(--ds-transition-fast)',
        'normal': 'var(--ds-transition-normal)',
        'slow': 'var(--ds-transition-slow)',
        'slower': 'var(--ds-transition-slower)',
      },
      transitionTimingFunction: {
        'linear': 'var(--ds-ease-linear)',
        'in': 'var(--ds-ease-in)',
        'out': 'var(--ds-ease-out)',
        'in-out': 'var(--ds-ease-in-out)',
        'spring': 'var(--ds-ease-spring)',
        'bounce': 'var(--ds-ease-bounce)',
        'smooth': 'var(--ds-ease-smooth)',
        'sharp': 'var(--ds-ease-sharp)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "scale-in": {
          from: { transform: "scale(0.9)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)", opacity: "1" },
          to: { transform: "scale(0.9)", opacity: "0" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down var(--ds-motion-fast)",
        "accordion-up": "accordion-up var(--ds-motion-fast)",
        "slide-up": "slide-up var(--ds-motion-normal)",
        "fade-in": "fade-in var(--ds-motion-fast)",
        "fade-out": "fade-out var(--ds-motion-fast)",
        "scale-in": "scale-in var(--ds-motion-spring-fast)",
        "scale-out": "scale-out var(--ds-motion-spring-fast)",
        "slide-in-left": "slide-in-left var(--ds-motion-smooth-normal)",
        "slide-in-right": "slide-in-right var(--ds-motion-smooth-normal)",
        "bounce-in": "bounce-in var(--ds-motion-bounce-normal)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("./plugins/tailwind-design-system-plugin")
  ],
} satisfies Config

export default config
