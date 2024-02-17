const { error } = require("fancy-log");
const { src, dest, watch, task } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

const cssnano = require("cssnano");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const csscomb = require("gulp-csscomb");
const autoprefixer = require("autoprefixer");
const sortCSSmq = require("sort-css-media-queries");
const mqpacker = require("css-mqpacker");

const Path = {
  scss: "./assets/scss/style.scss",
  scssAll: "./assets/scss/**/*.scss",
  scssFolder: "./assets/scss/",
  css: "./assets/css",
  html: "./",
  htmlAll: "./*.html",
  js: "./assets/js",
  jsAll: "./assets/js/**/*.js",
};

const plugins = [
  autoprefixer({
    overrideBrowserslist: ["last 5 versions"],
    cascade: true,
  }),
  mqpacker({ sort: sortCSSmq }),
];

function scss() {
  return src(Path.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest(Path.css))
    .pipe(browserSync.stream());
}

function scssDev() {
  return src(Path.scss, { sourcemaps: true })
    .pipe(sass().on("error", sass.logError))
    .pipe(dest(Path.css, { sourcemaps: true }))
    .pipe(browserSync.stream());
}

function scssMin() {
  const pluginsMin = [...plugins, cssnano({ preset: "default" })];
  return src(Path.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(pluginsMin))
    .pipe(rename({ suffix: ".min" }))
    .pipe(dest(Path.css));
}

function comb() {
  return src(Path.scssAll)
    .pipe(csscomb(".comb.json"))
    .pipe(dest(Path.scssFolder));
}

function browSync() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
}

async function sync() {
  browserSync.reload();
}

function watchFiles() {
  browSync();
  watch(Path.scssAll, scss);
  watch(Path.htmlAll, sync);
  watch(Path.jsAll, sync);
}

task("dev", scssDev);
task("min", scssMin);
task("scss", scss);
task("watch", watchFiles);
task("comb", comb);
