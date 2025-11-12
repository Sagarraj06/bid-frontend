// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//   },
//   proxy: {
//       '/api': {
//         target: 'http://localhost:4000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));

// vite.config.ts — corrected (full file)
// Move "proxy" inside server. Keep plugins/resolution intact.

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // https://vitejs.dev/config/
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:4000',
//         changeOrigin: true,
//         secure: false,
        
//       },
//     },
//   },
//   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));



// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // vite.config.ts
// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//     proxy: {
//       "/api": {
//         target: "http://localhost:4000",
//         changeOrigin: true,
//         secure: false,
//         // http-proxy options:
//         proxyTimeout: 180000, // timeout for proxy socket (ms)
//         timeout: 180000,      // connection timeout (ms)
//         // optionally, configure headers to disable proxy buffering:
//         configure: (proxy) => {
//           proxy.on("proxyReq", (proxyReq, req, res) => {
//             // reduce buffer issues
//             proxyReq.setHeader("Connection", "keep-alive");
//           });
//         },
//       },
//     },
//   },
//   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// }));
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // allows access from LAN / external IP if needed
    port: 8080,
    proxy: {
      // Forward any request starting with /api → to your backend
      "/api": {
        target: "http://161.118.181.8", // ✅ your backend base domain
        changeOrigin: true,             // ensures CORS works properly
        secure: false,                  // allows HTTP backend (not HTTPS)
        rewrite: (path) => path.replace(/^\/api/, "/api"), 
        // ⬆️ keeps the double /api/api/pdf path working correctly
        proxyTimeout: 180000, // proxy timeout (3 min)
        timeout: 180000,      // request timeout (3 min)
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("Connection", "keep-alive");
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
