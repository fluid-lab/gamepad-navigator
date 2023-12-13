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
            label: "Text Input",
            description: "Enter some text!",
            value: 0
        },
        modelRelay: [{
            source: "{that}.model.value",
            target: "dom.input.value"
        }],
        markup: {
            container: "<div class='gamepad-text-input-outer-container'><div class='gamepad-text-input-header'>%label</div><div class='gamepad-text-input-container'><div class='gamepad-text-input-description'>%description</div><input class='gamepad-text-input'></input></div></div>"
        },
        selectors: {
            input: ".gamepad-text-input"
        },
        invokers: {
            handleInputChange: {
                funcName: "gamepad.ui.textInput.handleInputChange",
                args: ["{that}", "{arguments}.0"]
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

    // TODO: This doesn't seem to work for the onscreen keyboard.
    gamepad.ui.textInput.handleInputChange = function (that, event) {
        that.applier.change("value", event.target.value);
    };
})(fluid);
