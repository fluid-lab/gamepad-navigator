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
    // var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.ui.toggle", {
        gradeNames: ["gamepad.templateRenderer"],
        styles: {
            checked: "checked"
        },
        model: {
            checked: true
        },
        markup: {
            container: "<div tabindex='0' role='switch' class='gamepad-toggle'><div class='gamepad-toggle-slider'></div>"
        },
        modelRelay: [
            {
                source: "{that}.model.dom.container.click",
                target: "{that}.model.checked",
                singleTransform: "fluid.transforms.toggle"
            },
            {
                source: "{that}.model.checked",
                target: {
                    segs: ["dom", "container", "class", "{that}.options.styles.checked"]
                }
            }
        ]
    });

    fluid.defaults("gamepad.ui.prefs.toggle", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            label: "Toggle",
            checked: true
        },
        markup: {
            container: "<div class='gamepad-pref-outer-container'><div class='gamepad-pref-label'>%label</div><div class='gamepad-pref-body'><div class='gamepad-pref-description'>%description</div><div class='gamepad-toggle-container'></div></div>"
        },
        selectors: {
            toggle: ".gamepad-toggle-container"
        },
        components: {
            toggle: {
                container: "{that}.dom.toggle",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        checked: "{gamepad.ui.prefs.toggle}.model.checked"
                    }
                }
            }
        }
    });

    fluid.defaults("gamepad.ui.bindingParam.toggle", {
        gradeNames: ["gamepad.ui.prefs.toggle"],
        markup: {
            container: "<div class='gamepad-bindingParam-outer-container'><div class='gamepad-bindingParam-label'>%label</div><div class='gamepad-bindingParam-body'><div class='gamepad-bindingParam-description'>%description</div><div class='gamepad-toggle-container'></div></div>"
        }
    });
})(fluid);
