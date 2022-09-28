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

const config = {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
    sourcemap: true,
  },
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
    serve({
      open: true,
      verbose: true,
      contentBase: ["", "public"],
      host: "localhost",
      port: 3000,
    }),
    livereload({ watch: "dist" }),
  ]
};

export default config;
