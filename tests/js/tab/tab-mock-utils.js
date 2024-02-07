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

    fluid.registerNamespace("gamepad.tests.utils.buttons");
    fluid.registerNamespace("gamepad.tests.utils.axes");

    // Custom gamepad navigator component grade for tab navigation tests.
    fluid.defaults("gamepad.tests.tab.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: window,
        model: {
            bindings: {
                axes: {
                    2: { action: "thumbstickTabbing" }
                },
                buttons: {
                    4: { action: "tabBackward" }, // Left Bumper.
                    5: { action: "tabForward" } // Right Bumper.
                }
            }
        }
    });
})(fluid);
