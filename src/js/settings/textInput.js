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

    fluid.defaults("gamepad.ui.textInput", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            value: 0
        },
        modelRelay: [{
            source: "{that}.model.value",
            target: "dom.container.value"
        }],
        markup: {
            container: "<input class='gamepad-text-input'></input>"
        },
        invokers: {
            handleInputChange: {
                funcName: "gamepad.ui.textInput.handleInputChange",
                args: ["{that}", "{arguments}.0"]
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

    gamepad.ui.textInput.handleInputChange = function (that, event) {
        that.applier.change("value", event.target.value);
    };

    fluid.defaults("gamepad.ui.prefs.textInput", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            label: "Text Input",
            description: "Enter some text!",
            value: 0
        },
        markup: {
            container: "<div class='gamepad-pref-outer-container'><div class='gamepad-pref-label'>%label</div><div class='gamepad-pref-body'><div class='gamepad-pref-description'>%description</div><div class='gamepad-text-input-container'></div></div></div>"
        },
        selectors: {
            input: ".gamepad-text-input-container"
        },
        components: {
            input: {
                container: "{that}.dom.input",
                type: "gamepad.ui.textInput",
                options: {
                    model: {
                        value: "{gamepad.ui.prefs.textInput}.model.value"
                    }
                }
            }
        }
    });
})(fluid);
