const autoprefixer = require('gulp-autoprefixer')
const cache = require('gulp-cache')
const clean = require('gulp-clean')
const critical = require('critical')
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

gulp.task('copy-server', () => {
  return gulp
    .src('server/**/*')
    .pipe(gulp.dest('build/server'))
})

/* Minify HTML */
gulp.task('minifyHTML', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
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
  runSequence('clean', ['minifyHTML', 'scripts', 'styles', 'images', 'copy-server'], cb)
})

gulp.task('critical', () => {
  return critical.generate({
    inline: true,
    base: 'build/',
    src: 'index.html',
    dest: 'index-critical.html',
    minify: true,
    dimensions: [{
      height: 200,
      width: 500
    }, {
      height: 900,
      width: 1200
    }]
  });
})

/* Watch for changes during development */
gulp.task('watch-dev', cb => {
  runSequence(['watch-server', 'watch-src'], cb)
})
gulp.task('watch-server', () => {
  gulp.watch('./server/**', ['copy-server'])
})
gulp.task('watch-src', () => {
  gulp.watch('./src/**', ['styles', 'minifyHTML', 'scripts', 'images'])
})