const autoprefixer = require('gulp-autoprefixer')
const cache = require('gulp-cache')
const clean = require('gulp-clean')
const cssnano = require('gulp-cssnano')
const gulp = require('gulp')
const gutil = require('gulp-util')
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin')
const runSequence = require('run-sequence')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const uglify = require('gulp-uglify')

/* Clean BUILD folder */
gulp.task('clean', () => {
  return gulp
    .src('./build', {
      read: false
    })
    .pipe(clean())
})

/* Minify HTML */
gulp.task('minifyHTML', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

/* Process images */
gulp.task('images', function () {
  return gulp
    .src('./src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('build/images'))
})

/* Process scripts - JavaScript files */
gulp.task('scripts', () => {
  gulp
    .src('./src/scripts/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts'))
})

/* Process styles - SASS(CSS) files */
gulp.task('styles', () => {
  gulp
    .src('./src/sass/*.scss')
    .pipe(
      sass({
        style: 'expanded'
      })
    )
    .on('error', gutil.log)
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    )
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'))
})

/* Build widget code */
gulp.task('build', cb => {
  runSequence('clean', ['minifyHTML', 'scripts', 'styles', 'images'], cb)
})

/* Watch for changes during development */
gulp.task('watch-dev', () => {
  gulp.watch('./src/**', ['styles', 'minifyHTML', 'scripts', 'images'])
})
