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

        jqUnit.module("Gamepad Navigator Bidirectional One-axis Scrolling Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                gamepad.tests.count = 3;
                gamepad.tests.frequency = 50;

                // Make sure the gamepad should be connected with no buttons/axes disturbed initially.
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

        jqUnit.asyncTest("Scroll horizontally", function () {
            /*
             * Return a mock with value of Axes 0 set to 0 during the first call to the
             * function. Then return the value 1 during the second call and -1 during the
             * third call.
             */
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                // 0 in the arguments represent Axes 0.
                return gamepad.tests.utils.bidirectional.oneAxes(0);
            };

            // Initialize the webpage, i.e., scroll the page to the left.
            $(window).scrollLeft(0);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The initial horizontal scroll position should not be changed.", 0, window.scrollX);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // eslint-disable-next-line
            new Promise(function (resolve) {

                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    jqUnit.assertNotEquals("The page should have been scrolled towards the right.", 0, window.scrollX);

                    // Update the gamepad to tilt the axes in the opposite direction.
                    gamepad.tests.navigator.pollGamepads();

                    // Return the current horizontal position of scroll for further testing.
                    resolve(window.scrollX);
                }, gamepad.tests.frequency * 3);
            }).then(function (previousXCoordinate) {

                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    jqUnit.assertNotEquals("The page should have been scrolled towards the left.", previousXCoordinate, window.scrollX);

                    // Restore the gamepad back to its neutral state.
                    gamepad.tests.navigator.pollGamepads();
                    jqUnit.start();
                }, gamepad.tests.frequency * 3);
            });
        });

        jqUnit.asyncTest("Scroll vertically", function () {
            /*
             * Return a mock with value of Axes 1 set to 0 during the first call to the
             * function. Then return the value 1 during the second call and -1 during the
             * third call.
             */
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                // 1 in the arguments represent Axes 1.
                return gamepad.tests.utils.bidirectional.oneAxes(1);
            };

            // Initialize the webpage, i.e., scroll the page to the top.
            $(window).scrollTop(0);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The initial vertical scroll position should not be changed.", 0, window.scrollY);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // eslint-disable-next-line
            new Promise(function (resolve) {

                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    jqUnit.assertNotEquals("The page should have been scrolled down.", 0, window.scrollY);

                    // Update the gamepad to tilt the axes in the opposite direction.
                    gamepad.tests.navigator.pollGamepads();

                    // Return the current vertical position of scroll for further testing.
                    resolve(window.scrollY);
                }, gamepad.tests.frequency * 3);
            }).then(function (previousYCoordinate) {
                setTimeout(function () {

                    // Wait for a few milliseconds for the webpage to scroll.
                    jqUnit.assertNotEquals("The page should have been scrolled up.", previousYCoordinate, window.scrollY);

                    // Restore the gamepad back to its neutral state.
                    gamepad.tests.navigator.pollGamepads();
                    jqUnit.start();
                }, gamepad.tests.frequency * 3);
            });
        });
    });
})(fluid, jQuery);
