import express, { Request, Response } from "express";
import { generateImage } from "./generate-image";
import fs from "fs";
import path from "path";

const app = express();

const findFilesInDir = (dir: string) => {
  return fs
    .readdirSync(dir)
    .filter((el) => path.extname(el) === ".tsx")
    .map((el) => path.basename(el, path.extname(el)));
};

// const pages = fs.readdirSync("src/pages")

// console.log(pages);

// for (const page of pages){
//     const content = fs.readFileSync(`src/pages/${page}` , {encoding : 'utf-8'})
//     console.log(content);
// }

app.get("*", async (req: Request, res: Response) => {
  const pages = findFilesInDir("src/pages");
  const visitedPage = req.path.slice(1);
  const isRouteExist = pages.includes(visitedPage);

  if (!isRouteExist) {
    return res.status(404).send("Not found");
  }

  const pageScript = fs.readFileSync(
    path.resolve(__dirname, "..", "bundle", `${visitedPage}.js`),
    "utf-8"
  );

  const generatedOG = await generateImage({
    data: req.query,
    pageScript,
  });

  res
    .status(200)
    .header("Content-Type", "image/png")
    .header("Content-Length", generatedOG.length.toString())
    .send(generatedOG);
});

app.listen("8000", () => {
  console.log("Server is ready on http://localhost:8000");
});
