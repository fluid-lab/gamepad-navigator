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

    /* Changes are broken and just sent for review */
    $(document).ready(function () {

        fluid.registerNamespace("gamepad");
        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Bidirectional Scrolling Tests");

        jqUnit.test("Scroll horizontally", function () {
            jqUnit.expect(2);

            // Scroll the page to the top.
            $(window).scrollLeft(0);
            jqUnit.assertEquals("The vertical scroll position should be at the left of the webpage.", 0, $(window).scrollLeft());

            // To return a list of gamepad objects with no buttons/axes disturbed by default.
            var customWindowObject = new Object();
            customWindowObject.navigator = new Object();
            customWindowObject.navigator.getGamepads = gamepad.tests.utils.generateGamepadMock;

            // Confirm that the instance of the gamepad navigator is created.
            var test = gamepad.inputMapper({
                frequency: 900,
                windowObject: customWindowObject
            });
            jqUnit.assertTrue("The Gamepad Navigator should be instantiated.", fluid.isComponent(test));
        });
    });
})(fluid, jQuery);
