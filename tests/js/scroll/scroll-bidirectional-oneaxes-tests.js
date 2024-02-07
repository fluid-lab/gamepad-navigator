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

        jqUnit.module("Gamepad Navigator Bidirectional One-axis Scrolling Tests");

        jqUnit.test("Scroll horizontally", function () {
            jqUnit.expect(3);

            // Initialize the webpage, i.e., scroll the page to the left.
            $(window).scrollLeft(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            jqUnit.assertEquals("The initial horizontal scroll position should not be changed.", 0, window.scrollX);

            // Update the gamepad to tilt the axes for scrolling.
            inputMapper.applier.change("axes.0", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the webpage to scroll.
            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertNotEquals("The page should have been scrolled towards the right.", 0, window.scrollX);
                var previousXCoordinate = window.scrollX;

                // Update the gamepad to tilt the axes in the opposite direction.
                inputMapper.applier.change("axes.0", 0);
                inputMapper.applier.change("axes.0", -1);

                // Return the current horizontal position of scroll for further testing.
                jqUnit.stop();

                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    jqUnit.start();

                    // Check if the webpage has scrolled towards the left.
                    jqUnit.assertNotEquals("The page should have been scrolled towards the left.", previousXCoordinate, window.scrollX);
                }, gamepad.tests.delayMs);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Scroll vertically", function () {
            jqUnit.expect(3);

            // Initialize the webpage, i.e., scroll the page to the top.
            $(window).scrollTop(0);

            var inputMapper = gamepad.tests.scroll.inputMapper();

            jqUnit.assertEquals("The initial vertical scroll position should not be changed.", 0, window.scrollY);

            // Update the gamepad to tilt the axes for scrolling.
            inputMapper.applier.change("axes.1", 1);

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertNotEquals("The page should have been scrolled down.", 0, window.scrollY);

                var previousYCoordinate = window.scrollY;

                // Update the gamepad to tilt the axes in the opposite direction.
                inputMapper.applier.change("axes.1", 0);
                inputMapper.applier.change("axes.1", -1);

                jqUnit.stop();

                // Wait for a few milliseconds for the webpage to scroll.
                setTimeout(function () {
                    jqUnit.start();

                    // Check if the webpage has scrolled up.
                    jqUnit.assertNotEquals("The page should have been scrolled up.", previousYCoordinate, window.scrollY);
                }, gamepad.tests.delayMs);
            }, gamepad.tests.delayMs);
        });
    });
})(fluid, jQuery);
