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

        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Axes Tab Navigation Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                gamepad.tests.count = 2;
                gamepad.tests.frequency = 50;

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

                jqUnit.expect(5);
            },
            teardown: function () {
                // Destroy the component and verify it.
                gamepad.tests.navigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(gamepad.tests.navigator));
            }
        });

        jqUnit.asyncTest("Tab from the last element to the first in forward tabbing using axes.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.axes.forwardTab(2);
            };

            // Set initial conditions i.e., focus on the last element.
            $("#last").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not be changed after polling.", document.querySelector("#last"), document.activeElement);

            /**
             * Update the gamepad to tilt axes 2 in the right direction for forward tab
             * navigation.
             */
            gamepad.tests.navigator.pollGamepads();

            /**
             * Wait for a few milliseconds for the navigator to focus.
             *
             * This is a race condition as the tab navigation is asynchronous and uses
             * setInterval for continuous tabbing when button is pressed but not released.
             */
            setTimeout(function () {
                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();

                // Check if the first element is focused.
                jqUnit.assertEquals("The first element (with tabindex=1) should be focused.", document.querySelector("#first"), document.activeElement);
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Tab from the first element to the last in reverse tabbing using axes.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.axes.reverseTab(2);
            };

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not be changed after polling.", document.querySelector("#first"), document.activeElement);

            /**
             * Update the gamepad to tilt axes 2 in the left direction for reverse tab
             * navigation.
             */
            gamepad.tests.navigator.pollGamepads();

            /**
             * Wait for a few milliseconds for the navigator to focus.
             *
             * This is a race condition as the tab navigation is asynchronous and uses
             * setInterval for continuous tabbing when button is pressed but not released.
             */
            setTimeout(function () {
                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();

                // Check if the last element is focused.
                jqUnit.assertEquals("The last element should be focused.", document.querySelector("#last"), document.activeElement);
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Change the focus to one of the next elements in forward tabbing using axes.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.axes.forwardTab(2);
            };

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not be changed after polling.", document.querySelector("#first"), document.activeElement);

            // Record the tabindex of the focused elements before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to tilt axes 2 in the right direction for forward tab
             * navigation.
             */
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved to one of the next elements.
                var hasTabbedForward = beforePollingFocusedElementTabIndex < afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved to the next elements in the order.", hasTabbedForward);
                jqUnit.start();
            }, gamepad.tests.frequency * 4);
        });

        jqUnit.asyncTest("Change the focus to one of the previous elements in reverse tabbing using axes.", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.axes.reverseTab(2);
            };

            // Set initial conditions i.e., focus on some element in the middle.
            $("#fifth").focus();

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The focus should not be changed after polling.", document.querySelector("#fifth"), document.activeElement);

            // Record the tabindex of the focused element before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to tilt axes 2 in the left direction for reverse tab
             * navigation.
             */
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved to one of the previous elements.
                var hasTabbedBackward = beforePollingFocusedElementTabIndex > afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved to the previous elements in the order.", hasTabbedBackward);
                jqUnit.start();
            }, gamepad.tests.frequency * 4);
        });
    });
})(fluid, jQuery);
