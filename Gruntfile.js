module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    // JShint
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

      // when this task is run, lint the Gruntfile and all js files in src
      // ** for all folders and * for all files
      //build: ['Gruntfile.js', 'src/**/*.js']
      build: ['Gruntfile.js', 'src/js/**/*.js']
    },
    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n',
        mangle: false
      },
      build: {
        files: {
          //'dist/js/bundle.min.js': ['src/lib/**/*.js', 'src/js/main.js']
          'dist/js/main.min.js': ['src/js/main.js']
        }
      },
      bundle: {
        files: {
          //'dist/js/bundle.min.js': ['src/lib/**/*.js', 'src/js/main.js']
          'dist/js/bundle.min.js': ['src/lib/**/*.js']
        }
      }
    },
    // compile sass stylesheets to css -----------------------------------------
    sass: {
      options: {
        sourceMap: false
      },
      dist: {
        files: {
          'src/css/main.css': 'src/css/main.scss'
        }
      }
    },
    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          //'dist/css/bundle.min.css': ['src/css/**/*.css', '!src/css/main.css', 'src/css/main.css']
          'dist/css/main.min.css': ['src/css/main.css']
        }
      },
      bundle: {
        files: {
          //'dist/css/bundle.min.css': ['src/css/**/*.css', '!src/css/main.css', 'src/css/main.css']
          'dist/css/bundle.min.css': ['src/css/**/*.css', '!src/css/main.css']
        }
      }
    },
    // copy files
    copy: {
      main: {
        expand: true,
        cwd: 'src/files',
        src: '**/*',
        dest: 'dist/',
      },
      img: {
        expand: true,
        cwd: 'src/img',
        src: '**/*',
        dest: 'dist/img/',
      }
    //   js: {
    //     expand: true,
    //     cwd: 'src/js',
    //     src: '**/*',
    //     dest: 'dist/js/',
    //   },
    //   lib: {
    //     expand: true,
    //     cwd: 'src/lib',
    //     src: '**/*',
    //     dest: 'dist/js/',
    //   },
    //   css: {
    //     expand: true,
    //     cwd: 'src/css',
    //     src: '**/*.css',
    //     dest: 'dist/css/',
    //   }
    },
    //concat
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/lib/**/*.js', 'src/js/**/*.js'],
        dest: 'src/js/bundle.js',
      },
    },
    //start server
    connect: {
      server: {
        options: {
          port: 9006,
          base: 'dist',
          livereload: true,
          hostname: 'localhost',
          protocol: 'http',
          open: true,
        },
      }
    },
    // configure watch to auto update ----------------
    watch: {
      options: {
        livereload: true,
      },
      // for stylesheets, watch css and sass files
      // only run sass and cssmin
      stylesheets: {
        files: ['src//*.css', 'src//**/*.scss'],
        tasks: ['sass', 'cssmin:build']
      },

      // for scripts, run jshint and uglify
      scripts: {
        files: 'src/js/**/*.js',
        tasks: ['jshint', 'uglify:build']
      },

      // html files changed
      html: {
        files: 'src/**/*.html',
        tasks: ['copy'],
        //options: {livereload: true,}
      }

    }

  });

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // ============= // CREATE TASKS ========== //
  // this default task will go through all configuration (dev and production) in each task
  grunt.registerTask('default', ['jshint', 'uglify', 'sass', 'cssmin', 'copy']);

  // this task will only run the dev configuration
  grunt.registerTask('dev', ['jshint:dev', 'uglify:dev', 'cssmin:dev', 'sass:dev']);

  // only run production configuration
  grunt.registerTask('production', ['jshint:production', 'uglify:production', 'cssmin:production', 'sass:production']);

  // create files to start with
  grunt.registerTask('create', ['sass', 'cssmin:bundle', 'cssmin:build', 'uglify:bundle', 'uglify:build', 'copy']);
  // bundle library files
  grunt.registerTask('bundle', ['uglify:bundle', 'cssmin:bundle']);
  //grunt.registerTask('server', ['connect:server', 'watch']);
  grunt.registerTask('server', ['connect', 'watch']);

};
