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


    // return {
    //   isBase64Encoded: true,
    //   statusCode: 200,
    //   headers: {
    //     "Content-Type": "image/png",
    //     "Content-Length": screenshotBuffer.length.toString()
    //   },
    //   body: screenshotBuffer.toString("base64")
    // };
})


app.listen("8000", () => {
    console.log("Server is started on port 8000");
})