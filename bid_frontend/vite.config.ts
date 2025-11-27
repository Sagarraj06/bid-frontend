// // // import { defineConfig } from "vite";
// // // import react from "@vitejs/plugin-react-swc";
// // // import path from "path";
// // // import { componentTagger } from "lovable-tagger";

// // // // https://vitejs.dev/config/
// // // export default defineConfig(({ mode }) => ({
// // //   server: {
// // //     host: "::",
// // //     port: 8080,
// // //   },
// // //   proxy: {
// // //       '/api': {
// // //         target: 'http://localhost:4000',
// // //         changeOrigin: true,
// // //         secure: false,
// // //       },
// // //     },
// // //   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
// // //   resolve: {
// // //     alias: {
// // //       "@": path.resolve(__dirname, "./src"),
// // //     },
// // //   },
// // // }));

// // // vite.config.ts — corrected (full file)
// // // Move "proxy" inside server. Keep plugins/resolution intact.

// // // import { defineConfig } from "vite";
// // // import react from "@vitejs/plugin-react-swc";
// // // import path from "path";
// // // import { componentTagger } from "lovable-tagger";

// // // // https://vitejs.dev/config/
// // // export default defineConfig(({ mode }) => ({
// // //   server: {
// // //     host: "::",
// // //     port: 8080,
// // //     proxy: {
// // //       '/api': {
// // //         target: 'http://localhost:4000',
// // //         changeOrigin: true,
// // //         secure: false,
        
// // //       },
// // //     },
// // //   },
// // //   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
// // //   resolve: {
// // //     alias: {
// // //       "@": path.resolve(__dirname, "./src"),
// // //     },
// // //   },
// // // }));



// // import { defineConfig } from "vite";
// // import react from "@vitejs/plugin-react-swc";
// // import path from "path";
// // import { componentTagger } from "lovable-tagger";

// // // vite.config.ts
// // export default defineConfig(({ mode }) => ({
// //   server: {
// //     host: "::",
// //     port: 8080,
// //     proxy: {
// //       "/api": {
// //         target: "http://localhost:4000",
// //         changeOrigin: true,
// //         secure: false,
// //         // http-proxy options:
// //         proxyTimeout: 180000, // timeout for proxy socket (ms)
// //         timeout: 180000,      // connection timeout (ms)
// //         // optionally, configure headers to disable proxy buffering:
// //         configure: (proxy) => {
// //           proxy.on("proxyReq", (proxyReq, req, res) => {
// //             // reduce buffer issues
// //             proxyReq.setHeader("Connection", "keep-alive");
// //           });
// //         },
// //       },
// //     },
// //   },
// //   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "./src"),
// //     },
// //   },
// // }));


// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
// import path from "path";
// import { componentTagger } from "lovable-tagger";

// // export default defineConfig(({ mode }) => ({
// //   server: {
// //     host: "::", // allows access from LAN / external IP if needed
// //     port: 8080,
// //     proxy: {
// //       // Forward any request starting with /api → to your backend
// //       "/api": {
// //         // target: "http://161.118.181.8", // ✅ your backend base domain
// //         target: "http://localhost:4000", // for local testing
// //         changeOrigin: true,             // ensures CORS works properly
// //         secure: false,                  // allows HTTP backend (not HTTPS)
// //         rewrite: (path) => path.replace(/^\/api/, "/api"), 
// //         // ⬆️ keeps the double /api/api/pdf path working correctly
// //         proxyTimeout: 180000, // proxy timeout (3 min)
// //         timeout: 180000,      // request timeout (3 min)
// //         configure: (proxy) => {
// //           proxy.on("proxyReq", (proxyReq) => {
// //             proxyReq.setHeader("Connection", "keep-alive");
// //           });
// //         },
// //       },
// //     },
// //   },
// //   plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
// //   resolve: {
// //     alias: {
// //       "@": path.resolve(__dirname, "./src"),
// //     },
// //   },
// // }));

// export default defineConfig(({ mode }) => ({
//   server: {
//     host: "::",
//     port: 8080,
//     proxy: {
//       // =======================
//       // 1) Existing /api proxy
//       // =======================
//       "/api": {
//         target: "http://localhost:4000",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, "/api"),
//         proxyTimeout: 180000,
//         timeout: 180000,
//         configure: (proxy) => {
//           proxy.on("proxyReq", (proxyReq) => {
//             proxyReq.setHeader("Connection", "keep-alive");
//           });
//         },
//       },

//       // =========================
//       // 2) NEW /search proxy
//       // =========================
//       // '/sellers': {
//       //   target: 'http://localhost:4000',
//       //   // target: 'http://35.244.20.253:9200',
//       //   changeOrigin: true,
//       //   //rewrite: (path) => `/api${path}`, // /sellers/search → /api/sellers/search
//       // },
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
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // keep path identical (/api → /api)
        rewrite: (path) => path,
        proxyTimeout: 180000,
        timeout: 180000,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(`[proxy] ${req.method} ${req.url} -> ${proxyReq.host}`);
          });
        },
      },
      "/sellers": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // /sellers/... → /api/sellers/...
        rewrite: (path) => `/api${path}`,
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