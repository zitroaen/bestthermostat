// Regenerates the README screenshots in docs/images from the card demo.
// Usage: npm run build && npm run screenshots   (needs Playwright with Chromium)
import { createRequire } from "node:module";
import { serve } from "./serve.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const OUT = new URL("../../docs/images/", import.meta.url).pathname;
const BASE = "http://127.0.0.1:4173/frontend/demo/";

const server = await serve();
const browser = await chromium.launch();
async function shot(name, query, { width, height, action, clip = "#stage" }) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(`${BASE}?${query}`);
  await page.waitForSelector("#stage > *");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  if (action) await action(page);
  await page.waitForTimeout(300);
  const target = clip ? page.locator(clip) : page;
  await target.screenshot({ path: `${OUT}${name}.png` });
  await page.close();
}

await shot("room-card", "view=room", { width: 460, height: 900 });
await shot("overview", "view=overview", { width: 520, height: 1200 });
await shot("overview-tiles", "view=tiles", { width: 1180, height: 1400 });
await shot("week-editor", "view=room", {
  width: 460,
  height: 560,
  clip: null,
  action: (page) => page.locator("bestthermostat-card").locator("button.pencil").first().click(),
});
await browser.close();
server.close();
console.log("Screenshots written to docs/images/");
