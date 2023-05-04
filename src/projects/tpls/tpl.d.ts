//this TS declaration file together with webpack.config.js raw-loader 
//will look after the .tpl file imports, credits to:
//  https://medium.com/@sampsonjoliver/importing-html-files-from-typescript-bd1c50909992

declare module '*.tpl' {
    const value: string;
    export default value
  }