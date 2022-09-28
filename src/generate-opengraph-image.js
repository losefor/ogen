const fs = require("fs");
const path = require('path')
const playwright = require("playwright-aws-lambda");

const script = fs.readFileSync(path.resolve(__dirname,".."  , 'dist', "bundle.js"), "utf-8");

const generateOG = async function (queries) {
  // Open the browser
  const browser = await playwright.launchChromium();
  const context = await browser.newContext();


  const page = await context.newPage();
  page.setViewportSize({
    width: 1200,
    height: 630
  });
  await page.setContent(`<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>React - Rollup Test</title>
    </head>
    <body>
      <noscript> You need to enable JavaScript to run this app. </noscript>
      <div id="root"></div>
      <script src="../dist/bundle.js"></script>
    </body>
  </html>
  
  `);
  const queryStringParameters = queries;
  const tags = queryStringParameters?.tags
    ? decodeURIComponent(queryStringParameters.tags).split(",")
    : [];
  await page.addScriptTag({
    content: `
  window.title = "${queryStringParameters?.title || "No Title"}";
  window.tags = ${JSON.stringify(tags)};
  window.author = "${queryStringParameters?.author || ""}";
  `
  });
  await page.addScriptTag({ content: script });

  const boundingRect = await page.evaluate(() => {
    const root = document.getElementById("root");
    const { x, y, width, height } = root.children[0].getBoundingClientRect();
    return { x, y, width, height };
  });

  const screenshotBuffer = await page.screenshot({ clip: boundingRect, path: "test.png" });
  await browser.close();
  // return {
  //   isBase64Encoded: true,
  //   statusCode: 200,
  //   headers: {
  //     "Content-Type": "image/png",
  //     "Content-Length": screenshotBuffer.length.toString()
  //   },
  //   body: screenshotBuffer.toString("base64")
  // };
};

generateOG()