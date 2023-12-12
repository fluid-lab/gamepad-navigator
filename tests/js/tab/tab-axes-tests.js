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

        fluid.registerNamespace("gamepad.tests");

        gamepad.tests.delayMs = 250;

        jqUnit.module("Gamepad Navigator Axes Tab Navigation Tests");

        jqUnit.test("Tab from the last element to the first in forward tabbing using axes.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the last element.
            $("#last").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to tilt axes 2 in the right direction for forward tab
             * navigation.
             */
            inputMapper.applier.change("axes.2", 1);

            jqUnit.stop();

            /**
             * Wait for a few milliseconds for the navigator to focus.
             *
             * This is a race condition as the tab navigation is asynchronous and uses
             * setInterval for continuous tabbing when button is pressed but not released.
             */
            setTimeout(function () {
                jqUnit.start();

                // Check if the first element is focused.
                jqUnit.assertEquals("The first element (with tabindex=1) should be focused.", document.querySelector("#first"), document.activeElement);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Tab from the first element to the last in reverse tabbing using axes.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to tilt axes 2 in the left direction for reverse tab
             * navigation.
             */
            inputMapper.applier.change("axes.2", -1);

            jqUnit.stop();

            /**
             * Wait for a few milliseconds for the navigator to focus.
             *
             * This is a race condition as the tab navigation is asynchronous and uses
             * setInterval for continuous tabbing when button is pressed but not released.
             */
            setTimeout(function () {
                jqUnit.start();

                // Check if the last element is focused.
                jqUnit.assertEquals("The last element should be focused.", document.querySelector("#last"), document.activeElement);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Change the focus to one of the next elements in forward tabbing using axes.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            // Record the tabindex of the focused elements before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to tilt axes 2 in the right direction for forward tab
             * navigation.
             */
            inputMapper.applier.change("axes.2", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved to one of the next elements.
                var hasTabbedForward = beforePollingFocusedElementTabIndex < afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved to the next elements in the order.", hasTabbedForward);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Change the focus to one of the previous elements in reverse tabbing using axes.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on some element in the middle.
            $("#fifth").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            // Record the tabindex of the focused element before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to tilt axes 2 in the left direction for reverse tab
             * navigation.
             */
            inputMapper.applier.change("axes.2", -1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved to one of the previous elements.
                var hasTabbedBackward = beforePollingFocusedElementTabIndex > afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved to the previous elements in the order.", hasTabbedBackward);
            }, gamepad.tests.delayMs);
        });
    });
})(fluid, jQuery);
