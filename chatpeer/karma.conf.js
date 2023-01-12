// thanks to https://github.com/shinyoshiaki/werift-webrtc/tree/develop/e2e
module.exports = function (config) {
    process.env.CHROME_CANARY_BIN = require("puppeteer").executablePath();
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine", "karma-typescript"],

        // list of files / patterns to load in the browser
        files: ["tests/**/*.ts", "src/**/*.ts"],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {"**/*.ts": "karma-typescript"},

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ["progress", "karma-typescript"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        customLaunchers: {
            chrome_headless_with_fake_device: {
                base: "ChromeCanaryHeadless",
                flags: [
                    "--use-fake-device-for-media-stream",
                    "--use-fake-ui-for-media-stream",
                    "--disable-gpu",
                    "--no-sandbox",
                ],
            },
            chrome_with_fake_device: {
                base: "ChromeCanary",
                flags: [
                    "--use-fake-device-for-media-stream",
                    "--use-fake-ui-for-media-stream",
                    "--disable-gpu",
                    "--no-sandbox",
                ],
            },
            firefox_with_fake_device: {
                base: "Firefox",
                prefs: {
                    "media.navigator.permission.disabled": true,
                    "media.navigator.streams.fake": true,
                },
            },
        },
        browserNoActivityTimeout: 120000,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        karmaTypescriptConfig: require("./karma.tsconfig"),
    });
};