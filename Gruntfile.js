'use strict';

module.exports = function( grunt ) {
  // Load all grunt tasks
  require( 'load-grunt-tasks' )( grunt );

  // Show elapsed time at the end
  require( 'time-grunt' )( grunt );

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON( 'package.json' ),
    banner:
      '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed MIT */\n',

    // Task configuration.
    qunit: {
      all: {
        options: {
          inject: [ './test/qunit.config.js', './node_modules/grunt-contrib-qunit/chrome/bridge.js' ],
          urls: [ 'http://localhost:9000/test/jquery-boiler.test.html' ],
          page: {
            viewportSize: { width: 1280, height: 800 }
          }
        }
      }
    },

    eslint: {
      target: [ 'jquery.boiler.js' ]
    },

    connect: {
      tests: {
        options: {
          hostname: '*',
          port: 9000
        }
      }
    }
  });

  // Default Task
  grunt.registerTask( 'default', [ 'eslint', 'test:qunit' ]);

  // Testing Tasks
  grunt.registerTask( 'test:all', [ 'connect', 'qunit' ]);
  grunt.registerTask( 'test:qunit', [ 'connect', 'qunit' ]);

  // CI Task
  grunt.registerTask( 'ci', [ 'eslint', 'test:all' ]);
};
