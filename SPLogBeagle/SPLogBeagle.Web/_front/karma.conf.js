module.exports = function (config) {
    config.set({
        files: [
            './lib/jquery/dist/jquery.js',
            './lib/angular/angular.js',
            './lib/angular-mocks/angular-mocks.js',
            './lib/bjqs/js/bjqs-1.3.js',
            './src/app/*.js',
            './src/test/*.spec.js'
        ],

        frameworks: ['browserify', 'mocha', 'chai'],

        preprocessors: {
            './src/app/init.js': ['browserify']
        },

        coverageReporter: {
            type: 'text-summary'
        },

        browserify: {
            debug: true,
            transform: ['browserify-istanbul']
        },

        reporters: ['progress', 'coverage'],

        browsers: ['Chrome'],

        port: 9876,

        colors: true,

        singleRun: true
    });
};