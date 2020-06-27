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

        // Define the required variables.
        gamepad.tests.windowObject = window;

        jqUnit.module("Gamepad Navigator Unidirectional Scrolling Tests");

        jqUnit.asyncTest("Scroll down using button input", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 2;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons({ "13": 1 });
            };
            $(window).scrollTop(0);
            jqUnit.assertEquals("The vertical scroll position should be at the top of the webpage.", 0, $(window).scrollTop());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling down.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalYPosition = $(window).scrollTop();
                jqUnit.assertNotEquals("The page should have scrolled down.", 0, finalYPosition);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll up using button input", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 2;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons({ "12": 1 });
            };
            $(window).scrollTop(400);
            jqUnit.assertNotEquals("The vertical scroll position should not be at the top of the webpage.", 0, $(window).scrollTop());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling up.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalYPosition = $(window).scrollTop();
                jqUnit.assertNotEquals("The page should have scrolled.", 400, finalYPosition);

                var hasScrolledUp = finalYPosition < 400 ? true : false;
                jqUnit.assertTrue("The page should have scrolled up.", hasScrolledUp);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll right using button input", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 2;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons({ "15": 1 });
            };
            $(window).scrollLeft(0);
            jqUnit.assertEquals("The horizontal scroll position should be at the left of the webpage.", 0, $(window).scrollLeft());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling right.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalXPosition = $(window).scrollLeft();
                jqUnit.assertNotEquals("The page should have scrolled right.", 0, finalXPosition);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll left using button input", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 2;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.buttons({ "14": 1 });
            };
            $(window).scrollLeft(300);
            jqUnit.assertNotEquals("The horizontal scroll position should not be at the left of the webpage.", 0, $(window).scrollLeft());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling left.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalXPosition = $(window).scrollLeft();
                jqUnit.assertNotEquals("The page should have scrolled.", 300, finalXPosition);

                var hasScrolledLeft = finalXPosition < 300 ? true : false;
                jqUnit.assertTrue("The page should have scrolled left.", hasScrolledLeft);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll down using axes input", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.axes({ "1": 1 });
            };
            $(window).scrollTop(0);
            jqUnit.assertEquals("The vertical scroll position should be at the top of the webpage.", 0, $(window).scrollTop());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling down.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalYPosition = $(window).scrollTop();
                jqUnit.assertNotEquals("The page should have scrolled down.", 0, finalYPosition);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll up using axes input", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.axes({ "1": -1 });
            };
            $(window).scrollTop(400);
            jqUnit.assertNotEquals("The vertical scroll position should not be at the top of the webpage.", 0, $(window).scrollTop());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling up.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalYPosition = $(window).scrollTop();
                jqUnit.assertNotEquals("The page should have scrolled.", 400, finalYPosition);

                var hasScrolledUp = finalYPosition < 400 ? true : false;
                jqUnit.assertTrue("The page should have scrolled up.", hasScrolledUp);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll right using axes input", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.axes({ "0": 1 });
            };
            $(window).scrollLeft(0);
            jqUnit.assertEquals("The vertical scroll position should be at the left of the webpage.", 0, $(window).scrollLeft());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling right.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalXPosition = $(window).scrollLeft();
                jqUnit.assertNotEquals("The page should have scrolled right.", 0, finalXPosition);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll left using axes input", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.unidirectional.axes({ "0": -1 });
            };;
            $(window).scrollLeft(400);
            jqUnit.assertNotEquals("The vertical scroll position should not be at the left of the webpage.", 0, $(window).scrollLeft());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling left.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var finalXPosition = $(window).scrollLeft();
                jqUnit.assertNotEquals("The page should have scrolled.", 400, finalXPosition);

                var hasScrolledLeft = finalXPosition < 400 ? true : false;
                jqUnit.assertTrue("The page should have scrolled left.", hasScrolledLeft);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });
    });
})(fluid, jQuery);
