// src and dest are for moving files
// watch is for Gulp to trigger tasks anytime the watched files are modified
// task is to register a task in Gulp
const { src, dest, watch, task, series } = require('gulp');
const sass = require('gulp-sass');

// bro is for browserify
const bro = require('gulp-bro');

// browserSync
const browserSync = require('browser-sync').create();

// our build function
function _build() {
    // take every commonJS module, browserify them and put them into ./dist/js
    src('./src/cjs-modules/*.js')
        .pipe(bro())
        .pipe(dest('./dist/js'));

    // take every JS script, and put them into ./dist/js
    src('./src/scripts/**/*.js')
        .pipe(dest('./dist/js'));

    // take every image, and put them into ./dist/images
    src('./src/images/**/*')
        .pipe(dest('./dist/images'))

    // take every HTML and put them into ./dist
    src('./src/**/*.html')
        .pipe(dest('./dist'));

    // take CSS and put them into ./dist/css
    src('./src/**/*.css')
        .pipe(dest('./dist/css'));
}

// our watch function
function _watch() {
    watch(['src/*/*.js', 'src/**/*.html'], _build);
    watch('src/scss/*.scss', series('sass')).on('change', browserSync.reload);
    watch(['src/*/*.js', 'src/**/*.html']).on('change', browserSync.reload);
}

// our serve function
function _serve() {
    _build();
    browserSync.init({
        server: "./dist",
        serveStatic: ['./src/images']
    });

    _watch();
}

// Compile sass into CSS & auto-inject into browsers
task('sass', function() {
    return src("src/scss/*.scss")
        .pipe(sass())
        .pipe(dest("./dist/css"))
        .pipe(browserSync.stream());
});

// registering a 'serve' task so we can trigger the building and serving with
// gulp serve
task('serve', series('sass', _serve));
