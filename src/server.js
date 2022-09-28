const express = require("express")
const { generateOG } = require("./generate-opengraph-image")


const app = express()


app.get("/", async (req, res) => {
    const generatedOG = await generateOG()

    console.log({ generatedOG });

    res.status(200)
        .header("Content-Type", "image/png")
        .header("Content-Length", generatedOG.length.toString())
        .send(generatedOG);
})


app.listen("8000", () => {
    console.log("Server is ready on http://localhost:8000");
})