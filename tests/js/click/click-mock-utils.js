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

    fluid.registerNamespace("gamepad.tests.utils");
    fluid.registerNamespace("gamepad.tests.utils.dropdown");
    fluid.registerNamespace("gamepad.tests.utils.element");

    /**
     *
     * Generates a mock for the unidirectional button tests for scroll.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.dropdown.click = function (inputButton) {
        var gamepadMock = null,
            inputSpec = { buttons: {} };

        // Initial count is set to 2 in all cases.
        if (gamepad.tests.count === 1 || gamepad.tests.count === 3) {
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
     * Generates a mock for the unidirectional button tests for scroll.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.element.click = function (inputButton) {
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
})(fluid);
