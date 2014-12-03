var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: './www/css/',
  sass_main_file: './www/css/main.scss',
  public_folder: '/Users/gal/Workspace/dingo-backend/public/'
};

gulp.task('default', ['sass']);

gulp.task('deploy', ['sass'], function() {
  gulp.src(['./www/**'],{ 'base': '.' }).pipe(gulp.dest(paths.public_folder));
});

gulp.task('sass', function(done) {
  gulp.src(paths.sass_main_file)
    .pipe(sass())
    .pipe(gulp.dest(paths.sass))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.sass))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch([paths.sass+'**/*.scss'], ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
