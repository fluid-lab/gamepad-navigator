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

(function (fluid, $) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gamepad");
        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Dropdown Click Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                gamepad.tests.count = 4;

                // To test the gamepad's initial state.
                gamepad.tests.modelAtRest = {
                    connected: true,
                    axes: {},
                    buttons: {}
                };

                // Initialize in accordance with the 18 buttons on the PS4 controller.
                for (var buttonNumber = 0; buttonNumber < 18; buttonNumber++) {
                    gamepad.tests.modelAtRest.buttons[buttonNumber] = 0;
                }

                // Initialize in accordance with the 4 axes on the PS4 controller.
                for (var axesNumber = 0; axesNumber < 4; axesNumber++) {
                    gamepad.tests.modelAtRest.axes[axesNumber] = 0;
                }

                jqUnit.expect(6);
            },
            teardown: function () {
                // Destroy the component and verify it.
                gamepad.tests.navigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(gamepad.tests.navigator));
            }
        });

        jqUnit.test("Short dropdowns expand to their original length on click.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.dropdown.click(0);
            };

            // Initialize the webpage, i.e., focus on the short dropdown.
            $("#dropdown-short").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not have changed.", document.querySelector("#dropdown-short"), document.activeElement);

            // Update the gamepad to click on the short dropdown.
            gamepad.tests.navigator.pollGamepads();
            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();

            // Check if the dropdown has expanded.
            jqUnit.assertEquals("The short dropdown should have expanded to its original length.", "5", document.activeElement.getAttribute("size"));

            // Update the gamepad to click on the short dropdown.
            gamepad.tests.navigator.pollGamepads();
            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();

            // Check if the dropdown has closed.
            jqUnit.assertEquals("The short dropdown should have closed.", "1", document.activeElement.getAttribute("size"));
        });

        jqUnit.test("Long dropdowns expand to the first 15 options on click.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.dropdown.click(0);
            };

            // Initialize the webpage, i.e., focus on the long dropdown.
            $("#dropdown-long").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not have changed.", document.querySelector("#dropdown-long"), document.activeElement);

            // Update the gamepad to click on the long dropdown.
            gamepad.tests.navigator.pollGamepads();
            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();

            // Check if the dropdown has expanded.
            jqUnit.assertEquals("The long dropdown should have expanded to display the first 15 options.", "15", document.activeElement.getAttribute("size"));

            // Update the gamepad to click on the long dropdown.
            gamepad.tests.navigator.pollGamepads();
            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();

            // Check if the dropdown has closed.
            jqUnit.assertEquals("The short dropdown should have closed.", "1", document.activeElement.getAttribute("size"));
        });
    });
})(fluid, jQuery);
