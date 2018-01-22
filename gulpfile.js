

const gulp = require("gulp");
const concat = require("gulp-concat");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const gzip = require('gulp-gzip');
// const { haina_data_tracking_version } = require('./version')

const version = '0.0.1'
gulp.task("lib", function () {
    gulp.src(['src/zepto.js','src/download.js','src/tripledes.js','src/mode-ecb.js','src/HNtrack.js'])
        .pipe(concat(`hntrack_${version}.js`))
        .pipe(babel({
            presets:['es2015','stage-0']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(gzip({threshold: 10240,minRatio:0.8}))
        .pipe(gulp.dest('dist'));
})