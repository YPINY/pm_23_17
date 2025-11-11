"use strict";

const { src, dest, watch, series, parallel } = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const cssnano = require("gulp-cssnano");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const path = require("path");

// 📁 Шляхи до основних файлів
const paths = {
    html: { src: "app/html/*.html", dest: "dist/" },
    scss: { src: "app/scss/*.scss", dest: "dist/css/" },
    js:   { src: "app/js/*.js", dest: "dist/js/" },
    img:  { src: "app/img/*.{png,jpg,jpeg,svg,gif,webp}", dest: "dist/img/" }
};

// 📦 Шлях до Bootstrap (після npm install)
const bootstrapPath = "node_modules/bootstrap/dist";

// 🔹 Таск 1: копіювання Bootstrap CSS
function bootstrapCSS() {
    return src(path.join(bootstrapPath, "css/bootstrap.min.css"))
        .pipe(dest("dist/css"));
}

// 🔹 Таск 2: копіювання Bootstrap JS
function bootstrapJS() {
    return src(path.join(bootstrapPath, "js/bootstrap.bundle.min.js"))
        .pipe(dest("dist/js"));
}

// 🔹 Копіювання HTML
function html() {
    return src(paths.html.src)
        .pipe(rename(p => { p.dirname = ""; }))
        .pipe(dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return src("app/scss/main.scss")
      .pipe(sass().on("error", sass.logError))
      .pipe(cssnano())
      .pipe(rename("index.min.css"))
      .pipe(dest(paths.scss.dest))
      .pipe(browserSync.stream());
  }
  


// 🔹 Обробка JS
function scripts() {
    return src(paths.js.src)
        .pipe(concat("bundle.js"))
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest(paths.js.dest))
        .pipe(browserSync.stream());
}

// 🔹 Оптимізація зображень
function images() {
    return src(paths.img.src)
        .pipe(imagemin())
        .pipe(dest(paths.img.dest));
}

// 🔹 BrowserSync
function reload(done) { browserSync.reload(); done(); }

function serve() {
    browserSync.init({
        server: { baseDir: "dist" },
        open: false,
        notify: false
    });

    watch(paths.html.src, html);
    watch(paths.scss.src, styles);
    watch(paths.js.src, scripts);
    watch(paths.img.src, series(images, reload));
}

// 🔹 Загальне збирання
const build = series(
    parallel(html, styles, scripts, images, bootstrapCSS, bootstrapJS)
);

// Експорти
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.bootstrapCSS = bootstrapCSS;
exports.bootstrapJS = bootstrapJS;
exports.build = build;
exports.default = series(build, serve);