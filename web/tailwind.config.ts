import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind CSS v4 configuration for all apps.
 * Most theme configuration is now in globals.css using @theme.
 * Apps should extend this config and add their own content paths.
 */
const config = {
  darkMode: 'class',
  content: [
    // This will be extended by each app
  ],
} satisfies Config;

export default config;
