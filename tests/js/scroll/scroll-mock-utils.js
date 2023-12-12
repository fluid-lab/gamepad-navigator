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

    fluid.defaults("gamepad.tests.scroll.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: window,
        model: {
            bindings: {
                axes: {
                    0: { action: "scrollHorizontally", scrollFactor: 50},
                    1: { action: "scrollVertically", scrollFactor: 50}
                },
                buttons: {
                    // D-Pad, up, down, left, right
                    12: { action: "scrollUp", scrollFactor: 50 },
                    13: { action: "scrollDown", scrollFactor: 50 },
                    14: { action: "scrollLeft", scrollFactor: 50 },
                    15: { action: "scrollRight", scrollFactor: 50 }
                }
            }
        }
    });
})(fluid);
