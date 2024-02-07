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

        fluid.registerNamespace("gamepad.tests");

        gamepad.tests.delayMs = 250;

        jqUnit.module("Gamepad Navigator Button (Discrete) Tab Navigation Tests");

        jqUnit.test("Tab from the last element to the first in discrete forward tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the last element.
            $("#last").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to press button 5 (right bumper) for forward tab
             * navigation.
             */
            inputMapper.applier.change("buttons.5", 1);

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

        jqUnit.test("Tab from the first element to the last in discrete reverse tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to press button 4 (left bumper) for reverse tab
             * navigation.
             */
            inputMapper.applier.change("buttons.4", 1);

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

        jqUnit.test("Change the focus to the next element in discrete forward tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on the first element.
            $("#first").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to press button 5 (right bumper) for forward tab
             * navigation.
             */
            inputMapper.applier.change("buttons.5", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Check if the focus has moved to the next element.
                jqUnit.assertEquals("The focus should have moved to the second element.", document.querySelector("#second"), document.activeElement);
            }, gamepad.tests.delayMs);
        });

        jqUnit.test("Change the focus to the previous element in discrete reverse tabbing using buttons.", function () {
            jqUnit.expect(1);

            // Set initial conditions i.e., focus on some element in the middle.
            $("#fifth").focus();

            var inputMapper = gamepad.tests.tab.inputMapper();

            /**
             * Update the gamepad to press button 4 (right bumper) for reverse tab
             * navigation.
             */
            inputMapper.applier.change("buttons.4", 1);

            jqUnit.stop();

            // Wait for a few milliseconds for the navigator to change focus.
            setTimeout(function () {
                jqUnit.start();

                // Check if the focus has moved to the previous element.
                jqUnit.assertEquals("The focus should have moved to the fourth element.", document.querySelector("#fourth"), document.activeElement);
            }, gamepad.tests.delayMs);
        });
    });
})(fluid, jQuery);
