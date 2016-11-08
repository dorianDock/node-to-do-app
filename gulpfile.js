var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

// uses jshint and jcsc to indicate us some code errors (in Js)
gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs());
});

// inject our dependencies in our html

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');

    var options = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../../public'
    };

    // these are our custom scripts
    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {
        read: false
    });
    // we use this to have final paths like href="/css/styles.css" instead of href="/public/css/styles.css"
    var injectOptions = {
        ignorePath: '/public'
    };

    var partialViews = ['./src/views/common/*.ejs'];

    // we inject all the script and css files names in the views where there is some markup for gulp
    return gulp.src(partialViews)
        .pipe(wiredep(options))
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./src/views/common'));
});

// This task "serves" our server, so start it on the port given and watches the js files

gulp.task('serve', ['style', 'inject'], function() {
    var options = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 3000
        },
        watch: jsFiles
    };

    return nodemon(options).on('restart', function(ev) {
        console.log('Restarting...');
    });
});