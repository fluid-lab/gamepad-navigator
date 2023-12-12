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

        gamepad.tests.windowObject = window;
        gamepad.tests.delayMs = 250;

        jqUnit.module("Gamepad Navigator Unidirectional Button Scrolling Tests");

        jqUnit.test("Scroll down using button input", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page to the top.
            $(window).scrollTop(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            jqUnit.assertEquals("The initial vertical scroll position should not be changed.", 0, window.scrollY);

            // Update the gamepad to press button 13 for scrolling.
            inputMapper.applier.change("buttons.13", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the gamepad has scrolled down.
                jqUnit.assertNotEquals("The page should have scrolled down.", 0, window.scrollY);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll up using button input", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page towards the bottom.
            $(window).scrollTop(400);

            jqUnit.assertEquals("The initial vertical scroll position should not be changed.", 400, window.scrollY);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            // Update the gamepad to press button 12 for scrolling.
            inputMapper.applier.change("buttons.12", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the gamepad has scrolled up.
                var hasScrolledUp = window.scrollY < 400;
                jqUnit.assertTrue("The page should have scrolled up.", hasScrolledUp);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll right using button input", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page to the left.
            $(window).scrollLeft(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            jqUnit.assertEquals("The horizontal vertical scroll position should not be changed.", 0, window.scrollX);

            // Update the gamepad to press button 15 for scrolling.
            inputMapper.applier.change("buttons.15", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the gamepad has scrolled towards the right.
                jqUnit.assertNotEquals("The page should have scrolled right.", 0, window.scrollX);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll left using button input", function () {
            jqUnit.expect(2);

            // Initialize the webpage, i.e., scroll the page towards the right.
            $(window).scrollLeft(400);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            jqUnit.assertEquals("The horizontal vertical scroll position should not be changed.", 400, window.scrollX);

            // Update the gamepad to press button 14 for scrolling.
            inputMapper.applier.change("buttons.14", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                // Check if the gamepad has scrolled towards the left.
                var hasScrolledLeft = window.scrollX < 400;
                jqUnit.assertTrue("The page should have scrolled left.", hasScrolledLeft);
            }, gamepad.tests.delayMs);
        });
    });
})(fluid, jQuery);
