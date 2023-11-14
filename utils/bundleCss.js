/* eslint-env node */
"use strict";
var fluid = require("infusion");
var fs = require("fs");
var path = require("path");

var gamepad = fluid.registerNamespace("gamepad");

fluid.defaults("gamepad.bundleCss", {
    gradeNames: ["fluid.component"],
    outputPath: "dist/js/content_scripts/styles.js",
    outputTemplate: "\"use strict\";\nvar gamepad = fluid.registerNamespace(\"gamepad\");\ngamepad.css = `%payload`;\n",
    pathsToBundle: {
        src: "src/css",
        osk: "node_modules/fluid-osk/src/css"
    },
    excludes: [
        "src/css/common.css",
        "src/css/configuration-panel.css"
    ],
    listeners: {
        "onCreate.processDirs": {
            funcName: "gamepad.bundleCss.processDirs",
            args: ["{that}"]
        }
    }
});

gamepad.bundleCss.processDirs = function (that) {
    var payload = "";

    var resolvedExcludes = that.options.excludes.map(function (relativePath) {
        return path.resolve(relativePath);
    });

    fluid.each(that.options.pathsToBundle, function (pathToBundle) {
        var filenames = fs.readdirSync(pathToBundle);
        fluid.each(filenames, function (filename) {
            if (filename.toLowerCase().endsWith(".css")) {
                var filePath = path.resolve(pathToBundle, filename);
                if (!resolvedExcludes.includes(filePath)) {
                    var fileContents = fs.readFileSync(filePath, { encoding: "utf8"});
                    payload += fileContents;
                }
            }
        });
    });

    var bundle = fluid.stringTemplate(that.options.outputTemplate, { payload: payload});

    fs.writeFileSync(that.options.outputPath, bundle, { encoding: "utf8"});

    fluid.log(fluid.logLevel.WARN, "bundled all CSS to '" + that.options.outputPath + "'");
};

gamepad.bundleCss();
