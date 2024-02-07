/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global gamepad */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.tests.utils");

    // TODO: This can probably be safely removed now.
    /**
     *
     * Returns a dummy gamepad input model which represents that no button/axes is
     * disturbed.
     *
     * @return {Object} - The gamepad input model (at rest).
     *
     */
    gamepad.tests.utils.initializeModelAtRest = function () {
        var modelAtRest = {
            connected: true,
            axes: {},
            buttons: {}
        };

        // Initialize in accordance with the 18 buttons on the PS4 controller.
        for (var buttonNumber = 0; buttonNumber < 18; buttonNumber++) {
            modelAtRest.buttons[buttonNumber] = 0;
        }

        // Initialize in accordance with the 4 axes on the PS4 controller.
        for (var axesNumber = 0; axesNumber < 4; axesNumber++) {
            modelAtRest.axes[axesNumber] = 0;
        }

        return modelAtRest;
    };
})(fluid);
