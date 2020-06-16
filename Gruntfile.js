/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js"],
                md:    ["./*.md", "tests/**/*.md", "docs/*.md"],
                json:  ["./*.json", "./.*.json", "tests/**/*.json"],
                json5: ["./*.json5", "tests/**/*.json5"],
                other: ["./.*"]
            }
        },
        usebanner: {
            jsAndJson5: {
                options: {
                    replace: "<%= currentJsAndJson5Banner %>",
                    banner: "/*\n<%= licenseBanner %>*/\n"
                },
                files: {
                    src: ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "./*.json5", "tests/**/*.json5"]
                }
            },
            markdown: {
                options: {
                    replace: "<%= currentMarkdownBanner %>",
                    banner: "<!--\n<%= licenseBanner %>-->\n"
                },
                files: {
                    src: ["./*.md", "tests/**/*.md", "docs/*.md"]
                }
            }
        },
        clean: {
            previousBuild: {
                src: ["dist/"]
            }
        },
        copy: {
            infusion: {
                expand: true,
                flatten: true,
                src: "node_modules/infusion/dist/infusion-all.min.js",
                dest: "dist/js/lib/infusion/"
            },
            source: {
                expand: true,
                cwd: "src",
                src: "**",
                dest: "dist/"
            }
        },
        licenseBanner: grunt.file.read("templates/LICENSE-banner.txt"),
        currentMarkdownBanner: /^(<!--)\s[\w\W]+?(-->)\s\s/m,
        currentJsAndJson5Banner: /^\/\*\sCopyright \(c\)[\w\W]+?\s\*\/\s\s/m
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.loadNpmTasks("grunt-banner");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
    grunt.registerTask("banner", "Add copyright banner at the top of files.", ["usebanner"]);
    grunt.registerTask("build", "Build an unpacked extension.", ["clean", "copy"]);

    grunt.registerTask("default", ["build"]);
};
