var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  changed = require('gulp-changed'),
  ngAnnotate = require('gulp-ng-annotate'),
  htmlmin = require('gulp-htmlmin'),
  minifycss = require('gulp-minify-css'),
  connect = require('gulp-connect'),
  proxy = require('http-proxy-middleware'),
  inputDir = 'UI/',
  input = {
    'html': 'UI/pages/*.html',
    'javascript': 'UI/js/*.js',
    'css': 'UI/css/*.css',
    'image': 'UI/images/',
    'sass':'UI/sass/*.sass',
    'jade':'UI/jade/*.jade'
  };

function errorLog(error) {
  console.log.bind(error);
  this.emit('end');
}

gulp.task('js', function() {
  return gulp.src(input.javascript)
    .pipe(changed(input.javascript))
    .pipe(ngAnnotate())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', errorLog)
    .pipe(connect.reload());
});
gulp.task('html', function() {
  return gulp.src(input.html)
    .pipe(changed('dist/views'))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .on('error', errorLog)
    .pipe(gulp.dest('dist/views'))
    .pipe(connect.reload());
});

gulp.task('css', function () {
  return gulp.src(input.css)
   .pipe(changed('dist/css'))
   .pipe(minifycss({
     compatibility: 'ie8'
   }))
   .on('error', errorLog)
   .pipe(gulp.dest('dist/css'))
   .pipe(connect.reload());
});

gulp.task("server", function() {
  connect.server({
    root: "UI",
    livereload: true,
    port: 90,
    middleware: function(connect, opt) {
      return [
        proxy('http://localhost:90/api', {
          target: 'http://localhost:80/',
          changeOrigin: true
        })
      ];
    }
  });
});


gulp.task('watch', function() {
  gulp.watch([input.javascript], ['js']);
  gulp.watch(input.html, ['html']);
  gulp.watch(input.css, ['css']);
});

gulp.task('default', ['js','html','css','watch', 'server']);
