var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


/**
 * Compile sass
 */
var sassPath = 'src/sass/**/*.scss';
gulp.task('sass', function() {
    return gulp.src(sassPath)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

/**
 * Concat js
 */
var jsPath = 'src/js/**/*.js';
gulp.task('scripts', function() {
    return gulp.src(jsPath)
        //.pipe(concat('script.js'))
        //.pipe(gulp.dest('dist/js'))
        //.pipe(rename('script.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
});


/**
 * Watcher
 */
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    var templateFiles = [
        '**/*.html'
    ];
    gulp.watch(templateFiles).on("change", reload);
    gulp.watch(sassPath, ['sass']);
    gulp.watch(jsPath, ['scripts']);
});