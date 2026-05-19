import { src, dest, watch, series } from "gulp";
import gulpSass from "gulp-sass";
import cssnano from "gulp-cssnano";
import * as sassModule from "sass";
import sourcemaps from "gulp-sourcemaps";
import browserSyncModule from "browser-sync";
import fileInclude from "gulp-file-include";
import rename from "gulp-rename";
import concat from "gulp-concat";
import uglify from "gulp-uglify";
import sharp from "gulp-sharp-responsive";

const sass = gulpSass(sassModule);
const browserSync = browserSyncModule.create();

// HTML
function html() {
  return src("src/app/*.html")
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}


// SCSS
function styles() {
  return src("src/app/scss/main.scss") 
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano()) 
    .pipe(rename("index.min.css")) 
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}

// JS
function scripts() {
  return src("src/app/js/**/*.js")
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

// JSON
function json() {
  return src("src/app/**/*.json")
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
}

export async function images(done) {
  return src("src/app/imgs/**/*.{png,jpg,jpeg}", {encoding: false})
    .pipe(dest("dist/imgs")) 
    // .pipe(
    //   sharp({
    //     formats: [
    //       { format: "jpeg", quality: 80 },
    //       { format: "webp", quality: 80 }
    //     ]
    //   })
    // )
    // .pipe(dest("dist/imgs"))
     .on("end", done)  
    .on("error", done);
}


// BrowserSync
function serve(done) {
  browserSync.init({
    server: { baseDir: "./dist" },
    notify: false,
  });
  done();
}

// Watcher
function watcher() {
  watch("src/app/scss/**/*.scss", styles);
  watch("src/app/*.html", html);
  watch("src/app/js/**/*.js", scripts);
  watch("src/app/imgs/**/*", images);
  watch("src/app/**/*.json", json);
}

// Export tasks
export const build = series(html, styles, scripts, images);
export default series(build, serve, watcher);
