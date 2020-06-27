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

    fluid.registerNamespace("gamepad.tests.utils.unidirectional");
    fluid.registerNamespace("gamepad.tests.utils.bidirectional");

    /**
     *
     * Generates a mock for the unidirectional button tests for scroll. The inputButton
     * should be in the following format:
     *
     * inputButton = {
     *     "5": 0.75
     * }
     *
     * @param {Object} inputButtonsSpec - The buttons with their values.
     *
     * @return {Object} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.unidirectional.buttons = function (inputButtonsSpec) {
        var gamepadMock = [];
        if (gamepad.tests.windowObject.count > 0) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock({
                buttons: inputButtonsSpec
            });
            gamepad.tests.windowObject.count--;
        }
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for the unidirectional axes tests for scroll. The inputAxes
     * should be in the following format:
     *
     * inputAxes = {
     *     "1": 0.75
     * }
     *
     * @param {Object} inputAxesSpec - The axes with their values.
     *
     * @return {Object} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.unidirectional.axes = function (inputAxesSpec) {
        var gamepadMock = [];
        if (gamepad.tests.windowObject.count > 4) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock();
        }
        else if (gamepad.tests.windowObject.count > 0) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock({
                axes: inputAxesSpec
            });
        }
        gamepad.tests.windowObject.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for the bidirectional tests for scroll.
     *
     * @param {Number} inputAxes - The index number of the axes.
     *
     * @return {Object} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.bidirectional.oneAxis = function (inputAxes) {
        var gamepadMock = [],
            inputSpec = { axes: {} };
        if (gamepad.tests.windowObject.count === 10) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock();
        }
        else if (gamepad.tests.windowObject.count > 4) {
            // Scroll down.
            inputSpec.axes[inputAxes] = 1;
            gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);
        }
        else if (gamepad.tests.windowObject.count > 0) {
            // Scroll up.
            inputSpec.axes[inputAxes] = -1;
            gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);
        }
        gamepad.tests.windowObject.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for the bidirectional diagonal axes tests for scroll. The
     * inputAxes should be in the following format:
     *
     * inputAxes = {
     *     "0": 1
     *     "1": 0.75
     * }
     *
     * @param {Object} inputAxesSpec - The axes with their values.
     *
     * @return {Object} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.bidirectional.diagonalAxes = function (inputAxesSpec) {
        var gamepadMock = [];
        if (gamepad.tests.windowObject.count > 4) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock();
        }
        else if (gamepad.tests.windowObject.count > 0) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock({
                axes: inputAxesSpec
            });
        }
        gamepad.tests.windowObject.count--;
        return gamepadMock;
    };
})(fluid);
