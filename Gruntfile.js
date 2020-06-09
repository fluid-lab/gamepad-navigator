/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js"],
                md:    [ "./*.md", "tests/**/*.md"],
                json:  ["./*.json", "./.*.json", "tests/**/*.json"],
                json5: ["./*.json5", "tests/**/*.json5"],
                other: ["./.*"]
            }
        }
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};
