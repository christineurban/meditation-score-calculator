let gulp = require('gulp');

let sass = require('gulp-sass');

gulp.task('sass', () => {
  gulp
    .src('./client/src/**/*.scss')

    .pipe(sass())

    .pipe(
      gulp.dest((f) => {
        return f.base;
      })
    );
});

// Watch
gulp.task('watch', () => {
  // Watch .scss files
  gulp.watch('./client/src/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'watch']);
