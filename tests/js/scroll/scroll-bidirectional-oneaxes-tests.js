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

(function (fluid, $) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gamepad");
        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Bidirectional One-axis Scrolling Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                gamepad.tests.frequency = 50;
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
                return gamepad.tests.utils.bidirectional.oneAxes(0, gamepad.tests.navigator);
            };

            // Initialize the webpage, i.e., scroll the page to the left.
            $(window).scrollLeft(0);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.tests.bidirectionalOneaxesTestsMapper({ frequency: gamepad.tests.frequency });
            gamepad.tests.utils.initialScrollTestChecks(gamepad.tests.navigator);
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
                    // Restore the gamepad back to its neutral state.
                    gamepad.tests.navigator.pollGamepads();

                    // Check if the webpage has scrolled towards the left.
                    jqUnit.assertNotEquals("The page should have been scrolled towards the left.", previousXCoordinate, window.scrollX);
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
                return gamepad.tests.utils.bidirectional.oneAxes(1, gamepad.tests.navigator);
            };

            // Initialize the webpage, i.e., scroll the page to the top.
            $(window).scrollTop(0);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.tests.bidirectionalOneaxesTestsMapper({ frequency: gamepad.tests.frequency });
            gamepad.tests.utils.initialScrollTestChecks(gamepad.tests.navigator);
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
                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    // Restore the gamepad back to its neutral state.
                    gamepad.tests.navigator.pollGamepads();

                    // Check if the webpage has scrolled up.
                    jqUnit.assertNotEquals("The page should have been scrolled up.", previousYCoordinate, window.scrollY);
                    jqUnit.start();
                }, gamepad.tests.frequency * 3);
            });
        });
    });
})(fluid, jQuery);
