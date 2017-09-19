module.exports = function(config){
  config.set({

    basePath : './',

    preprocessors: {
      'app/client/**/!(*_test).js': ["coverage"],
      'app/player/**/!(*_test).js': ["coverage"]
    },

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/components/**/*.js',
      'app/player/**/*.js',
      'app/client/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome', 'PhantomJS'],

    plugins : [
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage'
            ],

    reporters: [
      "dots",
      "junit",
      "coverage"
    ],

    coverageReporter: {
      reporters: [
        {
          type: "lcov",
          dir: "coverage",
          subdir: "."
        },
        {
          type: "json",
          dir: "coverage",
          subdir: ".",
          file: "coverage.json"
        }
      ]
    },

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
