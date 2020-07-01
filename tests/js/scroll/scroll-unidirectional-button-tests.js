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

        jqUnit.module("Gamepad Navigator Unidirectional Button Scrolling Tests", {
            setup: function () {
                gamepad.tests.windowObject = window;
                gamepad.tests.count = 2;
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

                jqUnit.expect(5);
            },
            teardown: function () {
                // Destroy the component and verify it.
                gamepad.tests.navigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(gamepad.tests.navigator));
            }
        });

        jqUnit.asyncTest("Scroll down using button input", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons(13);
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

            // Update the gamepad to press button 13 for for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.assertNotEquals("The page should have scrolled down.", 0, window.scrollY);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll up using button input", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons(12);
            };

            // Initialize the webpage, i.e., scroll the page towards the bottom.
            $(window).scrollTop(400);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The initial vertical scroll position should not be changed.", 400, window.scrollY);

            // Update the gamepad to press button 12 for for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var hasScrolledUp = window.scrollY < 400;
                jqUnit.assertTrue("The page should have scrolled up.", hasScrolledUp);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll right using button input", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons(15);
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
            jqUnit.assertEquals("The horizontal vertical scroll position should not be changed.", 0, window.scrollX);

            // Update the gamepad to press button 15 for for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.assertNotEquals("The page should have scrolled right.", 0, window.scrollX);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll left using button input", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons(14);
            };

            // Initialize the webpage, i.e., scroll the page towards the right.
            $(window).scrollLeft(400);

            // Confirm that the instance of the gamepad navigator is created.
            gamepad.tests.navigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(gamepad.tests.navigator));

            // Check the state of gamepad inputs and webpage after polling.
            gamepad.tests.navigator.pollGamepads();
            jqUnit.assertLeftHand("The gamepad should be connected with no buttons/axes disturbed initially.", gamepad.tests.modelAtRest, gamepad.tests.navigator.model);
            jqUnit.assertEquals("The horizontal vertical scroll position should not be changed.", 400, window.scrollX);

            // Update the gamepad to press button 14 for for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var hasScrolledLeft = window.scrollX < 400;
                jqUnit.assertTrue("The page should have scrolled left.", hasScrolledLeft);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });
    });
})(fluid, jQuery);
