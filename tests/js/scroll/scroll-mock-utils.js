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

    fluid.registerNamespace("gamepad.tests.utils");
    fluid.registerNamespace("gamepad.tests.utils.unidirectional");
    fluid.registerNamespace("gamepad.tests.utils.bidirectional");

    // Custom gamepad navigator component grade for bidirectional one-axes tests.
    fluid.defaults("gamepad.tests.bidirectionalOneaxesTestsMapper", {
        gradeNames: ["gamepad.inputMapper"],
        windowObject: gamepad.tests.windowObject,
        members: { count: 3 }
    });

    // Custom gamepad navigator component grade for non-bidirectional one-axes tests.
    fluid.defaults("gamepad.tests.nonBidirectionalOneaxesTestsMapper", {
        gradeNames: ["gamepad.inputMapper"],
        windowObject: gamepad.tests.windowObject,
        members: { count: 2 }
    });

    /**
     *
     * Generates a mock for the unidirectional button tests for scroll.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component (for
     *                                         non-bidirectional tests) under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.unidirectional.buttons = function (inputButton, testNavigatorInstance) {
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
     * Generates a mock for the tests using axes for scroll. The inputAxes should be in
     * the following format:
     *
     * inputAxes = {
     *     "0": 1
     *     "1": 0.75
     * }
     *
     * @param {Object} inputAxesSpec - The axes with their values.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.mockFromAxes = function (inputAxesSpec, testNavigatorInstance) {
        // Return a list of gamepad objects with no buttons/axes disturbed (by default).
        var gamepadMock = null;

        // Initial count is set to 2 in all cases.
        if (testNavigatorInstance.count === 1) {
            gamepadMock = gamepad.tests.utils.generateGamepadMock({ axes: inputAxesSpec });
        }
        else {
            gamepadMock = gamepad.tests.utils.generateGamepadMock();
        }

        // Reduce the count on every call.
        testNavigatorInstance.count--;
        return gamepadMock;
    };

    /**
     *
     * Generates a mock for the bidirectional oneaxes tests for scroll.
     *
     * @param {Number} inputAxes - The index number of the axes.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component (for
     *                                         non-bidirectional tests) under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.bidirectional.oneAxes = function (inputAxes, testNavigatorInstance) {
        var inputSpec = { axes: {} };

        // Initial count is set to 3 in all cases.
        if (testNavigatorInstance.count === 2) {
            inputSpec.axes[inputAxes] = 1;
        }
        else if (testNavigatorInstance.count === 1) {
            inputSpec.axes[inputAxes] = -1;
        }

        // Return a list of gamepad objects (with no buttons/axes disturbed by default).
        var gamepadMock = gamepad.tests.utils.generateGamepadMock(inputSpec);

        // Reduce the count on every call.
        testNavigatorInstance.count--;
        return gamepadMock;
    };

    /**
     *
     * A helper function for the initial checks for scroll tests after first polling
     * cycle.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         inputMapper component under test.
     *
     */
    gamepad.tests.utils.initialScrollTestChecks = function (testNavigatorInstance) {
        jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(testNavigatorInstance));
        var modelAtRest = gamepad.tests.utils.initializeModelAtRest();

        // Check the state of gamepad inputs and webpage after polling.
        gamepad.tests.navigator.pollGamepads();
        jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", modelAtRest, testNavigatorInstance.model);
    };
})(fluid);
