import type { Config } from "tailwindcss";

// all in fixtures is set to tailwind v3 as interims solutions

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			// Brand colors
  			brand: {
  				primary: 'hsl(var(--brand-primary))',
  				'primary-dark': 'hsl(var(--brand-primary-dark))',
  				secondary: 'hsl(var(--brand-secondary))',
  				accent: 'hsl(var(--brand-accent))',
  				highlight: 'hsl(var(--brand-highlight))'
  			},
  			// Semantic colors
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				secondary: 'hsl(var(--success-secondary))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				secondary: 'hsl(var(--warning-secondary))'
  			},
  			error: {
  				DEFAULT: 'hsl(var(--error))',
  				secondary: 'hsl(var(--error-secondary))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				secondary: 'hsl(var(--info-secondary))'
  			},
  			// Surface colors
  			surface: {
  				dark: 'hsl(var(--surface-dark))',
  				darker: 'hsl(var(--surface-darker))',
  				darkest: 'hsl(var(--surface-darkest))',
  				glass: 'hsl(var(--surface-glass))',
  				'glass-border': 'hsl(var(--surface-glass-border))'
  			},
  			// Text colors
  			text: {
  				primary: 'hsl(var(--text-primary))',
  				secondary: 'hsl(var(--text-secondary))',
  				muted: 'hsl(var(--text-muted))',
  				subtle: 'hsl(var(--text-subtle))',
  				faint: 'hsl(var(--text-faint))',
  				ghost: 'hsl(var(--text-ghost))'
  			}
  		},
  		fontSize: {
  			'2xs': '0.625rem', // 10px
  			xs: 'var(--font-size-xs)',
  			sm: 'var(--font-size-sm)',
  			base: 'var(--font-size-base)',
  			lg: 'var(--font-size-lg)',
  			xl: 'var(--font-size-xl)',
  			'2xl': 'var(--font-size-2xl)',
  			'3xl': 'var(--font-size-3xl)',
  			'4xl': 'var(--font-size-4xl)',
  			'5xl': 'var(--font-size-5xl)',
  			'6xl': 'var(--font-size-6xl)',
  			'7xl': 'var(--font-size-7xl)',
  		},
  		lineHeight: {
  			tight: 'var(--line-height-tight)',
  			snug: 'var(--line-height-snug)',
  			normal: 'var(--line-height-normal)',
  			relaxed: 'var(--line-height-relaxed)',
  			loose: 'var(--line-height-loose)',
  		},
  		spacing: {
  			'0': 'var(--spacing-0)',
  			'1': 'var(--spacing-1)',
  			'2': 'var(--spacing-2)',
  			'3': 'var(--spacing-3)',
  			'4': 'var(--spacing-4)',
  			'5': 'var(--spacing-5)',
  			'6': 'var(--spacing-6)',
  			'8': 'var(--spacing-8)',
  			'10': 'var(--spacing-10)',
  			'12': 'var(--spacing-12)',
  			'16': 'var(--spacing-16)',
  			'20': 'var(--spacing-20)',
  			'24': 'var(--spacing-24)',
  			'32': 'var(--spacing-32)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'collapsible-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-collapsible-content-height)'
  				}
  			},
  			'collapsible-up': {
  				from: {
  					height: 'var(--radix-collapsible-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'collapsible-down': 'collapsible-down 0.1s ease-out',
  			'collapsible-up': 'collapsible-up 0.1s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
