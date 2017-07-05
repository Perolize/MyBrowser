'use strict';

const gulp = require('gulp');
const named = require('vinyl-named');
const webpack = require('gulp-webpack');
const useref = require('gulp-useref');
const sourcemaps = require('gulp-sourcemaps');
const typescript = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sequence = require('run-sequence');
const uglify = require('uglify-js-harmony');
const concat = require('gulp-concat');
const minifier = require('gulp-uglify/minifier');
const imagemin = require('gulp-imagemin');
const minifyCss = require('gulp-clean-css');
const htmlMin = require('gulp-html-minifier');

const path = require('path');
const del = require('del');

const options = {
    src: 'app/src',
    dist: 'app/dist'
}

const tscConfig = require(`./${options.src}/tsconfig.json`);

gulp.task('clean', function() {
    return del(`${options.dist}/**/*`);
});

gulp.task('compile', function() {
    gulp
        .src([`${options.src}/*/*.ts`, `${options.src}/**/*.ts`, `!${options.src}/main.ts`])
        .pipe(sourcemaps.init())          // <--- sourcemaps
        .pipe(typescript(tscConfig.compilerOptions))
        // .pipe(minifier({ preserveComments: 'license' }, uglify))
        // .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('.'))      // <--- sourcemaps
        .pipe(gulp.dest(options.dist));
    gulp
        .src(`${options.src}/main.ts`)
        .pipe(sourcemaps.init())          // <--- sourcemaps
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(minifier({ preserveComments: 'license' }, uglify))
        .pipe(sourcemaps.write('.'))      // <--- sourcemaps
        .pipe(gulp.dest(options.dist));
});

gulp.task('bundle', () => {
    return gulp.src([`${options.dist}/*.js`, `${options.dist}/**/*.js`, `!${options.dist}/main.js`])
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(minifier({ preserveComments: 'license' }, uglify))
        .pipe(gulp.dest(options.dist));
});

gulp.task('copy:assets', function() {
    return gulp.src([`${options.src}/**/*`, `!${options.src}/index.html`, `!${options.src}/**/*.html`, `!${options.src}/**/*.ts`, `${options.src}/*.js`, `!${options.src}/*.json`, `!${options.src}/img`, `!${options.src}/*.css`, `!${options.src}/**/*.css`, `!${options.src}/**/**/*.css`], { base: options.src })
        .pipe(gulp.dest(options.dist))
});

gulp.task('copy:img', () => {
    return gulp
        .src([`${options.src}/img/*`, `!${options.src}/img/*.psd`])
        .pipe(imagemin())
        .pipe(gulp.dest(`${options.dist}/img`))
});

gulp.task('copy:css', () => {
    return gulp
        .src([`${options.src}/style.css`, `${options.src}/**/*.css`, `${options.src}/**/**/*.css`])
        .pipe(minifyCss())
        .pipe(gulp.dest(options.dist))
});

gulp.task('copy:html', () => {
    return gulp
        .src([`${options.src}/index.html`, `${options.src}/**/*.html`, `${options.src}/**/**/*.html`])
        .pipe(useref())
        .pipe(htmlMin({ collapseWhitespace: true, minifyJS: true }))
        .pipe(gulp.dest(options.dist))
});

gulp.task('tslint', function() {
    return gulp.src(`${options.src}/**/*.ts`)
        .pipe(tslint({ formatter: "verbose" }))
        .pipe(tslint.report());
});

gulp.task('watch', function() {
    gulp.watch(`./${options.src}/main.ts`).on('change', function() {
        sequence('clean', 'build');
    });
    gulp.watch(`./${options.src}/**/*.*`).on('change', function() {
        sequence('clean', 'build');
    });
    gulp.watch(`./${options.src}/*.*`).on('change', function() {
        sequence('clean', 'build');
    });
});

gulp.task('build', ['compile', 'copy:assets', 'copy:img', 'copy:css', 'copy:html']);

gulp.task('default', () => {
    sequence('clean', 'build', 'bundle')
});