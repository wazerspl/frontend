'use strict';

var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');

// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);

gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractorLocal (done) {
  runProtractor(done, 'protractor.conf.local.js');
}
function runProtractorSauce (done) {
  runProtractor(done, 'protractor.conf.sauce.js');
}

function runProtractor (done, cfg) {
  var testFiles = [
    'test/e2e/**/*.js'
  ];

  gulp.src(testFiles)
    .pipe($.protractor.protractor({
      configFile: cfg,
    }))
    .on('error', function (err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      // Close browser sync server
      browserSync.exit();
      done();
    });
}

gulp.task('protractor', ['protractor:local:src']);
gulp.task('saucelabs', ['protractor:sauce:src']);
gulp.task('protractor:local:src', ['serve:e2e', 'webdriver-update'], runProtractorLocal);
gulp.task('protractor:local:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractorLocal);
gulp.task('protractor:sauce:src', ['serve:e2e', 'webdriver-update'], runProtractorSauce);
gulp.task('protractor:sauce:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractorSauce);

