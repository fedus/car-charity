// src and dest are for moving files
// watch is for Gulp to trigger tasks anytime the watched files are modified
// task is to register a task in Gulp
const { src, dest, watch, task, series } = require('gulp');
const sass = require('gulp-sass');
const del = require('del');

// bro is for browserify
const bro = require('gulp-bro');

// browserSync
const browserSync = require('browser-sync').create();

function _build_js() {
    // take every commonJS module, browserify them and put them into ./dist/js
    src('./src/cjs-modules/*.js')
        .pipe(bro())
        .pipe(dest('./dist/js'));

    // take every JS script, and put them into ./dist/js
    src('./src/scripts/**/*.js')
        .pipe(dest('./dist/js'));
}

function _build_css() {
    // take CSS and put them into ./dist/css
    src('./src/**/*.css')
        .pipe(dest('./dist/css'))
        .pipe(browserSync.stream());
}

function _build_sass() {
    return src("src/scss/*.scss")
        .pipe(sass())
        .pipe(dest("./dist/css"))
        .pipe(browserSync.stream());
}

function _build_assets() {
    // take every image, and put them into ./dist/images
    src('./src/images/**/*')
        .pipe(dest('./dist/images'));
}

function _build_html() {
    // take every HTML and put them into ./dist
    src('./src/**/*.html')
        .pipe(dest('./dist'));
}

// our build function
function _build_all(resolve) {
    _build_js();
    _build_css();
    _build_sass();
    _build_assets();
    _build_html();
    resolve();
}

// our watch function
function _watch() {
    watch('src/*/*.js', _build_js).on('change', browserSync.reload);
    watch('src/**/*.html', _build_html).on('change', browserSync.reload);
    watch('src/scss/*.scss', _build_sass);
    watch('src/css/*.css', _build_css);
    watch('src/images/**/*', _build_assets).on('change', browserSync.reload);
}

task('clean', function () {
    return del(['./dist/**/*']);
});

// our serve function
function _serve() {
    browserSync.init({
        server: "./dist",
        serveStatic: ['./src/images']
    });

    _watch();
}

task('build', series('clean', _build_all));

// registering a 'serve' task so we can trigger the building and serving with
// gulp serve
task('serve', series('build', _serve));
