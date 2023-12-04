/*
Copyright (c) 2023 The Gamepad Navigator Authors
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
    fluid.registerNamespace("gamepad.tests.utils.dropdown");
    fluid.registerNamespace("gamepad.tests.utils.element");

    // Custom gamepad navigator component grade for simple click tests.
    fluid.defaults("gamepad.tests.inputMapperForSimpleClickTests", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: gamepad.tests.windowObject,
        members: { count: 2 }
    });

    // Custom gamepad navigator component grade for select dropdown click tests.
    fluid.defaults("gamepad.tests.inputMapperForDropdownClickTests", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: gamepad.tests.windowObject,
        members: { count: 4 }
    });

    /**
     *
     * Generates a mock for the click tests for dropdown menus.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component (for select
     *                                         dropdown) under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.dropdown.click = function (inputButton, testNavigatorInstance) {
        var gamepadMock = null,
            inputSpec = { buttons: {} };

        // Initial count is set to 4 in all cases.
        if (testNavigatorInstance.count === 1 || testNavigatorInstance.count === 3) {
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
     * Generates a mock for the click tests for clickable elements other than dropdown
     * menus.
     *
     * @param {Object} inputButton - The index number of the button.
     *
     * @param {Object} testNavigatorInstance - The instance of the gamepad navigator's
     *                                         custom inputMapper component (for simple
     *                                         DOM elements) under test.
     *
     * @return {Array} - The mock of the gamepad.
     *
     */
    gamepad.tests.utils.element.click = function (inputButton, testNavigatorInstance) {
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
     * A helper function for the initial checks for click tests after first polling cycle.
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
        jqUnit.assertEquals("The focus should not have changed.", document.querySelector(elementQuery), document.activeElement);
    };
})(fluid);
