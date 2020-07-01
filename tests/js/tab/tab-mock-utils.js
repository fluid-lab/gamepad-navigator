/*
Copyright (c) 2020 The Gamepad Navigator Authors
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

    fluid.registerNamespace("gamepad.tests.utils.buttons");
    fluid.registerNamespace("gamepad.tests.utils.axes");

    /**
     *
     * Generates a mock for one-time tab navigation in button tests.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.buttons.tab = function (inputButton) {
        var gamepadMock = null,
            inputSpec = { buttons: {} };

        // Initial count is set to 2 in all cases.
        if (gamepad.tests.count === 1) {
            inputSpec.buttons[inputButton] = 1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        gamepad.tests.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for forward tab navigation in axes tests.
     *
     * @param {Object} inputAxes - The index number of the axes.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.axes.forwardTab = function (inputAxes) {
        var gamepadMock = null,
            inputSpec = { axes: {} };

        // Initial count is set to 2 in all cases.
        if (gamepad.tests.count === 1) {
            inputSpec.axes[inputAxes] = 1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        gamepad.tests.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for reverse tab navigation in axes tests.
     *
     * @param {Object} inputAxes - The index number of the axes.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.axes.reverseTab = function (inputAxes) {
        var gamepadMock = null,
            inputSpec = { axes: {} };

        // Initial count is set to 2 in all cases.
        if (gamepad.tests.count === 1) {
            inputSpec.axes[inputAxes] = -1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        gamepad.tests.count--;
        return gamepadMock;
    };
})(fluid);
