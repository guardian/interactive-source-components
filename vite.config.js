import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

// Plugin to serve /dist files from the project root
function serveDistPlugin() {
  return {
    name: "serve-dist",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/dist/")) {
          const filePath = path.join(process.cwd(), req.url);
          if (fs.existsSync(filePath)) {
            res.setHeader("Content-Type", "text/css");
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: "sandbox",
  server: {
    open: true,
  },
  plugins: [serveDistPlugin()],
});
