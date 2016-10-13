module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        sourceMap: true,
        sourceMapStyle: 'link'
      },
      lib: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js'
        ],
        dest: 'public/dist/lib.js',
      },
      client: {
        src: [
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
        ],
        dest: 'public/dist/client.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        sourceMapStyle: 'link'
      },
      dist: {
        files: {
          'public/dist/client.min.js': [
            'public/client/app.js',
            'public/client/link.js',
            'public/client/links.js',
            'public/client/linkView.js',
            'public/client/linksView.js',
            'public/client/createLinkView.js',
            'public/client/router.js'
          ],
          'public/dist/lib.min.js': [
            'public/lib/jquery.js',
            'public/lib/underscore.js',
            'public/lib/backbone.js',
            'public/lib/handlebars.js'
          ]
        }
      }
    },

    eslint: {
      target: [
        'app/**/*.js',
        'lib/*.js',
        'public/client/*.js',
        './server.js',
        './server-config.js'
      ]
    },

    gitpush: {
      live: {
        options: {
          remote: 'live',
          branch: 'master'
        }
      },
      origin: {
        options: {
          remote: 'origin',
          branch: 'master'
        }
      }
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'eslint',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'open http://198.199.92.105:4568/'
      },
      devServer: {
        command: 'open http://localhost:4568'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('start', [
    'nodemon'
  ]);

  grunt.registerTask('build', ['eslint', 'test', 'uglify']);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', function(n) {
    grunt.task.run(['build']);
    if (grunt.option('prod')) {
      grunt.task.run(['gitpush:live']);
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run(['shell:devServer']);
      grunt.task.run('nodemon');
    }
  });
  
};
