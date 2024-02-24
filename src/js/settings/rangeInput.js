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
            value: 0,
            summary: ""
        },
        markup: {
            container:
                "<div class='gamepad-range-input-outer-container'>\n" +
                "\t<div class='gamepad-range-input-vertical-container'>" +
                "\t\t<div class='gamepad-range-input-bar-container'>\n" +
                "\t\t\t<div class='gamepad-range-min'></div>\n" +
                "\t\t\t<input type='range' class='gamepad-range-input'></input>\n" +
                "\t\t\t<div class='gamepad-range-max'></div>\n" +
                "\t\t</div>\n" +
                "\t\t<div class='gamepad-range-summary'>%summary</div>\n" +
                "\t</div>" +
                "</div>\n"
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
                this: "{that}.container",
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


    // A wrapped grade that includes the surrounding markup for a preference entry.
    fluid.defaults("gamepad.ui.prefs.rangeInput", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            label: "Range Input",
            value: 0
        },
        markup: {
            container:
                "<div class='gamepad-pref-outer-container'>\n" +
                "\t<div class='gamepad-pref-label'>%label</div>\n" +
                "\t<div class='gamepad-pref-body'>\n" +
                "\t<div class='gamepad-pref-description'>%description</div>\n" +
                "\t<div class='gamepad-range-input-container'>\n</div>\n" +
                "</div>\n"
        },
        selectors: {
            input: ".gamepad-range-input-container"
        },
        components: {
            input: {
                container: "{that}.dom.input",
                type: "gamepad.ui.rangeInput",
                options: {
                    model: {
                        max: "{gamepad.ui.prefs.rangeInput}.model.max",
                        min: "{gamepad.ui.prefs.rangeInput}.model.min",
                        step: "{gamepad.ui.prefs.rangeInput}.model.step",
                        value: "{gamepad.ui.prefs.rangeInput}.model.value"
                    }
                }
            }
        }
    });

    fluid.defaults("gamepad.ui.bindingParam.rangeInput", {
        gradeNames: ["gamepad.ui.prefs.rangeInput"],
        markup: {
            container:
                "<div class='gamepad-bindingParam-outer-container'>\n" +
                "\t<div class='gamepad-bindingParam-label'>%label</div>\n" +
                "\t<div class='gamepad-bindingParam-body'>\n" +
                "\t<div class='gamepad-bindingParam-description'>%description</div>\n" +
                "\t<div class='gamepad-range-input-container'>\n</div>\n" +
                "</div>\n"
        }
    });
})(fluid);
