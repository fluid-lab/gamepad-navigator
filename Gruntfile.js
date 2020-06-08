/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "!./src/lib/**/*.js"],
                md:    [ "./*.md", "tests/**/*.md", "!tests/fixtures/md/bad.md"],
                json:  ["./*.json", "./.*.json", "tests/**/*.json", "!tests/fixtures/json/bad.json"],
                json5: ["./*.json5", "tests/**/*.json5", "!tests/fixtures/json5/bad.json5", "!tests/fixtures/json5/dangling-comma.json5"],
                other: ["./.*"]
            }
        }
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};
