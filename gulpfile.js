'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sequence = require('run-sequence');

const del = require('del');
const electron = require('electron-connect').server.create();

const tscConfig = require('./src/tsconfig.json');

gulp.task('clean', function () {
    return del('dist/**/*');
});

gulp.task('compile', function () {
    return gulp
        .src(['src/*/*.ts', 'src/**/*.ts'])
        .pipe(sourcemaps.init())          // <--- sourcemaps
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))      // <--- sourcemaps
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:libs', function () {
    return gulp.src([
        'node_modules/core-js/client/shim.min.js',
        'node_modules/zone.js/dist/zone.js',
        'node_modules/systemjs/dist/system.src.js',
    ])
        .pipe(gulp.dest('dist/lib'))
});

gulp.task('copy:assets', function () {
    return gulp.src(['src/**/*', 'src/index.html', 'src/style.css', '!src/**/*.ts', 'src/*.js', '!src/*.json'], { base: './src' })
        .pipe(gulp.dest('dist'))
});

gulp.task('tslint', function () {
    return gulp.src('src/**/*.ts')
        .pipe(tslint({formatter: "verbose"}))
        .pipe(tslint.report());
});

gulp.task('serve', function () {
    electron.start();
    gulp.watch('./src/main.ts').on('change', function() {
        sequence('copy:assets', 'compile', electron.restart);
    }); 
    gulp.watch('./src/**/*.*').on('change', function() {
        sequence('copy:assets', 'compile', electron.reload);
    });
    gulp.watch('./src/*.*').on('change', function() {
        sequence('copy:assets', 'compile', electron.reload);
    });
});

gulp.task('build', ['compile', 'copy:libs', 'copy:assets']);

gulp.task('default', ['build', 'serve']);