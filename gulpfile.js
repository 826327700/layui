var gulp = require('gulp'), 
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
gulp = require('gulp'),
babel = require('gulp-babel'),
imagemin = require('gulp-imagemin'),
replace=require('./replace.js'),
browserSync = require('browser-sync').create(),
reload = browserSync.reload;

gulp.task('sass', function () {
    gulp.src('src/css/*.scss') 
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie > 8'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true 
        })) 
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({stream: true}));
})

gulp.task('taskES6', function(){
    gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({stream: true}));
});

gulp.task('compressIMG', function(){
    gulp.src('src/images/*.*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('copyHTML', function(){
    gulp.src('src/html/**/*')
    .pipe(replace())
    .pipe(gulp.dest('dist/html'))
    .pipe(reload({stream: true}))
});

gulp.task('copyFrameWork', function(){
    gulp.src('src/framework/**/*')
    .pipe(gulp.dest('dist/framework'));
});

gulp.task('default',['sass','taskES6','compressIMG','copyHTML','copyFrameWork']);

gulp.task('dev', ['sass'], function() {
    browserSync.init({
        server:{
            baseDir: "./dist",
            index: "html/index.html"
        },
        port: 8081
    });

    gulp.watch("src/css/**/*.scss", ['sass']);
    gulp.watch("src/html/**/*.html",['copyHTML']);
    gulp.watch("src/js/**/*.js",['taskES6']);
});
    