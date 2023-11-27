/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

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
    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.bindings");

    /*

        "Action options", which represent the action to be performed in bindings and in internal calls between functions.

        @typedef {Object} ActionOptions
        @property {String} action - The name of the action.
        @property {Boolean} [invert] - Whether to invert the direction of motion (for actions that have a direction, like scrolling).
        @property {Number} [repeat] - For actions that support continuous operation, how many seconds to wait before repeating the action if the same control is still depressed.
        @property {Number} [speed] - How far to navigate in a single action.
        @property {Boolean} [background] - For new windows/tabs, whether to open in the background.
        @property {String} [key] - For `sendKey`, the key to send.

    */

    gamepad.bindings.defaults = {
        buttons: {
            // Cross on PS controller, A on Xbox
            0: {
                action: "click"
            },

            // Circle on PS controller, B on Xbox.
            // TODO: Make this work only in modals.
            1: {
                action: "sendKey",
                key: "Escape"
            },

            // Left Bumper.
            "4": {
                action: "reverseTab",
                repeat: 1,
                speed: 2.5
            },
            // Right Bumper.
            "5": {
                action: "forwardTab",
                repeat: 1,
                speed: 2.5
            },

            // Select button.
            8: {
                action: "openSearchKeyboard"
            },

            // Start button.
            9: {
                action: "openActionLauncher"
            },

            // D-pad.
            // Up.
            12: {
                action: "sendKey",
                key: "ArrowUp",
                repeat: 1,
                speed: 1
            },
            // Down
            13: {
                action: "sendKey",
                key: "ArrowDown",
                repeat: 1,
                speed: 1
            },
            // Left
            14: {
                action: "sendKey",
                key: "ArrowLeft",
                repeat: 1,
                speedFactor: 1
            },
            // Right.
            15: {
                action: "sendKey",
                key: "ArrowRight",
                repeat: 1,
                speed: 1
            },

            // "Badge" button.
            16: {
                action: "openConfigPanel"
            }
        },
        axes: {
            // Left thumbstick horizontal axis.
            "0": {
                action: "scrollHorizontally",
                repeat: 1,
                speed: 1,
                invert: false
            },
            // Left thumbstick vertical axis.
            "1": {
                action: "scrollVertically",
                repeat: 1,
                speed: 1,
                invert: false
            }
        }
    };
})(fluid);
