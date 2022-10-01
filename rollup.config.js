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

if (!pages.length) {
  throw new Error(`No sources found in: ${dir}`)
}

export default commandLineArgs => {

  console.log({ commandLineArgs });
  const isBundle = commandLineArgs.bundle
  const devPage = commandLineArgs.x

  // clear args 
  delete commandLineArgs.bundle
  delete commandLineArgs.x


  bootstrap({
    isBundle,
    devPage
  })


  // Prod config
  if (isBundle) {
    return pages.map(page => {
      return {
        input: `dist/pages/${page}.js`,
        output: {
          file: `dist/bundle/${page}.js`,
          format: "iife",
          sourcemap: true,
        },
        plugins: [
          resolve({
            preferBuiltins: true
          }),
          babel({
            exclude: "node_modules/**",
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }),
          commonjs({
            namedExports: {
              "react-dom": Object.keys(ReactDOM),
              react: Object.keys(React)
            }
          }),
          replace({
            "process.env.NODE_ENV": JSON.stringify("production"),
            preventAssignment: true
          }),
          globals(),
          builtins(),
          !isBundle ? serve({
            open: true,
            verbose: true,
            contentBase: ["", "public"],
            host: "localhost",
            port: 3000,
          }) : null,
          !isBundle ? livereload({ watch: "dist" }) : null,
        ]
      }
    })
  }

  // Dev config
  // if nod dev page provided
  if (devPage === true) {
    throw new Error("Please provide a page to watch")
  }

  // if the page is not exist 
  if (!pages.includes(devPage)) {
    throw new Error("This page seems to be not exist. Please provide a valid page to watch")
  }

  return {
    input: `dist/pages/${devPage}.js`,
    output: {
      file: `dist/bundle/${devPage}.js`,
      format: "iife",
      sourcemap: true,
    },
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-env", "@babel/preset-react"]
      }),
      commonjs({
        namedExports: {
          "react-dom": Object.keys(ReactDOM),
          react: Object.keys(React)
        }
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true
      }),
      globals(),
      builtins(),
      serve({
        open: true,
        verbose: true,
        contentBase: ["dist"],
        host: "localhost",
        port: 3000,
      }),
      livereload({ watch: "dist" }),
    ]
  }




}


// Bootstrap index.html
const bootstrap = (props) => {

  if (props.isBundle) {
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
  } else {
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
  <script src="./bundle/${props.devPage}.js" ></script>
</body>
</html>`)
  }

}




