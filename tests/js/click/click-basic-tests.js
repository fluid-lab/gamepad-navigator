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

    /**
     * TODO: Add tests for links and other elements that involve navigation
     * between pages.
     */

    $(document).ready(function () {

        fluid.registerNamespace("gamepad");
        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Basic Click Tests");

        jqUnit.test("Buttons can be clicked.", function () {
            jqUnit.expect(1);

            // Set the initial conditions and requirements.
            document.querySelector("button").addEventListener("click", function () {
                var button = document.querySelector("button"),
                    timesClicked = button.getAttribute("timesClicked") || "0";
                button.setAttribute("timesClicked", parseInt(timesClicked) + 1);
            });

            // Initialize the webpage, i.e., focus on the button element.
            $("button").focus();

            var inputMapper = gamepad.tests.click.inputMapper();

            // Update the gamepad to click on the button element.
            inputMapper.applier.change("buttons.0", 1);

            // Check if the button has been clicked.
            jqUnit.assertEquals("The button should have been clicked.", "1", document.querySelector("button").getAttribute("timesClicked"));
        });

        jqUnit.test("Radio buttons can be selected by click.", function () {
            jqUnit.expect(1);

            // Initialize the webpage, i.e., focus on the radio button.
            $("#radio-one").focus();

            var inputMapper = gamepad.tests.click.inputMapper();

            // Update the gamepad to click on the radio button.
            inputMapper.applier.change("buttons.0", 1);

            // Check if the radio button has been clicked.
            jqUnit.assertTrue("The radio button should have been selected after clicking.", document.querySelector("#radio-one").checked);
        });

        jqUnit.test("Checkboxes can be selected by click.", function () {
            jqUnit.expect(1);

            // Initialize the webpage, i.e., focus on the checkbox element.
            $("#checkbox-one").focus();

            var inputMapper = gamepad.tests.click.inputMapper();

            // Update the gamepad to click on the checkbox element.
            inputMapper.applier.change("buttons.0", 1);

            // Verify if the checkbox element has been clicked.
            jqUnit.assertTrue("The radio button should have been selected after clicking.", document.querySelector("#checkbox-one").checked);
        });
    });
})(fluid, jQuery);
