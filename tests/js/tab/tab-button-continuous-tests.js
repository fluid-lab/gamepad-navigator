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

        jqUnit.module("Gamepad Navigator Button (Continuous) Tab Navigation Tests");

        jqUnit.test("Change the focus to one of the next elements in continuous forward tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            // Record the state of focused elements before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to press button 5 (right bumper) for forward tab
             * navigation.
             */
            inputMapper.applier.change("buttons.5", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved in the forward direction.
                var hasTabbedForward = beforePollingFocusedElementTabIndex < afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved in the forward direction.", hasTabbedForward);
            }, gamepad.tests.frequency * 5);
        });

        jqUnit.test("Change the focus to one of the previous elements in continuous reverse tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on some element in the middle.
            $("#fifth").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            // Record the state of focused elements before polling.
            var beforePollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

            /**
             * Update the gamepad to press button 4 (right bumper) for reverse tab
             * navigation.
             */
            inputMapper.applier.change("buttons.4", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Record the index of the element currently focused.
                var afterPollingFocusedElementTabIndex = document.activeElement.getAttribute("tabindex");

                // Check if the focus has moved to the previous elements.
                var hasTabbedBackward = beforePollingFocusedElementTabIndex > afterPollingFocusedElementTabIndex;
                jqUnit.assertTrue("The focus should have moved to the previous elements in the order.", hasTabbedBackward);
            }, gamepad.tests.frequency * 5);
        });
    });
})(fluid, jQuery);
