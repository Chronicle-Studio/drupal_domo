/**
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');

// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src('../scripts/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('../images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('../dist/images'))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: 'images'}));
});

// Compile Any Other Sass Files You Added (styles)
gulp.task('scss:scss', function () {
  return gulp.src(['../scss/**/*.scss'])
    .pipe($.rubySass({
      style: 'expanded',
      precision: 10,
      loadPath: [
        'bower_components/bourbon/dist',
        'bower_components/neat/app/assets/stylesheets',
        'bower_components/normalize-scss'
      ]
    }))
    .on('error', gutil.log)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('../styles'))
    .pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('styles', ['scss:scss']);

// Clean Output Directory
gulp.task('clean', del(['../.tmp', '../dist'], {force: true}));

// Watch Files For Changes & Reload
gulp.task('watch', function () {
  gulp.watch(['../scss/**/*.scss'], ['styles']);
  gulp.watch(['../scripts/*.js'], ['jshint']);
  gulp.watch(['../images/**/*'], ['images']);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['jshint', 'images'], cb);
});


gulp.task('flatten', function () {
  del(['../scripts/vendor'], {force: true});
  gulp.src('bower_components/**/*.min.js')
    .pipe($.flatten())
    .pipe(gulp.dest('../scripts/vendor'));
});
