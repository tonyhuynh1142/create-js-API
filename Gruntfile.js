module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'app/views/',
      styles: 'app/styles/',
      scripts: 'app/scripts/',
      assets: 'app/assets/',
      build: 'static/',
      doc: 'doc/'
    },
    pug: {
      compile: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: '<%= meta.views %>',
          src: ['**/*.pug', '!blocks/**', '!layouts/**', '!mixins/**'],
          dest: '<%= meta.build %>',
          ext: '.html'
        }]
      }
    },
    less: {
      dev: {
        options: {
          compress: false
        },
        files: [{
          '<%= meta.build %>style/libs.css': '<%= meta.styles %>libs/libs.less',
          '<%= meta.build %>style/print.css': '<%= meta.styles %>print.less',
          '<%= meta.build %>style/style.css': '<%= meta.styles %>style.less'
        }]
      }
    },
    concat: {
      dist: {
        files: [{
          '<%= meta.build %>js/modernizr.js': ['<%= meta.scripts %>libs/modernizr.2.8.3.js','<%= meta.scripts %>libs/detectizr.js'],
          '<%= meta.build %>js/libs.js': ['<%= meta.scripts %>libs/jquery-2.1.4.js', '<%= meta.scripts %>libs/handlebars-v4.0.5.js', '<%= meta.scripts %>libs/jquery.validate.js', '<%= meta.scripts %>libs/plugins/*.js', '<%= meta.scripts %>libs/plugins/bootstrap/transition.js', '<%= meta.scripts %>libs/plugins/bootstrap/alert.js', '<%= meta.scripts %>libs/plugins/bootstrap/button.js', '<%= meta.scripts %>libs/plugins/bootstrap/carousel.js', '<%= meta.scripts %>libs/plugins/bootstrap/collapse.js', '<%= meta.scripts %>libs/plugins/bootstrap/dropdown.js', '<%= meta.scripts %>libs/plugins/bootstrap/modal.js', '<%= meta.scripts %>libs/plugins/bootstrap/tooltip.js', '<%= meta.scripts %>libs/plugins/bootstrap/popover.js', '<%= meta.scripts %>libs/plugins/bootstrap/scrollspy.js', '<%= meta.scripts %>libs/plugins/bootstrap/tab.js', '<%= meta.scripts %>libs/plugins/bootstrap/affix.js'],
          '<%= meta.build %>js/l10n.js': '<%= meta.scripts %>l10n.js',
          '<%= meta.build %>js/script.js': ['<%= meta.scripts %>site.js', '<%= meta.scripts %>plugins/*.js']
        }]
      },
      css: {
        files: [{
          '<%= meta.build %>css/style.css': ['<%= meta.build %>style/libs.css', '<%= meta.build %>style/style.css', '<%= meta.build %>style/print.css']
        }]
      }
    },
    copy: {
      data: {
        files: [{
          expand: true,
          cwd: '<%= meta.views %>data/',
          src: ['**', '!*.pug'],
          dest: '<%= meta.build %>data/'
        }]
      },
      fonts: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>fonts/',
          src: '**',
          dest: '<%= meta.build %>fonts/'
        }]
      },
      icons: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>icons/',
          src: '**',
          dest: '<%= meta.build %>'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>images/',
          src: '**',
          dest: '<%= meta.build %>images/'
        }]
      },
      media: {
        files: [{
          expand: true,
          cwd: '<%= meta.assets %>media/',
          src: '**',
          dest: '<%= meta.build %>media/'
        }]
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['<%= meta.scripts %>plugins/*.js']
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      files: ['<%= meta.build %>style/style.css']
    },
    htmlhint: {
      options: {
        htmlhintrc: '.htmlhintrc'
      },
      files: ['<%= meta.build %>*.html']
    },
    puglint: {
      options: {
        config: '.pug-lintrc'
      },
      files: ['<%= meta.views %>**/*.pug']
    },
    watch: {
      options: {
        spawn: false,
        interrupt: false,
        livereload: true
      },
      js: {
        files: ['<%= meta.scripts %>plugins/*.js', '<%= meta.scripts %>*.js'],
        tasks: ['jshint', 'concat:dist']
      },
      pug: {
        files: ['<%= meta.views %>**/*.pug'],
        tasks: ['pug', 'htmlhint']
      },
      data: {
        files: ['<%= meta.views %>data/**'],
        tasks: ['copy:data']
      },
      less: {
        files: ['<%= meta.styles %>**/*.less'],
        tasks: ['less', 'autoprefixer', 'csslint']
      },
      fonts: {
        files: ['<%= meta.assets %>fonts/**'],
        tasks: ['copy:fonts']
      },
      icons: {
        files: ['<%= meta.assets %>icons/**'],
        tasks: ['copy:icons']
      },
      images: {
        files: ['<%= meta.assets %>images/**'],
        tasks: ['copy:images']
      },
      media: {
        files: ['<%= meta.assets %>media/**'],
        tasks: ['copy:media']
      }
    },
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 3,
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= meta.build %>images/',
          src: '**/*.{png,jpg,gif}',
          dest: '<%= meta.build %>images/'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          '<%= meta.build %>/index.html': '<%= meta.build %>/index.html'
        }
      }
    },
    cssmin: {
      options: {
        advanced: false,
        keepBreaks: false,
        keepSpecialComments: 0
      },
      compress: {
        files: [{
          '<%= meta.build %>css/style.css': '<%= meta.build %>css/style.css'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>',
        compress: true,
        beautify: false,
        preserveComments: false
      },
      dist: {
        files: [{
          '<%= meta.build %>js/modernizr.js': ['<%= meta.scripts %>libs/modernizr.2.8.3.js','<%= meta.scripts %>libs/detectizr.js'],
          '<%= meta.build %>js/script.js': ['<%= meta.scripts %>l10n.js', '<%= meta.scripts %>libs/jquery-2.1.4.js', '<%= meta.scripts %>libs/handlebars-v4.0.5.js', '<%= meta.scripts %>libs/jquery.validate.js', '<%= meta.scripts %>libs/plugins/*.js', '<%= meta.scripts %>libs/plugins/bootstrap/transition.js', '<%= meta.scripts %>libs/plugins/bootstrap/alert.js', '<%= meta.scripts %>libs/plugins/bootstrap/button.js', '<%= meta.scripts %>libs/plugins/bootstrap/carousel.js', '<%= meta.scripts %>libs/plugins/bootstrap/collapse.js', '<%= meta.scripts %>libs/plugins/bootstrap/dropdown.js', '<%= meta.scripts %>libs/plugins/bootstrap/modal.js', '<%= meta.scripts %>libs/plugins/bootstrap/tooltip.js', '<%= meta.scripts %>libs/plugins/bootstrap/popover.js', '<%= meta.scripts %>libs/plugins/bootstrap/scrollspy.js', '<%= meta.scripts %>libs/plugins/bootstrap/tab.js', '<%= meta.scripts %>libs/plugins/bootstrap/affix.js', '<%= meta.scripts %>site.js', '<%= meta.scripts %>plugins/*.js']
        }]
      }
    },
    usemin: {
      html: '<%= meta.build %>/**/*.html'
    },
    autoprefixer: {
      options: {
        browsers: [
          'last 2 Chrome versions',
          'Firefox ESR',
          'Explorer >= 10',
          'iOS >= 9',
          'Safari >= 9',
          'Android >= 4.4'
        ]
      },
      files: {
        expand: true,
        src: '<%= meta.build %>style/*.css'
      }
    },
    markdownpdf: {
      files: {
        src: ['<%= meta.doc %>/*.md'],
        dest: '<%= meta.doc %>'
      }
    },
    nodemon: {
      dev: {
        options: {
          ignore: ['node_modules/**', '<%= meta.scripts %>**'],
          ext: 'js',
          watch: ['server'],
          delay: 1
        },
        script: 'app/server.js'
      }
    },
    concurrent: {
      options: {
        limit: 2
      },
      dev: {
        options: {
          logConcurrentOutput: true
        },
        tasks: ['nodemon', 'watch']
      }
    },
    qunit: {
      all: ['test/**/*.html']
    },
    clean: {
      options: {
        force: true
      },
      build: ['static'],
      cssTemp: ['static/style'],
      jsTemp: ['static/js']
    },
    'gh-pages': {
      options: {
        base: '<%= meta.build %>'
      },
      src: ['**']
    }
  });
  grunt.file.expand('./node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
  require('time-grunt')(grunt);
  grunt.registerTask('build', ['clean', 'concat:dist', 'less', 'puglint', 'pug', 'copy', 'autoprefixer', 'htmlhint', 'jshint', 'csslint']);
  grunt.registerTask('buildRelease', ['build', 'concat:css', 'clean:cssTemp', 'clean:jsTemp']);
  grunt.registerTask('default', ['build', 'concurrent']);
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('doc', ['markdownpdf']);
  grunt.registerTask('release', ['buildRelease', 'test', 'imagemin', 'usemin', 'uglify', 'cssmin']);
  grunt.registerTask('deploy', ['release', 'gh-pages']);
};
