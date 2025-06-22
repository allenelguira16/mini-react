import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createServer as createViteServer } from "vite";
import pretty from "pretty";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
  app.use(vite.middlewares);

  app.use("*all", async (_req, res) => {
    // serve index.html - we will tackle this next

    let template = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf-8");

    const { render } = await vite.ssrLoadModule("./src/entry-server.tsx");

    const html = template.replace("<!--ssr-outlet-->", () => render());

    res.send(html);
  });

  app.listen(5173);
}

createServer();

// import express from "express";
// import { App } from "./App";

// const app = express();

// app.get("/", async (req, res) => {
//   // console.log();

//   res.send(`<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Veltra App</title>
//   </head>
//   <body>
//     <div id="app">${(<App />)}</div>
//   </body>
// </html>
// `);
// });

// app.listen(8000);
