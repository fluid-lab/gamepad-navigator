/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    // A base grade without selectors or model relays, so that we can more easily change the behaviour in variants.
    fluid.defaults("gamepad.ui.rangeInput", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            label: "Range Input",
            value: 0,
            summary: ""
        },
        markup: {
            container: "<div class='gamepad-range-input-outer-container'>\n<div class='gamepad-range-input-header'>%label</div>\n<div class='gamepad-range-input-vertical-container'>\n<div class='gamepad-range-description'>%description</div>\n<div class='gamepad-range-input-container'>\n<div class='gamepad-range-min'></div>\n<input type='range' class='gamepad-range-input'></input>\n<div class='gamepad-range-max'></div>\n</div>\n<div class='gamepad-range-summary'>%summary</div>\n</div>\n</div>"
        },
        modelListeners: {
            value: {
                funcName: "gamepad.ui.rangeInput.createSummary",
                args: ["{that}"]
            }
        },
        templates: {
            summary: "%value",
            noValue: "%value"
        },
        selectors: {
            input: ".gamepad-range-input",

            min: ".gamepad-range-min",
            max: ".gamepad-range-max",

            summary: ".gamepad-range-summary"
        },
        modelRelay: [
            // Input attributes
            {
                source: "{that}.model.min",
                target: "dom.input.attr.min"
            },
            {
                source: "{that}.model.max",
                target: "dom.input.attr.max"
            },
            {
                source: "{that}.model.step",
                target: "dom.input.attr.step"
            },
            {
                source: "{that}.model.value",
                target: "dom.input.value"
            },

            // Onscreen text
            {
                source: "{that}.model.min",
                target: "dom.min.text"
            },
            {
                source: "{that}.model.max",
                target: "dom.max.text"
            },
            {
                source: "{that}.model.summary",
                target: "dom.summary.text"
            }
        ],
        invokers: {
            handleInputChange: {
                funcName: "gamepad.ui.rangeInput.handleInputChange",
                args: ["{that}", "{arguments}.0"] // event
            }
        },
        listeners: {
            "onCreate.bindChange": {
                this: "{that}.dom.input",
                method: "change",
                args: ["{that}.handleInputChange"]
            }
        }
    });

    gamepad.ui.rangeInput.createSummary = function (that) {
        if (that.model.value) {
            var summary = fluid.stringTemplate(that.options.templates.summary, that.model);
            that.applier.change("summary", summary);
        }
        else {
            that.applier.change("summary", that.options.templates.noValue);
        }
    };

    gamepad.ui.rangeInput.handleInputChange = function (that, event) {
        var newValue = event.target.value || 0;
        try {
            var numberValue = parseFloat(newValue);
            that.applier.change("value", numberValue);
        }
        catch (error) {
            fluid.log("Invalid range input: '" + newValue + "'.");
        }
    };
})(fluid);
