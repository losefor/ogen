const fs = require("fs");
const path = require("path");
const playwright = require("playwright-aws-lambda");

const script = fs.readFileSync(path.resolve(__dirname, "bundle.js"), "utf-8");
const html = fs.readFileSync(
  path.resolve(__dirname, "..", "index.html"),
  "utf-8"
);

export const generateOG = async function (queries: any) {
  // Open the browser
  const browser = await playwright.launchChromium({
    headless: true,
  });
  const context = await browser.newContext();

  const page = await context.newPage();
  page.setViewportSize({
    width: 1200,
    height: 630,
  });
  await page.setContent(html);

  // Inject queries into react global window object

  const parseObjIntoScript = (obj: any) => {
    if (!obj) {
      return null;
    }

    let data = ``;
    for (const key in obj) {
      if (typeof obj[key] === "string") {
        data = data.concat(`window._base.${key}="${obj[key]}";`);
        continue;
      }
    }
    return data;
  };

  // const tags = queryStringParameters?.tags
  // ? decodeURIComponent(queryStringParameters.tags).split(",")
  // : [];
  const parsedScript = parseObjIntoScript(queries);

  if (parsedScript) {
    await page.addScriptTag({ content: `window._base={}` });
    await page.addScriptTag({
      content: parsedScript,
    });
  }

  await page.addScriptTag({ content: script });

  const boundingRect = await page.evaluate(() => {
    const rootElement = document.getElementById("root");
    return rootElement.children[0].getBoundingClientRect();
  });

  const screenshotBuffer = await page.screenshot({
    clip: boundingRect,
    path: "test.png",
  });
  await browser.close();

  return screenshotBuffer;
};
