import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['src/components/admin/**/*.tsx'],
    rules: { '@next/next/no-img-element': 'off' },
  },
  globalIgnores([
    '.next/**',
    'media/**',
    'next-env.d.ts',
    'src/payload-types.ts',
    'src/app/(payload)/**',
  ]),
])
