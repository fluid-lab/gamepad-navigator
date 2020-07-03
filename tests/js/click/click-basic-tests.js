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

        jqUnit.module("Gamepad Navigator Basic Click Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                jqUnit.expect(5);
            },
            teardown: function () {
                // Destroy the component and verify it.
                gamepad.tests.navigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(gamepad.tests.navigator));
            }
        });

        jqUnit.test("Buttons can be clicked.", function () {
            // Set the initial conditions and requirements.
            document.querySelector("button").addEventListener("click", function () {
                var button = document.querySelector("button"),
                    timesClicked = button.getAttribute("timesClicked") || "0";
                button.setAttribute("timesClicked", parseInt(timesClicked) + 1);
            });
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.element.click(0, gamepad.tests.navigator);
            };

            // Initialize the webpage, i.e., focus on the button element.
            $("button").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.tests.inputMapperForSimpleClickTests();
            gamepad.tests.utils.initialClickTestChecks("button", gamepad.tests.navigator);

            // Update the gamepad to click on the button element.
            gamepad.tests.navigator.pollGamepads();

            // Check if the button has been clicked.
            jqUnit.assertEquals("The button should have been clicked.", "1", document.querySelector("button").getAttribute("timesClicked"));

            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();
        });

        jqUnit.test("Radio buttons can be selected by click.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.element.click(0, gamepad.tests.navigator);
            };

            // Initialize the webpage, i.e., focus on the radio button.
            $("#radio-one").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.tests.inputMapperForSimpleClickTests();
            gamepad.tests.utils.initialClickTestChecks("#radio-one", gamepad.tests.navigator);

            // Update the gamepad to click on the radio button.
            gamepad.tests.navigator.pollGamepads();

            // Check if the radio button has been clicked.
            jqUnit.assertTrue("The radio button should have been selected after clicking.", document.querySelector("#radio-one").checked);

            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();
        });

        jqUnit.test("Checkboxes can be selected by click.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.element.click(0, gamepad.tests.navigator);
            };

            // Initialize the webpage, i.e., focus on the checkbox element.
            $("#checkbox-one").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.tests.inputMapperForSimpleClickTests();
            gamepad.tests.utils.initialClickTestChecks("#checkbox-one", gamepad.tests.navigator);

            // Update the gamepad to click on the checkbox element.
            gamepad.tests.navigator.pollGamepads();

            // Verify if the checkbox element has been clicked.
            jqUnit.assertTrue("The radio button should have been selected after clicking.", document.querySelector("#checkbox-one").checked);

            // Restore the gamepad back to its neutral state i.e., release the button.
            gamepad.tests.navigator.pollGamepads();
        });
    });
})(fluid, jQuery);
