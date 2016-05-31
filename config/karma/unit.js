'use strict';

module.exports = function (config) {

    config.set({

        browsers: [
            'ChromeCanary',
            'FirefoxDeveloper'
        ],

        files: [
            '../../src/module.js',
            {
                included: false,
                pattern: '../../src/**/!(module).js',
                served: false,
                watched: true,
            },
            '../../test/integration/**/*.js',
            '../../test/unit/**/*.js'
        ],

        frameworks: [
            'browserify',
            'mocha',
            'sinon-chai' // implicitly uses chai too
        ],

        preprocessors: {
            '../../src/module.js': 'browserify',
            '../../test/integration/**/*.js': 'browserify',
            '../../test/unit/**/*.js': 'browserify'
        }

    });

};
