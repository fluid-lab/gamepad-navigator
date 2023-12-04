/* eslint-env node */
"use strict";
var fluid = require("infusion");
var fs = require("fs");
var path = require("path");

var gamepad = fluid.registerNamespace("gamepad");

fluid.defaults("gamepad.bundleSvgs", {
    gradeNames: ["fluid.component"],
    outputPath: "dist/js/content_scripts/svgs.js",
    outputTemplate: "\"use strict\";\nvar gamepad = fluid.registerNamespace(\"gamepad\");\nfluid.registerNamespace(\"gamepad.svg\");\n%payload\n",
    singleFileTemplate: "\ngamepad.svg[\"%filename\"] = `%svgText`;\n",
    pathsToBundle: {
        src: "src/images"
    },
    excludes: [],
    listeners: {
        "onCreate.processDirs": {
            funcName: "gamepad.bundleSvgs.processDirs",
            args: ["{that}"]
        }
    }
});

gamepad.bundleSvgs.processDirs = function (that) {
    var payload = "";

    var resolvedExcludes = that.options.excludes.map(function (relativePath) {
        return path.resolve(relativePath);
    });

    fluid.each(that.options.pathsToBundle, function (pathToBundle) {
        var filenames = fs.readdirSync(pathToBundle);
        fluid.each(filenames, function (filename) {
            if (filename.toLowerCase().endsWith(".svg")) {
                var filenameMinusExtension = path.basename(filename, ".svg");
                var filePath = path.resolve(pathToBundle, filename);
                if (!resolvedExcludes.includes(filePath)) {
                    var fileContents = fs.readFileSync(filePath, { encoding: "utf8"});
                    var filePayload = fluid.stringTemplate(that.options.singleFileTemplate, { filename: filenameMinusExtension, svgText: fileContents});
                    payload += filePayload;
                }
            }
        });
    });

    var bundle = fluid.stringTemplate(that.options.outputTemplate, { payload: payload});

    fs.writeFileSync(that.options.outputPath, bundle, { encoding: "utf8"});

    fluid.log(fluid.logLevel.WARN, "bundled all SVG files to '" + that.options.outputPath + "'");
};

gamepad.bundleSvgs();
