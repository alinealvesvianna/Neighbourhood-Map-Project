module.exports = function(grunt) {

    grunt.initConfig({

        clean: {
            dist: {
                src: ['dist/css/', 'dist/js/', 'dist/']
            }
        },

        mkdir: {
            mainDirectory: {
                options: {
                    create: ['dist']
                }
            },

            css: {
                options: {
                    create: ['dist/css/']
                }
            },

            js: {
                options: {
                    create: ['dist/js/']
                }
            },

            fonts: {
                options: {
                    create: ['dist/css/fonts']
                }
            }

        },

        minified: {

            files: {
                src: [
                    'source/js/*.js', '!*.min.js'
                ],
                dest: 'dist/js/'
            },

            options: {
                sourcemap: false,
                allinone: false,
                ext: '.min.js'
            },
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            minify: {
                files: [{
                    expand: true,
                    cwd: 'source/css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }, {
                    'dist/css/styles.min.css': ['source/css/icomoon.css', 'source/css/style.css']
                }]
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'source/css/fonts/',
                src: '**',
                dest: 'dist/css/fonts/'
            },
        },

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-minified');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');


    grunt.registerTask('default', ['clean', 'mkdir', 'minified', 'cssmin', 'copy']);


};
