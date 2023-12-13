/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global gamepad, jqUnit */

(function (fluid, $) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gamepad");
        fluid.registerNamespace("gamepad.tests");

        gamepad.tests.windowObject = window;
        gamepad.tests.delayMs = 250;

        jqUnit.module("Gamepad Navigator Bidirectional Diagonal Scrolling Tests");

        jqUnit.test("Scroll diagonally towards the bottom right", function () {
            jqUnit.expect(2);
            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": 1,
                    "1": 1
                }, inputMapper);
            };

            // Initialize the webpage, i.e., scroll the page to the top-left corner.
            $(window).scrollTop(0);
            $(window).scrollLeft(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();
            var towardsTopLeft = (window.scrollY === 0) && (window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be at the top-left of the webpage.", towardsTopLeft);

            // Update the gamepad to tilt the axes for scrolling.
            var transaction = inputMapper.applier.initiate();
            transaction.fireChangeRequest({ path: "axes.0", value: 1});
            transaction.fireChangeRequest({ path: "axes.1", value: 1});
            transaction.commit();

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the webpage has scrolled towards the bottom-right corner.
                var scrolledBottomRight = (window.scrollY !== 0) && (window.scrollX !== 0);
                jqUnit.assertTrue("The page should have scrolled towards the bottom-right corner.", scrolledBottomRight);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll diagonally towards the bottom left", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page towards the top-right corner.
            $(window).scrollTop(0);
            $(window).scrollLeft(400);

            var inputMapper = gamepad.tests.scroll.inputMapper();
            var towardsTopRight = (window.scrollY === 0) && !(window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the top-right of the webpage.", towardsTopRight);

            // Update the gamepad to tilt the axes for scrolling.
            var transaction = inputMapper.applier.initiate();
            transaction.fireChangeRequest({ path: "axes.0", value: -1});
            transaction.fireChangeRequest({ path: "axes.1", value: 1});
            transaction.commit();

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the webpage has scrolled towards the bottom-left corner.
                var scrolledBottomLeft = (window.scrollY > 0) && (window.scrollX < 400);
                jqUnit.assertTrue("The page should have scrolled towards the bottom-left corner.", scrolledBottomLeft);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll diagonally towards the top left", function () {
            jqUnit.expect(2);

            gamepad.tests.windowObject.navigator.getGamepads = function () {
                return gamepad.tests.utils.mockFromAxes({
                    "0": -1,
                    "1": -1
                }, inputMapper);
            };

            // Initialize the webpage, i.e., scroll the page towards the bottom-right corner.
            $(window).scrollTop(400);
            $(window).scrollLeft(400);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            var towardsBottomRight = !(window.scrollY === 0) && !(window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the bottom-right of the webpage.", towardsBottomRight);

            // Update the gamepad to tilt the axes for scrolling.
            var transaction = inputMapper.applier.initiate();
            transaction.fireChangeRequest({ path: "axes.0", value: -1});
            transaction.fireChangeRequest({ path: "axes.1", value: -1});
            transaction.commit();

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the webpage has scrolled towards the top-left corner.
                var towardsTopLeft = (window.scrollY < 400) && (window.scrollX < 400);
                jqUnit.assertTrue("The page should have scrolled towards the top-left corner.", towardsTopLeft);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll diagonally towards the top right", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page towards the bottom-left corner.
            $(window).scrollTop(400);
            $(window).scrollLeft(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            var towardsBottomLeft = !(window.scrollY === 0) && (window.scrollX === 0);
            jqUnit.assertTrue("The scroll position should be towards the bottom-left of the webpage.", towardsBottomLeft);

            // Update the gamepad to tilt the axes for scrolling.
            var transaction = inputMapper.applier.initiate();
            transaction.fireChangeRequest({ path: "axes.0", value: 1});
            transaction.fireChangeRequest({ path: "axes.1", value: -1});
            transaction.commit();

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the webpage has scrolled towards the top-right corner.
                var towardsTopRight = (window.scrollY < 400) && (window.scrollX > 0);
                jqUnit.assertTrue("The page should have scrolled towards the top-right corner.", towardsTopRight);
            }, gamepad.tests.delayMs);
        });
    });
})(fluid, jQuery);
