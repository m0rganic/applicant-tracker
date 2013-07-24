/**
 * Copyright 2013 Kinvey, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
    },
    // make a zipfile
    compress: {
      main: {
        options: {
          archive: 'applicant_tracker.zip'
        },
        files: [
          {cwd: 'dist/', src: ['**']}
        ]
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
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'copy', 'include_bootstrap', 'connect', 'compress', 'watch']);

};
