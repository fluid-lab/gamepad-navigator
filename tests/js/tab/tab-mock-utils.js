/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, jqUnit */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.tests.utils.buttons");
    fluid.registerNamespace("gamepad.tests.utils.axes");

    // Custom gamepad navigator component grade for tab navigation tests.
    fluid.defaults("gamepad.tests.inputMapperForTabTests", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: gamepad.tests.windowObject,
        members: { count: 2 }
    });

    /**
     *
     * Generates a mock for one-time tab navigation in button tests.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.buttons.tab = function (inputButton, testNavigatorInstance) {
        var gamepadMock = null,
            inputSpec = { buttons: {} };

        // Initial count is set to 2 in all cases.
        if (testNavigatorInstance.count === 1) {
            inputSpec.buttons[inputButton] = 1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        testNavigatorInstance.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for forward tab navigation in axes tests.
     *
     * @param {Object} inputAxes - The index number of the axes.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.axes.forwardTab = function (inputAxes, testNavigatorInstance) {
        var gamepadMock = null,
            inputSpec = { axes: {} };

        // Initial count is set to 2 in all cases.
        if (testNavigatorInstance.count === 1) {
            inputSpec.axes[inputAxes] = 1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        testNavigatorInstance.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for reverse tab navigation in axes tests.
     *
     * @param {Object} inputAxes - The index number of the axes.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.axes.reverseTab = function (inputAxes, testNavigatorInstance) {
        var gamepadMock = null,
            inputSpec = { axes: {} };

        // Initial count is set to 2 in all cases.
        if (testNavigatorInstance.count === 1) {
            inputSpec.axes[inputAxes] = -1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        testNavigatorInstance.count--;
        return gamepadMock;
    };

    /**
     *
     * A helper function for the initial checks for tab navigation tests after first
     * polling cycle.
     *
     * @param {Object} elementQuery - The DOM element to be used for testing.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         inputMapper component under test.
     *
     */
    gamepad.tests.utils.initialClickTestChecks = function (elementQuery, testNavigatorInstance) {
        jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(testNavigatorInstance));
        var modelAtRest = gamepad.tests.utils.initializeModelAtRest();

        // Check the state of gamepad inputs and webpage after polling.
        gamepad.tests.navigator.pollGamepads();
        jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", modelAtRest, testNavigatorInstance.model);
        jqUnit.assertEquals("The focus should not be changed after polling.", document.querySelector(elementQuery), document.activeElement);
    };
})(fluid);
