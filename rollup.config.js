import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import replace from "@rollup/plugin-replace";
import React from "react";
import ReactDOM from "react-dom";
import fs from 'fs'
import path from 'path'

const findFilesInDir = (dir) => {
  return fs.readdirSync(dir).filter(el => path.extname(el) === ".tsx").map(el => path.basename(el, path.extname(el)))
}

const pages = findFilesInDir("src/pages")
console.log(pages);


if (!pages.length) {
  throw new Error(`No sources found in: ${dir}`)
}

export default pages.map(page => {
  return {
    input: `dist/pages/${page}.js`,
    output: {
      file: `dist/bundle/${page}.js`,
      format: "iife",
      sourcemap: true,
    },
    // acornInjectPlugins: [jsx()],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      babel({
        exclude: "node_modules/**"
      }),
      commonjs({
        namedExports: {
          "react-dom": Object.keys(ReactDOM),
          react: Object.keys(React)
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      globals(),
      builtins(),
      // serve({
      //   open: true,
      //   verbose: true,
      //   contentBase: ["", "public"],
      //   host: "localhost",
      //   port: 3000,
      // }),
      // livereload({ watch: "dist" }),
    ]
  }
})

// Bootstrap index.html
fs.writeFileSync("dist/index.html",
  `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>React - Rollup Test</title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>`)


