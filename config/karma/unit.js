'use strict';

module.exports = function (config) {

    /* eslint-disable indent */
    var configuration = {

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

        };
    /* eslint-enable indent */

    if (process.env.TRAVIS) {
        configuration.browsers = [
            'ChromeSauceLabs',
            'FirefoxSauceLabs'
        ];

        configuration.captureTimeout = 120000;

        configuration.customLaunchers = {
            ChromeSauceLabs: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'OS X 10.11'
            },
            FirefoxSauceLabs: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11'
            }
        };

        configuration.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    } else {
        configuration.browsers = [
            'ChromeCanary',
            'FirefoxDeveloper'
        ];
    }

    config.set(configuration);

};
