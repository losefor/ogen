import express, { Request, Response } from "express";
const { generateOG } = require("./generate-opengraph-image");
const fs = require("fs");

const app = express();

// const pages = fs.readdirSync("src/pages")

// console.log(pages);

// for (const page of pages){
//     const content = fs.readFileSync(`src/pages/${page}` , {encoding : 'utf-8'})
//     console.log(content);
// }

app.get("/", async (req: Request, res: Response) => {
  const generatedOG = await generateOG(req.query);

  res
    .status(200)
    .header("Content-Type", "image/png")
    .header("Content-Length", generatedOG.length.toString())
    .send(generatedOG);
});

app.listen("8000", () => {
  console.log("Server is ready on http://localhost:8000");
});
