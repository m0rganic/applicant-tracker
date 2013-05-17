/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*' + 
      '\n * <%= pkg.title || pkg.name %>' + 
      '\n * v<%= pkg.version %>' +
      '\n * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>' +
      '\n * Licensed under <%= pkg.license %>' +
      '\n */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      lib: {
        src: ['lib/**/*.js'],
        dest: 'dist/lib.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: false,
        boss: true,
        eqnull: true,
        browser: true,
        passfail: true,
        devel: true,
        globals: {
          define: true,
          require: true,
          requirejs: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        src: ['js/**/*.js', '!js/vendor/**/*.js']
      }
    },
    copy: {
      resources: {
        files: {
          "dist/": [ "./index.html", "./main.js" ]
        }
      },
      js: {
        src: 'js/**/*.js',
        dest: 'dist/'
      },
      img: {
        src: 'img/**/*',
        dest: 'dist/'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: '<%= jshint.js.src %>',
        tasks: ['jshint:js', 'copy:js']
      },
      resources: {
        files: ['index.html', 'main.js'],
        tasks: ['copy:resources']
      },
      styles: {
        files: 'less/**/*.less',
        tasks: ['include_bootstrap']
      }
    },
    clean: {
      dist: 'dist'
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: './dist'
        }
      }
    },
    include_bootstrap: {
      all: {
        files: {
          'dist/styles.css': 'less/manifest.less'
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-include-bootstrap');

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'copy', 'include_bootstrap', 'connect', 'watch']);

};
