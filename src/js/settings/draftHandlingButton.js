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
    fluid.defaults("gamepad.settings.draftHandlingButton", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<button class='gamepad-settings-draft-button'>%label</button>"
        },
        model: {
            label: "Draft Button",
            disabled: true
        },
        modelRelay: {
            source: "{that}.model.disabled",
            target: "{that}.model.dom.container.attr.disabled"
        }
    });

    fluid.defaults("gamepad.settings.draftHandlingButton.discard", {
        gradeNames: ["gamepad.settings.draftHandlingButton"],
        model: {
            label: "Discard Changes"
        }
    });

    fluid.defaults("gamepad.settings.draftHandlingButton.save", {
        gradeNames: ["gamepad.settings.draftHandlingButton"],
        model: {
            label: "Save Changes"
        }
    });
})(fluid);
