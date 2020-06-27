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
        gamepad.tests.frequency = 50;

        jqUnit.module("Gamepad Navigator Bidirectional Scrolling Tests");

        jqUnit.asyncTest("Scroll horizontally", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 10;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.oneAxis(0);
            };
            $(window).scrollLeft(0);
            jqUnit.assertEquals("The vertical scroll position should be at the left of the webpage.", 0, $(window).scrollLeft());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling horizontally.
            testNavigator.events.onGamepadConnected.fire();
            var xPosition = null;
            gamepad.tests.intervalLoop = setInterval(function () {
                if (gamepad.tests.windowObject.count === 4) {
                    xPosition = $(window).scrollLeft();
                    jqUnit.assertNotEquals("The page should have scrolled right.", 0, xPosition);
                }
                else if (gamepad.tests.windowObject.count === 0) {
                    var isScrolledLeft = $(window).scrollLeft() < xPosition ? true : false;
                    jqUnit.assertTrue("The page should have scrolled left.", isScrolledLeft);

                    testNavigator.events.onGamepadDisconnected.fire();
                    clearInterval(gamepad.tests.intervalLoop);
                    testNavigator.destroy();
                    jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                    jqUnit.start();
                }
            }, gamepad.tests.frequency);
        });

        jqUnit.asyncTest("Scroll vertically", function () {
            jqUnit.expect(5);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 10;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.oneAxis(1);
            };
            $(window).scrollTop(0);
            jqUnit.assertEquals("The vertical scroll position should be at the top of the webpage.", 0, $(window).scrollTop());

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling vertically.
            testNavigator.events.onGamepadConnected.fire();
            var yPosition = null;
            gamepad.tests.intervalLoop = setInterval(function () {
                if (gamepad.tests.windowObject.count === 4) {
                    yPosition = $(window).scrollTop();
                    jqUnit.assertNotEquals("The page should have scrolled down.", 0, yPosition);
                }
                else if (gamepad.tests.windowObject.count === 0) {
                    var isScrolledUp = $(window).scrollTop() < yPosition ? true : false;
                    jqUnit.assertTrue("The page should have scrolled up.", isScrolledUp);

                    testNavigator.events.onGamepadDisconnected.fire();
                    clearInterval(gamepad.tests.intervalLoop);
                    testNavigator.destroy();
                    jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                    jqUnit.start();
                }
            }, gamepad.tests.frequency);
        });

        jqUnit.asyncTest("Scroll diagonally towards the bottom right", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.diagonalAxes({
                    "0": 1,
                    "1": 1
                });
            };
            $(window).scrollTop(0);
            $(window).scrollLeft(0);
            var isTopLeft = ($(window).scrollTop() === 0) && ($(window).scrollLeft() === 0);
            jqUnit.assertTrue("The scroll position should be at the top-left of the webpage.", isTopLeft);

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling towards bottom-right corner.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var hasScrolledTowardsBottomRight = ($(window).scrollTop() > 0) && ($(window).scrollLeft() > 0);
                jqUnit.assertTrue("The scroll position should be towards the bottom-right corner of the webpage.", hasScrolledTowardsBottomRight);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll diagonally towards the bottom left", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.diagonalAxes({
                    "0": -1,
                    "1": 1
                });
            };
            $(window).scrollTop(0);
            $(window).scrollLeft(400);
            var isTopRight = ($(window).scrollTop() === 0) && !($(window).scrollLeft() === 0);
            jqUnit.assertTrue("The scroll position should be at the top-right of the webpage.", isTopRight);

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling towards bottom-left corner.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var hasScrolledTowardsBottomLeft = ($(window).scrollTop() > 0) && ($(window).scrollLeft() < 400);
                jqUnit.assertTrue("The scroll position should be towards the bottom-right corner of the webpage.", hasScrolledTowardsBottomLeft);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll diagonally towards the top left", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.diagonalAxes({
                    "0": -1,
                    "1": -1
                });
            };
            $(window).scrollTop(400);
            $(window).scrollLeft(400);
            var isNotAtTopLeft = !($(window).scrollTop() === 0) && !($(window).scrollLeft() === 0);
            jqUnit.assertTrue("The scroll position should not be at the top-left of the webpage.", isNotAtTopLeft);

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling towards top-left corner.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var hasScrolledTowardsTopLeft = ($(window).scrollTop() < 400) && ($(window).scrollLeft() < 400);
                jqUnit.assertTrue("The scroll position should be towards the bottom-right corner of the webpage.", hasScrolledTowardsTopLeft);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });

        jqUnit.asyncTest("Scroll diagonally towards the top right", function () {
            jqUnit.expect(4);

            // No of times the gamepad mock should be returned.
            gamepad.tests.windowObject.count = 5;
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.bidirectional.diagonalAxes({
                    "0": 1,
                    "1": -1
                });
            };
            $(window).scrollTop(400);
            $(window).scrollLeft(0);
            var isNotAtTopRight = !($(window).scrollTop() === 0) && ($(window).scrollLeft() === 0);
            jqUnit.assertTrue("The scroll position should not be at the top-right corner of the webpage.", isNotAtTopRight);

            var testNavigator = gamepad.inputMapper({
                windowObject: gamepad.tests.windowObject,
                frequency: gamepad.tests.frequency
            });
            jqUnit.assertValue("The Gamepad Navigator should be instantiated.", testNavigator);

            // Trigger gamepadconnected event and start scrolling towards top-right corner.
            testNavigator.events.onGamepadConnected.fire();
            setTimeout(function () {
                // Trigger gamepaddisconnected event and stop scrolling the webpage.
                testNavigator.events.onGamepadDisconnected.fire();
                var hasScrolledTowardsTopRight = ($(window).scrollTop() < 400) && ($(window).scrollLeft() > 0);
                jqUnit.assertTrue("The scroll position should be towards the top-right of the webpage.", hasScrolledTowardsTopRight);

                testNavigator.destroy();
                jqUnit.assertTrue("The instance of the gamepad navigator should be destroyed.", fluid.isDestroyed(testNavigator));
                jqUnit.start();
            }, 200);
        });
    });
})(fluid, jQuery);
