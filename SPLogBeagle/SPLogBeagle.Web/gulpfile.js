var gulp = require('gulp'),
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber'),
    browserify = require('gulp-browserify'),
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'),
    //useref = require('gulp-useref'),
    //uglify = require('gulp-uglify'),
    //cssmin = require('gulp-cssmin'),

    //csso = require('gulp-csso'), // Минификация CSS
    //imagemin = require('gulp-imagemin'), // Минификация изображений
    //uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов

    refHash = require('gulp-ref-hash'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    del = require('del'),
    app = require('./front/app.js'),
    paths = {
        src: './front/src/',
        //dest: './front/build/',
        dest: './front/build/',
        lib: './front/lib/',
        assets: './front/src/assets/',
        //server: "c:/temp/fartuk54"
    };

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('serve', function () {
    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });
});

gulp.task('fonts', function () {
    return gulp.src(paths.assets + 'fonts/**')
        .pipe(gulp.dest(paths.dest + 'assets/fonts'));
});

gulp.task('images', function () {
    return gulp.src(paths.assets + 'img/**')
        .pipe(gulp.dest(paths.dest + 'assets/img'));
});

gulp.task('scripts', function () {
    return gulp.src(paths.src + 'app/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(plumber())
        .pipe(browserify())
        .pipe(gulp.dest(paths.dest + 'assets/scripts/'));
});

gulp.task('clean', function () {
    del([paths.dest + '**']);
});

gulp.task('clean-json', function () {
    if (gulp.src(paths.dest + "**/*.json"))
        del([paths.dest + "**/*.json"]);
});

gulp.task('stylesheets', function () {
    return gulp.src(paths.assets + 'stylesheets/**')
        .pipe(plumber())
        .pipe(stylus())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.dest + 'assets/stylesheets'));
});

gulp.task('html', function () {
    return gulp.src(paths.src + '/**/*.jade')
        .pipe(plumber())
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('lib', function () {
    return gulp.src(paths.lib + '**')
        .pipe(gulp.dest(paths.dest + 'lib/'));
});

//gulp.task('deploy', function () {
//    return gulp.src(paths.dest + '**')
//        .pipe(gulp.dest(paths.server));
//});

gulp.task('watch', function () {
    livereload.listen();

    gulp.watch(paths.src + '/**/*.jade', ['html']).on('change', livereload.changed);
    gulp.watch(paths.lib + '**', ['lib']).on('change', livereload.changed);
    gulp.watch(paths.assets + 'stylesheets/**', ['stylesheets']).on('change', livereload.changed);
    gulp.watch(paths.assets + 'img/**', ['images']).on('change', livereload.changed);
    gulp.watch(paths.src + 'app/*.js', ['scripts']).on('change', livereload.changed);
    gulp.watch(paths.assets + 'fonts/**', ['fonts']).on('change', livereload.changed);
});

//gulp.task('min-assets', function () {
//    var assets = useref.assets();

//    return gulp.src(paths.dest + 'assets/templates/index.html')
//        .on('error', console.log)
//        //.pipe(refHash({
//        //    paths: {
//        //        js: '../scripts/',
//        //        css: '../stylesheets/'
//        //    }
//        //}))
//        .pipe(assets)
//        .pipe(gulpif('*.js', uglify()))
//        .pipe(gulpif('*.css', cssmin()))
//        .pipe(assets.restore())
//        .pipe(useref())
//        .pipe(gulp.dest(paths.dest + 'assets/templates/'));
//});

// Production build
//gulp.task('build-prod', ['min-assets', 'clean-json']);

// Start local server
gulp.task('start', ['watch', 'serve']);
    
// Develop build
gulp.task('build', ['lib', 'scripts', 'images', 'fonts', 'stylesheets', 'html']);//, 'test']);


//gulp.task('build-prod-test', function () {
//    // css
//    gulp.src('./src/assets/stylesheets/main.styl')
//        .pipe(stylus()) // собираем stylus
//        //.pipe(myth()) // добавляем префиксы - http://www.myth.io/
//        .pipe(csso()) // минимизируем css
//        .pipe(gulp.dest('./build/css/')); // записываем css

//    // jade
//    gulp.src(['./src/assets/template/*.jade', '!./src/assets/template/_*.jade'])
//        .pipe(jade())
//        .pipe(gulp.dest('./build/'));

//    // js
//    gulp.src(['./src/app/**/*.js', '!./src/vendor/**/*.js'])
//        .pipe(concat('index.js'))
//        .pipe(uglify())
//        .pipe(gulp.dest('./build/js'));

//    // image
//    gulp.src('./src/img/**/*')
//        .pipe(imagemin())
//        .pipe(gulp.dest('./build/img'));

//});