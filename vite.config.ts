
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 8080,
    allowedHosts: [
      '72ea7269-d7f0-46f0-a6b2-6b04caf8d0ad.lovableproject.com',
      '1c77c54c-8e3d-42bd-acb2-dc81cad06f8b.lovableproject.com',
      '117003f8-1b25-4efb-bfbd-ffe73ad40823.lovableproject.com',
      '8ebcacba-c862-44e2-9a1c-388f748ee1a4.lovableproject.com'
    ],
    mimeTypes: {
      'text/javascript': ['ts', 'tsx', 'js', 'jsx'],
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 8080,
      clientPort: 8080,
      timeout: 120000,
    },
  },
  plugins: [
    react({
      tsDecorators: true
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: mode !== 'development',
    rollupOptions: {
      output: {
        sourcemapExcludeSources: true,
        sourcemapBaseUrl: 'http://localhost:8080'
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    force: true,
  }
}));
