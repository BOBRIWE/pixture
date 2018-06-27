var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass        = require('gulp-sass'),
    pug         = require('gulp-pug'),
    plumber     = require('gulp-plumber'),
    cleanCSS    = require('gulp-clean-css'),
    merge       = require('merge-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    rename      = require('gulp-rename'),
    image       = require('gulp-image'), // instead of popular gulp-imagemin, because it better minify
    reload      = browserSync.reload;


gulp.task('default', [
    'js',
    'fonts',
    'copy',
    'pug',
    'sass',
    'images',
    'watch',
    'serve'
]);

gulp.task('sass-build', function() {
    return gulp.src('src/stylesheets/scss/main.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(browserSync.stream());
});

gulp.task('sass-min', ['sass-build'], function() {
    return gulp.src('dist/stylesheets/main.css')
        .pipe(plumber())
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest('dist/stylesheets'))
        .pipe(browserSync.stream());
});

gulp.task('sass', ['sass-min']);

gulp.task('pug', function() {
    return gulp.src('src/pug/index.pug')
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

gulp.task('copy', function() {
    gulp.src('node_modules/slick-carousel/slick/slick.min.js')
        .pipe(gulp.dest('dist/js'));

    gulp.src('node_modules/slick-carousel/slick/fonts/*')
        .pipe(gulp.dest('dist/stylesheets/fonts'));

    gulp.src('node_modules/slick-carousel/slick/ajax-loader.gif')
        .pipe(gulp.dest('dist/stylesheets/'));

    gulp.src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('dist/images')) // no need to wait
        .pipe(image())
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    return gulp.src('node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('js', function() {
    return gulp.src('src/js/**/*')
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch('src/stylesheets/scss/**/*', ['sass']);
    gulp.watch('src/pug/**/*', ['pug']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('src/js/**/*', ['js']);
});

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        open: 'external'
    });

    // gulp.watch('src/pug/**/*').on('change', reload);
});
