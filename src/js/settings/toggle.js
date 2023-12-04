/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/
(function (fluid) {
    "use strict";
    // var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.ui.toggle", {
        gradeNames: ["gamepad.templateRenderer"],
        styles: {
            checked: "checked"
        },
        model: {
            label: "Toggle",
            checked: true
        },
        markup: {
            container: "<div class='gamepad-toggle-outer-container'><div class='gamepad-toggle-header'>%label</div><div tabindex='0' role='switch' class='gamepad-toggle'><div class='gamepad-toggle-slider'></div></div></div>"
        },
        selectors: {
            toggle: ".gamepad-toggle"
        },
        modelRelay: [
            {
                source: "{that}.model.dom.toggle.click",
                target: "{that}.model.checked",
                singleTransform: "fluid.transforms.toggle"
            },
            {
                source: "{that}.model.checked",
                target: {
                    segs: ["dom", "toggle", "class", "{that}.options.styles.checked"]
                }
            }
        ]
    });
})(fluid);
