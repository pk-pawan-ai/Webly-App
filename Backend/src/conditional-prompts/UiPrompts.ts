export const uiPrompts = {
    reactUiPrompt : "eslint.config.js:\n```\nimport js from '@eslint/js';\nimport globals from 'globals';\nimport reactHooks from 'eslint-plugin-react-hooks';\nimport reactRefresh from 'eslint-plugin-react-refresh';\nimport tseslint from 'typescript-eslint';\n\nexport default tseslint.config(\n  { ignores: ['dist'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: ['**/*.{ts,tsx}'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      'react-hooks': reactHooks,\n      'react-refresh': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      'react-refresh/only-export-components': [\n        'warn',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n\n```\n\nindex.html:\n```\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n\n```\n\npackage.json:\n```\n{\n  \"name\": \"vite-react-typescript-starter\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"lint\": \"eslint .\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"lucide-react\": \"^0.344.0\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  },\n  \"devDependencies\": {\n    \"@eslint/js\": \"^9.9.1\",\n    \"@types/react\": \"^18.3.5\",\n    \"@types/react-dom\": \"^18.3.0\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"autoprefixer\": \"^10.4.18\",\n    \"eslint\": \"^9.9.1\",\n    \"eslint-plugin-react-hooks\": \"^5.1.0-rc.0\",\n    \"eslint-plugin-react-refresh\": \"^0.4.11\",\n    \"globals\": \"^15.9.0\",\n    \"postcss\": \"^8.4.35\",\n    \"tailwindcss\": \"^3.4.1\",\n    \"typescript\": \"^5.5.3\",\n    \"typescript-eslint\": \"^8.3.0\",\n    \"vite\": \"^5.4.2\"\n  }\n}\n\n```\n\npostcss.config.js:\n```\nexport default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n\n```\n\nsrc/App.tsx:\n```\nimport React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n\n```\n\nsrc/index.css:\n```\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n```\n\nsrc/main.tsx:\n```\nimport { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n\n```\n\nsrc/vite-env.d.ts:\n```\n/// <reference types=\"vite/client\" />\n\n```\n\ntailwind.config.js:\n```\n/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n\n```\n\ntsconfig.app.json:\n```\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"src\"]\n}\n\n```\n\ntsconfig.json:\n```\n{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n\n```\n\ntsconfig.node.json:\n```\n{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"lib\": [\"ES2023\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"vite.config.ts\"]\n}\n\n```\n\nvite.config.ts:\n```\nimport { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: ['lucide-react'],\n  },\n});\n\n```",
    nextjsUiPrompt : "\n\n.eslintrc.json:\n```\n{\n  \"extends\": \"next/core-web-vitals\"\n}\n\n```\n\napp/globals.css:\n```\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --foreground-rgb: 0, 0, 0;\n  --background-start-rgb: 214, 219, 220;\n  --background-end-rgb: 255, 255, 255;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --foreground-rgb: 255, 255, 255;\n    --background-start-rgb: 0, 0, 0;\n    --background-end-rgb: 0, 0, 0;\n  }\n}\n\n@layer base {\n  :root {\n    --background: 0 0% 100%;\n    --foreground: 0 0% 3.9%;\n    --card: 0 0% 100%;\n    --card-foreground: 0 0% 3.9%;\n    --popover: 0 0% 100%;\n    --popover-foreground: 0 0% 3.9%;\n    --primary: 0 0% 9%;\n    --primary-foreground: 0 0% 98%;\n    --secondary: 0 0% 96.1%;\n    --secondary-foreground: 0 0% 9%;\n    --muted: 0 0% 96.1%;\n    --muted-foreground: 0 0% 45.1%;\n    --accent: 0 0% 96.1%;\n    --accent-foreground: 0 0% 9%;\n    --destructive: 0 84.2% 60.2%;\n    --destructive-foreground: 0 0% 98%;\n    --border: 0 0% 89.8%;\n    --input: 0 0% 89.8%;\n    --ring: 0 0% 3.9%;\n    --chart-1: 12 76% 61%;\n    --chart-2: 173 58% 39%;\n    --chart-3: 197 37% 24%;\n    --chart-4: 43 74% 66%;\n    --chart-5: 27 87% 67%;\n    --radius: 0.5rem;\n  }\n  .dark {\n    --background: 0 0% 3.9%;\n    --foreground: 0 0% 98%;\n    --card: 0 0% 3.9%;\n    --card-foreground: 0 0% 98%;\n    --popover: 0 0% 3.9%;\n    --popover-foreground: 0 0% 98%;\n    --primary: 0 0% 98%;\n    --primary-foreground: 0 0% 9%;\n    --secondary: 0 0% 14.9%;\n    --secondary-foreground: 0 0% 98%;\n    --muted: 0 0% 14.9%;\n    --muted-foreground: 0 0% 63.9%;\n    --accent: 0 0% 14.9%;\n    --accent-foreground: 0 0% 98%;\n    --destructive: 0 62.8% 30.6%;\n    --destructive-foreground: 0 0% 98%;\n    --border: 0 0% 14.9%;\n    --input: 0 0% 14.9%;\n    --ring: 0 0% 83.1%;\n    --chart-1: 220 70% 50%;\n    --chart-2: 160 60% 45%;\n    --chart-3: 30 80% 55%;\n    --chart-4: 280 65% 60%;\n    --chart-5: 340 75% 55%;\n  }\n}\n\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground;\n  }\n}\n\n```\n\napp/layout.tsx:\n```\nimport './globals.css';\nimport type { Metadata } from 'next';\nimport { Inter } from 'next/font/google';\n\nconst inter = Inter({ subsets: ['latin'] });\n\nexport const metadata: Metadata = {\n  title: 'Create Next App',\n  description: 'Generated by create next app',\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang=\"en\">\n      <body className={inter.className}>{children}</body>\n    </html>\n  );\n}\n\n```\n\napp/page.tsx:\n```\nexport default function Home() {\n  return (\n    <div\n      style={{\n        maxWidth: 1280,\n        margin: '0 auto',\n        padding: '2rem',\n        textAlign: 'center',\n      }}\n    >\n      Start prompting.\n    </div>\n  );\n}\n\n```\n\ncomponents.json:\n```\n{\n  \"$schema\": \"https://ui.shadcn.com/schema.json\",\n  \"style\": \"default\",\n  \"rsc\": true,\n  \"tsx\": true,\n  \"tailwind\": {\n    \"config\": \"tailwind.config.ts\",\n    \"css\": \"app/globals.css\",\n    \"baseColor\": \"neutral\",\n    \"cssVariables\": true,\n    \"prefix\": \"\"\n  },\n  \"aliases\": {\n    \"components\": \"@/components\",\n    \"utils\": \"@/lib/utils\",\n    \"ui\": \"@/components/ui\",\n    \"lib\": \"@/lib\",\n    \"hooks\": \"@/hooks\"\n  }\n}\n\n```\n\nlib/utils.ts:\n```\nimport { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n\n```\n\nnext.config.js:\n```\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  output: 'export',\n  eslint: {\n    ignoreDuringBuilds: true,\n  },\n  images: { unoptimized: true },\n};\n\nmodule.exports = nextConfig;\n\n```\n\npackage.json:\n```\n{\n  \"name\": \"nextjs\",\n  \"version\": \"0.1.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"start\": \"next start\",\n    \"lint\": \"next lint\"\n  },\n  \"dependencies\": {\n    \"@hookform/resolvers\": \"^3.9.0\",\n    \"@next/swc-wasm-nodejs\": \"13.5.1\",\n    \"@radix-ui/react-accordion\": \"^1.2.0\",\n    \"@radix-ui/react-alert-dialog\": \"^1.1.1\",\n    \"@radix-ui/react-aspect-ratio\": \"^1.1.0\",\n    \"@radix-ui/react-avatar\": \"^1.1.0\",\n    \"@radix-ui/react-checkbox\": \"^1.1.1\",\n    \"@radix-ui/react-collapsible\": \"^1.1.0\",\n    \"@radix-ui/react-context-menu\": \"^2.2.1\",\n    \"@radix-ui/react-dialog\": \"^1.1.1\",\n    \"@radix-ui/react-dropdown-menu\": \"^2.1.1\",\n    \"@radix-ui/react-hover-card\": \"^1.1.1\",\n    \"@radix-ui/react-label\": \"^2.1.0\",\n    \"@radix-ui/react-menubar\": \"^1.1.1\",\n    \"@radix-ui/react-navigation-menu\": \"^1.2.0\",\n    \"@radix-ui/react-popover\": \"^1.1.1\",\n    \"@radix-ui/react-progress\": \"^1.1.0\",\n    \"@radix-ui/react-radio-group\": \"^1.2.0\",\n    \"@radix-ui/react-scroll-area\": \"^1.1.0\",\n    \"@radix-ui/react-select\": \"^2.1.1\",\n    \"@radix-ui/react-separator\": \"^1.1.0\",\n    \"@radix-ui/react-slider\": \"^1.2.0\",\n    \"@radix-ui/react-slot\": \"^1.1.0\",\n    \"@radix-ui/react-switch\": \"^1.1.0\",\n    \"@radix-ui/react-tabs\": \"^1.1.0\",\n    \"@radix-ui/react-toast\": \"^1.2.1\",\n    \"@radix-ui/react-toggle\": \"^1.1.0\",\n    \"@radix-ui/react-toggle-group\": \"^1.1.0\",\n    \"@radix-ui/react-tooltip\": \"^1.1.2\",\n    \"@types/node\": \"20.6.2\",\n    \"@types/react\": \"18.2.22\",\n    \"@types/react-dom\": \"18.2.7\",\n    \"autoprefixer\": \"10.4.15\",\n    \"class-variance-authority\": \"^0.7.0\",\n    \"clsx\": \"^2.1.1\",\n    \"cmdk\": \"^1.0.0\",\n    \"date-fns\": \"^3.6.0\",\n    \"embla-carousel-react\": \"^8.3.0\",\n    \"eslint\": \"8.49.0\",\n    \"eslint-config-next\": \"13.5.1\",\n    \"input-otp\": \"^1.2.4\",\n    \"lucide-react\": \"^0.446.0\",\n    \"next\": \"13.5.1\",\n    \"next-themes\": \"^0.3.0\",\n    \"postcss\": \"8.4.30\",\n    \"react\": \"18.2.0\",\n    \"react-day-picker\": \"^8.10.1\",\n    \"react-dom\": \"18.2.0\",\n    \"react-hook-form\": \"^7.53.0\",\n    \"react-resizable-panels\": \"^2.1.3\",\n    \"recharts\": \"^2.12.7\",\n    \"sonner\": \"^1.5.0\",\n    \"tailwind-merge\": \"^2.5.2\",\n    \"tailwindcss\": \"3.3.3\",\n    \"tailwindcss-animate\": \"^1.0.7\",\n    \"typescript\": \"5.2.2\",\n    \"vaul\": \"^0.9.9\",\n    \"zod\": \"^3.23.8\"\n  }\n}\n\n```\n\npostcss.config.js:\n```\nmodule.exports = {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n\n```\n\ntailwind.config.ts:\n```\nimport type { Config } from 'tailwindcss';\n\nconst config: Config = {\n  darkMode: ['class'],\n  content: [\n    './pages/**/*.{js,ts,jsx,tsx,mdx}',\n    './components/**/*.{js,ts,jsx,tsx,mdx}',\n    './app/**/*.{js,ts,jsx,tsx,mdx}',\n  ],\n  theme: {\n    extend: {\n      backgroundImage: {\n        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',\n        'gradient-conic':\n          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',\n      },\n      borderRadius: {\n        lg: 'var(--radius)',\n        md: 'calc(var(--radius) - 2px)',\n        sm: 'calc(var(--radius) - 4px)',\n      },\n      colors: {\n        background: 'hsl(var(--background))',\n        foreground: 'hsl(var(--foreground))',\n        card: {\n          DEFAULT: 'hsl(var(--card))',\n          foreground: 'hsl(var(--card-foreground))',\n        },\n        popover: {\n          DEFAULT: 'hsl(var(--popover))',\n          foreground: 'hsl(var(--popover-foreground))',\n        },\n        primary: {\n          DEFAULT: 'hsl(var(--primary))',\n          foreground: 'hsl(var(--primary-foreground))',\n        },\n        secondary: {\n          DEFAULT: 'hsl(var(--secondary))',\n          foreground: 'hsl(var(--secondary-foreground))',\n        },\n        muted: {\n          DEFAULT: 'hsl(var(--muted))',\n          foreground: 'hsl(var(--muted-foreground))',\n        },\n        accent: {\n          DEFAULT: 'hsl(var(--accent))',\n          foreground: 'hsl(var(--accent-foreground))',\n        },\n        destructive: {\n          DEFAULT: 'hsl(var(--destructive))',\n          foreground: 'hsl(var(--destructive-foreground))',\n        },\n        border: 'hsl(var(--border))',\n        input: 'hsl(var(--input))',\n        ring: 'hsl(var(--ring))',\n        chart: {\n          '1': 'hsl(var(--chart-1))',\n          '2': 'hsl(var(--chart-2))',\n          '3': 'hsl(var(--chart-3))',\n          '4': 'hsl(var(--chart-4))',\n          '5': 'hsl(var(--chart-5))',\n        },\n      },\n      keyframes: {\n        'accordion-down': {\n          from: {\n            height: '0',\n          },\n          to: {\n            height: 'var(--radix-accordion-content-height)',\n          },\n        },\n        'accordion-up': {\n          from: {\n            height: 'var(--radix-accordion-content-height)',\n          },\n          to: {\n            height: '0',\n          },\n        },\n      },\n      animation: {\n        'accordion-down': 'accordion-down 0.2s ease-out',\n        'accordion-up': 'accordion-up 0.2s ease-out',\n      },\n    },\n  },\n  plugins: [require('tailwindcss-animate')],\n};\nexport default config;\n\n```\n\ntsconfig.json:\n```\n{\n  \"compilerOptions\": {\n    \"target\": \"es5\",\n    \"lib\": [\"dom\", \"dom.iterable\", \"esnext\"],\n    \"allowJs\": true,\n    \"skipLibCheck\": true,\n    \"strict\": true,\n    \"noEmit\": true,\n    \"esModuleInterop\": true,\n    \"module\": \"esnext\",\n    \"moduleResolution\": \"bundler\",\n    \"resolveJsonModule\": true,\n    \"isolatedModules\": true,\n    \"jsx\": \"preserve\",\n    \"incremental\": true,\n    \"plugins\": [\n      {\n        \"name\": \"next\"\n      }\n    ],\n    \"paths\": {\n      \"@/*\": [\"./*\"]\n    }\n  },\n  \"include\": [\"next-env.d.ts\", \"**/*.ts\", \"**/*.tsx\", \".next/types/**/*.ts\"],\n  \"exclude\": [\"node_modules\"]\n}\n\n```\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n  - .bolt/ignore\n  - .bolt/prompt\n  - hooks/use-toast.ts\n  - components/ui/alert-dialog.tsx\n  - components/ui/accordion.tsx\n  - components/ui/alert.tsx\n  - components/ui/avatar.tsx\n  - components/ui/aspect-ratio.tsx\n  - components/ui/badge.tsx\n  - components/ui/breadcrumb.tsx\n  - components/ui/button.tsx\n  - components/ui/card.tsx\n  - components/ui/calendar.tsx\n  - components/ui/carousel.tsx\n  - components/ui/chart.tsx\n  - components/ui/checkbox.tsx\n  - components/ui/collapsible.tsx\n  - components/ui/command.tsx\n  - components/ui/context-menu.tsx\n  - components/ui/dialog.tsx\n  - components/ui/drawer.tsx\n  - components/ui/dropdown-menu.tsx\n  - components/ui/form.tsx\n  - components/ui/hover-card.tsx\n  - components/ui/input-otp.tsx\n  - components/ui/input.tsx\n  - components/ui/label.tsx\n  - components/ui/menubar.tsx\n  - components/ui/navigation-menu.tsx\n  - components/ui/pagination.tsx\n  - components/ui/popover.tsx\n  - components/ui/progress.tsx\n  - components/ui/radio-group.tsx\n  - components/ui/resizable.tsx\n  - components/ui/scroll-area.tsx\n  - components/ui/select.tsx\n  - components/ui/sheet.tsx\n  - components/ui/separator.tsx\n  - components/ui/skeleton.tsx\n  - components/ui/slider.tsx\n  - components/ui/sonner.tsx\n  - components/ui/switch.tsx\n  - components/ui/table.tsx\n  - components/ui/tabs.tsx\n  - components/ui/textarea.tsx\n  - components/ui/toaster.tsx\n  - components/ui/toast.tsx\n  - components/ui/toggle-group.tsx\n  - components/ui/toggle.tsx\n  - components/ui/tooltip.tsx"
}