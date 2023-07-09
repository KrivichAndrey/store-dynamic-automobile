// noinspection JSCheckFunctionSignatures

const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const fileinclude = require("gulp-file-include");
const svgSprite = require("gulp-svg-sprite");
// const ttf2woff = require('gulp-ttf2woff');
// const ttf2woff2 = require('gulp-ttf2woff2');
// const fs = require('fs');
const del = require("del");
const gcmq = require('gulp-group-css-media-queries');
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const uglify = require("gulp-uglify-es").default;
const replace = require("gulp-replace");

/*const fonts = () => {
  src('./src/fonts/!**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./app/fonts/'))
  return src('./src/fonts/!**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./app/fonts/'))
}

const cb = () => { }

let srcFonts = './src/scss/_fonts.scss';
let appFonts = './app/fonts/';

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, '', cb);
  fs.readdir(appFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname !== fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
        }
        c_fontname = fontname;
      }
    }
  })

  done();
}*/

const svgSprites = () => {
   return src("./src/img/svg/**.svg")
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: "../sprite.svg"
            }
         }
      }))
      .pipe(dest("./app/img/svg/"))
      .pipe(browserSync.stream());
};

const styles = () => {
   return src("./src/scss/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass({
         outputStyle: "compressed"
      }
      ).on("error", notify.onError()))
      .pipe(replace(/@img\//g, "../img/"))
      .pipe(rename({
         suffix: ".min"
      }))
      .pipe(autoprefixer({
         cascade: false
      }))
      .pipe(gcmq())
      .pipe(cleanCSS({
         level: 2
      }))
      .pipe(sourcemaps.write("."))
      .pipe(dest("./app/css/"))
      .pipe(browserSync.stream());
};

const htmlInclude = () => {
   return src(["./src/*.html"])
      .pipe(fileinclude({
         prefix: "@@",
         basepath: "@file"
      }))
      .pipe(replace(/@img\//g, "./img/"))
      .pipe(dest("./app/"))
      .pipe(browserSync.stream());
};

const imgToApp = () => {
   return src(["./src/img/**/*.jpg", "./src/img/**/*.ico", "./src/img/**/*.png", "./src/img/**/*.jpeg", "./src/img/**/*.svg", "!src/img/svg/*.svg"])
      .pipe(dest("./app/img"));
};

const resources = () => {
   return src("./src/resources/**")
      .pipe(dest("./app/resources/"));
};

const clean = () => {
   return del(["app/*"]);
};

const scripts = () => {
   /*   return src('./src/js/main.js')
       .pipe(webpackStream({
         mode: 'development',
         output: {
           filename: 'main.js',
         },
         module: {
           rules: [{
             test: /\.m?js$/,
             exclude: /(node_modules|bower_components)/,
             use: {
               loader: 'babel-loader',
               options: {
                 presets: ['@babel/preset-env']
               }
             }
           }]
         },
       }))
       .on("error", function(err) {
         console.error("WEBPACK ERROR", err);
         this.emit("end");
       })
       .pipe(sourcemaps.init())
       .pipe(uglify().on("error", notify.onError()))
       .pipe(sourcemaps.write("."))
       .pipe(dest("./app/js"))
       .pipe(browserSync.stream()); */

   return src("./src/js/**/*.js")
      .pipe(dest("./app/js/"))
      .pipe(browserSync.stream());
};

const watchFiles = () => {
   browserSync.init({
      server: {
         baseDir: "./app"
      }
   });

   watch("./src/scss/**/*.scss", styles);
   watch("./src/**/*.html", htmlInclude);
   watch("./src/img/**/*.jpg", imgToApp);
   watch("./src/img/**/*.png", imgToApp);
   watch("./src/img/**/*.jpeg", imgToApp);
   watch("./src/img/**/*.ico", imgToApp);
   watch("./src/img/**.svg", imgToApp);
   watch("./src/img/**/*.svg", svgSprites);
   watch("./src/resources/**/*", resources);
   // watch('./src/fonts/**.ttf', fonts);
   // watch('./src/fonts/**.ttf', fontsStyle);
   watch("./src/js/**/*.js", scripts);
};

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.htmlInclude = htmlInclude;

exports.default = series(clean, parallel(htmlInclude, scripts/*, fonts*/, resources, imgToApp, svgSprites),/* fontsStyle,*/ styles, watchFiles);
