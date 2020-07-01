/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, jqUnit, ally */

(function (fluid, $) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gamepad.tests");

        jqUnit.module("Gamepad Navigator Tab Navigation DOM Tests", {
            setup: function () {
                /**
                 * Get the list of tabbable elements in the order of their tabindex for
                 * verification.
                 */
                gamepad.tests.sortedTabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(gamepad.inputMapperUtils.tabindexSortFilter);
            }
        });

        jqUnit.test("Verify the first element in the tabbable elements list.", function () {
            jqUnit.expect(1);

            // Get the first element from the tabbable elements list.
            var firstTabbableElement = gamepad.tests.sortedTabbableElements[0],
                hasTabindexOne = firstTabbableElement.getAttribute("tabindex") === "1";

            jqUnit.assertTrue("The first element should have tabindex=\"1\"", hasTabindexOne);
        });

        jqUnit.test("Verify the last element in the tabbable elements list.", function () {
            jqUnit.expect(1);

            // Get the last element from the tabbable elements list.
            var lastTabbableElement = gamepad.tests.sortedTabbableElements[gamepad.tests.sortedTabbableElements.length - 1],
                isLastElement = lastTabbableElement.getAttribute("id") === "last";

            jqUnit.assertTrue("The first element should be the last div with id=\"last\"", isLastElement);
        });

        jqUnit.test("Verify presence and absence of elements according to their tabindex value.", function () {
            jqUnit.expect(2);

            // Check if the tabbable elements list contains elements with tabindex="-1".
            var elementWithNegativeTabindex = $("button[tabindex=\"-1\"]"),
                hasElementWithNegativeTabindex = gamepad.tests.sortedTabbableElements.includes(elementWithNegativeTabindex[0]);
            jqUnit.assertFalse("The sorted elements array should not contain elements with tabindex=\"-1\"", hasElementWithNegativeTabindex);

            // Check if the tabbable elements list contains elements with tabindex="0".
            var elementWithTabindexZero = $("div[tabindex=\"0\"]"),
                hasElementWithTabindexZero = gamepad.tests.sortedTabbableElements.includes(elementWithTabindexZero[0]);
            jqUnit.assertTrue("The sorted elements array should contain elements with tabindex=\"0\"", hasElementWithTabindexZero);
        });
    });
})(fluid, jQuery);
