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

        jqUnit.module("Gamepad Navigator Bidirectional Diagonal Scrolling Tests", {
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

        jqUnit.asyncTest("Scroll diagonally towards the bottom right", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": 1,
                    "1": 1
                });
            };

            // Initialize the webpage, i.e., scroll the page to the top-left corner.
            $(window).scrollTop(0);
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
            var towardsTopLeft = (window.scrollY === 0) && (window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be at the top-left of the webpage.", towardsTopLeft);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var scrolledBottomRight = (window.scrollY !== 0) && (window.scrollX !== 0);
                jqUnit.assertTrue("The page should have scrolled towards the bottom-right corner.", scrolledBottomRight);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll diagonally towards the bottom left", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": -1,
                    "1": 1
                });
            };

            // Initialize the webpage, i.e., scroll the page towards the top-right corner.
            $(window).scrollTop(0);
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
            var towardsTopRight = (window.scrollY === 0) && !(window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the top-right of the webpage.", towardsTopRight);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var scrolledBottomLeft = (window.scrollY > 0) && (window.scrollX < 400);
                jqUnit.assertTrue("The page should have scrolled towards the bottom-left corner.", scrolledBottomLeft);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll diagonally towards the top left", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": -1,
                    "1": -1
                });
            };

            // Initialize the webpage, i.e., scroll the page towards the bottom-right corner.
            $(window).scrollTop(400);
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
            var towardsBottomRight = !(window.scrollY === 0) && !(window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the bottom-right of the webpage.", towardsBottomRight);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var towardsTopLeft = (window.scrollY < 400) && (window.scrollX < 400);
                jqUnit.assertTrue("The page should have scrolled towards the top-left corner.", towardsTopLeft);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });

        jqUnit.asyncTest("Scroll diagonally towards the top right", function () {
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": 1,
                    "1": -1
                });
            };

            // Initialize the webpage, i.e., scroll the page towards the bottom-left corner.
            $(window).scrollTop(400);
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
            var towardsBottomLeft = !(window.scrollY === 0) && (window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the bottom-left of the webpage.", towardsBottomLeft);

            // Update the gamepad to tilt the axes for scrolling.
            gamepad.tests.navigator.pollGamepads();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                var towardsTopRight = (window.scrollY < 400) && (window.scrollX > 0);
                jqUnit.assertTrue("The page should have scrolled towards the top-right corner.", towardsTopRight);

                // Restore the gamepad back to its neutral state.
                gamepad.tests.navigator.pollGamepads();
                jqUnit.start();
            }, gamepad.tests.frequency * 3);
        });
    });
})(fluid, jQuery);
