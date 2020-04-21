/*
 * @Date: 2020-04-21 13:27:38
 * @LastEditTime: 2020-04-21 13:44:19
 * @Description: file content
 */


const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');

const version = '1.0.4'
gulp.task("lib", function () {
    gulp.src(['src/zepto.js', 'src/download.js', 'src/tripledes.js', 'src/mode-ecb.js', 'src/track.js'])
        .pipe(concat(`hntrack_${version}.js`))
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(gulp.dest('../web-mobile/assets/js'))
})

gulp.task("lib-2.1", function () {
    gulp.src(['src/zepto.js', 'src/download.js'])
        .pipe(concat(`track_0.0.2.js`))
        .pipe(babel({
            presets: ['es2015', 'stage-0']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist2.1'))
})