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

var fetch = require("node-fetch");

require("dotenv").config({ path: ".gruntfile.env" });

var path = require("path"),
    fs = require("fs");

module.exports = function (grunt) {
    grunt.config.init({
        usebanner: {
            options: {
                licenseBanner: grunt.file.read("templates/LICENSE-banner.txt"),
                currentMarkdownBanner: /^(<!--)\s[\w\W]+?(-->)\s\s/m,
                currentJsAndJson5Banner: /^\/\*\sCopyright \(c\)[\w\W]+?\s\*\/\s\s/m
            },
            jsAndJson5: {
                options: {
                    replace: "<%= usebanner.options.currentJsAndJson5Banner %>",
                    banner: "/*\n<%= usebanner.options.licenseBanner %>*/\n"
                },
                files: {
                    src: ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "./*.json5", "tests/**/*.json5"]
                }
            },
            markdown: {
                options: {
                    replace: "<%= usebanner.options.currentMarkdownBanner %>",
                    banner: "<!--\n<%= usebanner.options.licenseBanner %>-->\n"
                },
                files: {
                    src: ["./*.md", "tests/**/*.md", "docs/**/*.md"]
                }
            }
        },
        clean: {
            previousBuild: {
                src: ["dist/"]
            },
            zip: {
                src: ["*.zip"]
            }
        },
        copy: {
            infusion: {
                expand: true,
                flatten: true,
                src: "node_modules/infusion/dist/infusion-all.min.js",
                dest: "dist/js/lib/infusion/"
            },
            ally: {
                expand: true,
                flatten: true,
                src: "node_modules/ally.js/ally.min.js",
                dest: "dist/js/lib/ally/"
            },
            source: {
                expand: true,
                cwd: "src",
                src: "**",
                dest: "dist/"
            }
        },
        packageJSON: grunt.file.readJSON("package.json"),
        updateVersion: {
            options: { jsonFiles: ["package.json", "src/manifest.json"] }
        },
        jsonprettify: {
            options: { space: 4 },
            all: { src: ["package.json", "src/manifest.json"] }
        },
        compress: {
            dist: {
                options: { archive: "build_v<%= packageJSON.version %>.zip" },
                files: [{
                    expand: true,
                    cwd: "dist/",
                    src: "**/*"
                }]
            }
        },
        prompt: {
            newRelease: {
                options: {
                    questions: [{
                        config: "githubRelease.options.tag_name",
                        type: "input",
                        default: "v<%= packageJSON.version %>",
                        message: "Tag version:"
                    }, {
                        config: "githubRelease.options.name",
                        type: "input",
                        default: "v<%= packageJSON.version %>",
                        message: "Release title:"
                    }, {
                        config: "githubRelease.options.body",
                        type: "input",
                        message: "Tag description:",
                        suffix: "Can be changed anytime on GitHub"
                    }, {
                        config: "githubRelease.options.prerelease",
                        type: "confirm",
                        message: "Pre-release:"
                    }, {
                        config: "githubRelease.options.draft",
                        type: "confirm",
                        default: false,
                        message: "Draft:"
                    }]
                }
            }
        },
        githubRelease: {
            options: {
                repo: "fluid-lab/gamepad-navigator",
                asset: "build_v<%= packageJSON.version %>.zip"
            }
        }
    });

    grunt.registerTask("updateVersion", "Update the manifest.json and package.json version.", function () {
        // Reference to the function triggered when the asynchronous task is completed.
        var done = this.async();

        // Obtain the list of JSON files to be updated.
        var jsonFiles = this.options().jsonFiles;

        // Check the version increment type and whether the release is "standard".
        var specIndexToIncrease = null,
            isStandard = grunt.option.flags().includes("--standard");
        if (grunt.option.flags().includes("--major")) {
            specIndexToIncrease = 0;
        }
        else if (grunt.option.flags().includes("--minor")) {
            specIndexToIncrease = 1;
        }
        else if (grunt.option.flags().includes("--patch")) {
            specIndexToIncrease = 2;
        }

        // Scan the JSON files provided as options.
        fluid.each(jsonFiles, function (jsonFile) {
            // Verify that the file exists.
            if (!grunt.file.exists(jsonFile)) {
                grunt.log.error(jsonFile + " is not a valid file.");
                return;
            }

            var currentVersion = grunt.file.readJSON(jsonFile).version,
                versionNumber = currentVersion.split("-", 1)[0],
                versionSpecs = fluid.transform(versionNumber.split("."), function (versionString) {
                    return parseInt(versionString);
                });

            // Update the version number if update-type flag is supplied.
            if (specIndexToIncrease) {
                versionSpecs[specIndexToIncrease]++;
                for (var index = specIndexToIncrease + 1; index < 3; index++) {
                    versionSpecs[index] = 0;
                }
            }

            var newVersionNumber = versionSpecs.join(".").toString(),
                newVersion = newVersionNumber;
            if (!isStandard && path.basename(jsonFile) !== "manifest.json") {
                newVersion = newVersion + "-dev";
            }

            // Update the JSON file with the latest version.
            var jsonFileData = grunt.file.readJSON(jsonFile);
            jsonFileData.version = newVersion;
            grunt.file.write(jsonFile, JSON.stringify(jsonFileData));
        });

        // Prettify the concatenated JSON files.
        grunt.task.run("jsonprettify");
        done();
    });

    /**
     * TODO: Create a grunt plugin replacing the current "githubRelease" task.
     * (might be of interest to the community)
     */
    grunt.registerTask("githubRelease", "Task for automated GitHub releases.", function () {
        // Reference to the function triggered when the asynchronous task is completed.
        var done = this.async();

        // Verify that the authentication token has been supplied correctly.
        if (!process.env.GITHUB_ACCESS_TOKEN) {
            grunt.log.error("GitHub access token cannot be found.");
            return;
        }
        grunt.log.subhead("Connecting...");

        var apiUrl = "https://api.github.com",
            uploadUrl = "https://uploads.github.com";

        var taskOptions = this.options(),
            repo = taskOptions.repo,
            responseStatus = null;

        var releaseUrl = apiUrl + "/repos/" + repo + "/releases";
        fetch(releaseUrl, { headers: { "Authorization": "Token " + process.env.GITHUB_ACCESS_TOKEN } })
            .then(function (response) {
                responseStatus = response.status;

                // Verify that the repository is accessible.
                if (responseStatus !== 200) {
                    if (responseStatus === 404) {
                        throw new Error("Could not find the repository: https://github.com/" + taskOptions.owner + "/" + taskOptions.repo);
                    }
                    else {
                        throw new Error("Could not connect to the repository.");
                    }
                }
                grunt.log.ok("The connection has been established.");

                // Create a release if the repository is accessible.
                grunt.log.subhead("Creating new release \"" + taskOptions.tag_name + "\" on GitHub...");
                createRelease(uploadReleaseAsset, taskOptions);
            })
            .catch(function (errorMessage) {    // eslint-disable-line
                grunt.log.error(errorMessage);

                // Indicate that the task has completed due to failure.
                done();
            });

        // Creates a release in the repository.
        var createRelease = function (callback, taskOptions) {
            var requestData = {
                method: "POST",
                headers: { "Authorization": "Token " + process.env.GITHUB_ACCESS_TOKEN },
                body: JSON.stringify({
                    tag_name: taskOptions.tag_name,
                    name: taskOptions.name,
                    body: taskOptions.body,
                    draft: taskOptions.draft,
                    prerelease: taskOptions.prerelease
                })
            };

            var createReleaseStatus = null;
            fetch(releaseUrl, requestData)
                .then(function (response) {
                    createReleaseStatus = response.status;
                    return response.json();
                })
                .then(function (responseData) {
                    // Announce failure if the release could not be created.
                    if (createReleaseStatus !== 201) {
                        if (createReleaseStatus === 422 && responseData.errors[0].code === "already_exists") {
                            throw new Error("A release with the tag \"" + taskOptions.tag_name + "\" already exists.");
                        }
                        else {
                            throw new Error("The release could not be created.");
                        }
                    }

                    // Update the user that the release has been created.
                    grunt.log.ok("The release has been created at " + responseData.html_url);

                    // Start uploading the asset file to the created release.
                    grunt.log.subhead("Scanning and uploading asset file \"" + taskOptions.asset + "\"...");
                    callback(responseData.id, taskOptions);
                })
                .catch(function (createReleaseError) {  // eslint-disable-line
                    grunt.log.error(createReleaseError);

                    // Indicate that the task has completed due to failure.
                    done();
                });
        };

        // Uploads the asset file to the newly-created release.
        var uploadReleaseAsset = function (releaseId, taskOptions) {
            // Check if the asset file exists.
            if (!grunt.file.exists(taskOptions.asset)) {
                throw new Error("The asset file \"" + taskOptions.asset +  "\" does not exist.");
            }

            // Check if the file is in "zip" format.
            if (!taskOptions.asset.includes(".zip")) {
                throw new Error("The asset\"" + taskOptions.asset +  "\" is not a \"zip\" file.");
            }

            // Obtain characteristics of the asset file.
            fs.stat(taskOptions.asset, function (error, stats) {
                // Read the "zip" file from the system.
                var assetStream = fs.createReadStream(taskOptions.asset);

                // Set the URL and the request parameters for asset upload.
                var assetUploadUrl = uploadUrl + "/repos/" + repo + "/releases/" + releaseId + "/assets?name=" + path.basename(taskOptions.asset),
                    assetRequestData = {
                        method: "POST",
                        headers: {
                            "content-type": "application/zip",
                            "content-length": stats.size,
                            "Authorization": "Token " + process.env.GITHUB_ACCESS_TOKEN
                        },
                        body: assetStream
                    };

                // Upload the asset file.
                fetch(assetUploadUrl, assetRequestData)
                    .then(function (response) {
                        // Register failure in the "Upload Asset" process.
                        if (response.status !== 201) {
                            throw new Error("The asset file \"" + taskOptions.asset + "\" could not be uploaded.");
                        }

                        // Indicate that the task has completed.
                        grunt.log.ok("The asset file \"" + taskOptions.asset + "\" has been uploaded.");
                        done();
                    })
                    .catch(function (assetUploadError) {    // eslint-disable-line
                        grunt.log.error(assetUploadError);

                        // Indicate that the task has completed due to failure.
                        done();
                    });
            });
        };
    });

    grunt.loadNpmTasks("grunt-banner");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-compress");
    grunt.loadNpmTasks("grunt-prompt");
    grunt.loadNpmTasks("grunt-json-prettify");

    grunt.registerTask("banner", "Add copyright banner at the top of files.", ["usebanner"]);

    grunt.registerTask("build", "Build an unpacked extension.", ["clean", "copy"]);
    grunt.registerTask("archive", "Generate an zip package of the extension.", ["build", "compress"]);
    grunt.registerTask("release", "Create a new release on GitHub and upload the extension's zip file.", ["archive", "prompt", "githubRelease"]);

    grunt.registerTask("default", ["banner", "build"]);
};
