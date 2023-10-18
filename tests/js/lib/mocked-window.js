/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad */

(function (fluid) {
    "use strict";
    fluid.defaults("gamepad.test.window", {
        gradeNames: ["fluid.modelComponent"],
        members: {
            // Required for our ally integration.
            MutationObserver: window.MutationObserver,
            navigator: {
                getGamepads: "{that}.getGamepads"
            }
        },
        model: {
            gamepads: [{}]
        },
        invokers: {
            // TODO: Improve this so that we can test gamepad (dis)connects.
            addEventListener: {
                funcName: "fluid.identity"
            },
            getGamepads: {
                funcName: "gamepad.test.window.getGamepads",
                args: ["{that}"]
            }
        }
    });
    gamepad.test.window.getGamepads = function (that) {
        var allGamepadMocks = [];
        fluid.each(that.model.gamepads, function (gamepadDef) {
            var singleGamepad = gamepad.tests.utils.generateGamepadMock(gamepadDef);
            allGamepadMocks.push(singleGamepad[0]);
        });
        return allGamepadMocks;
    };
})(fluid);
