/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.configurationPanel.handleEvents");

    /**
     *
     * Handles switching between the next/previous configuration menus while tabbing.
     *
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.configurationPanel.handleEvents.switching = function (configurationMenu) {
        var scrollTimer = null;
        configurationMenu.scroll(function () {
            // Clear the timeout if the scrolling hasn't stopped while tabbing.
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }

            // Scroll the remaining width after the scrolling has stopped.
            scrollTimer = setTimeout(function () {
                var width = 600,
                    scrolledBy = configurationMenu[0].scrollLeft;
                configurationMenu[0].scrollBy((width - (scrolledBy % width)) % width, 0);
            }, 25);
        });
    };

    /**
     *
     * Displays only the relevant configuration options for each action after the
     * configuration panel is created.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.handleEvents.modifyDropdownMenu = function (that) {
        // Get the list of all configuration menus on the configuration panel.
        var inputMenusArray = document.querySelectorAll(".menu-item");

        /**
         * Set dropdown values to their default values and other configuration options
         * accordingly.
         */
        fluid.each(inputMenusArray, function (inputMenu) {
            if (fluid.isDOMNode(inputMenu)) {
                that.changeConfigMenuOptions(inputMenu.querySelector("select"));
            }
        });
    };

    /**
     *
     * Attaches listener to the action dropdowns to display only the relevant
     * configuration options according to the new action chosen by the user.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.handleEvents.listenDropdownChanges = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var actionDropdowns = document.querySelectorAll("select");

        // Attach change listener to all dropdown menus.
        fluid.each(actionDropdowns, function (actionDropdown) {
            if (fluid.isDOMNode(actionDropdown)) {
                actionDropdown.addEventListener("change", function (event) {
                    that.changeConfigMenuOptions(event.target);
                });
            }
        });
    };

    /**
     *
     * Displays only the relevant configuration options for the given dropdown according
     * to the chosen action (value of the dropdown).
     *
     * @param {Object} that - The configurationPanel component.
     * @param {Object} dropdownMenu - The input action dropdown menu of an input menu.
     *
     */
    gamepad.configurationPanel.handleEvents.changeConfigMenuOptions = function (that, dropdownMenu) {
        var selectedAction = $(dropdownMenu).val(),
            dropdownClassName = dropdownMenu.classList[0],
            currentInputMenuItems = document.getElementsByClassName(dropdownClassName);

        /**
         * Show speed factor input box and its label if selected option is applicable for
         * using speed factor. Othewise, hide the speed factor input box and label and
         * increase the input width.
         */
        if (that.options.actions.speedFactorOption.includes(selectedAction)) {
            currentInputMenuItems[2].style.display = "unset";
            currentInputMenuItems[3].style.display = "unset";

            // Disable the speed factor input box.
            currentInputMenuItems[3].removeAttribute("disabled");

            // Reduce the width of the action dropdown.
            dropdownMenu.style.width = "94%";
            dropdownMenu.style.gridColumn = "1/2";
        }
        else {
            currentInputMenuItems[2].style.display = "none";
            currentInputMenuItems[3].style.display = "none";

            // Reset the speed factor input box value.
            currentInputMenuItems[3].value = "1";

            // Remove the disabled attribute from the input box.
            currentInputMenuItems[3].setAttribute("disabled", "");

            // Increase the width of the action dropdown.
            dropdownMenu.style.width = "100%";
            dropdownMenu.style.gridColumn = "1/3";
        }

        /**
         * Show checkbox if selected option is applicable for opening tabs/windows in
         * background or is invertible. Otherwise, hide the checkboxes and their labels.
         */
        if (that.options.actions.backgroundOption.includes(selectedAction) || that.options.actions.invertOption.includes(selectedAction)) {
            currentInputMenuItems[4].style.display = "unset";
            currentInputMenuItems[5].style.display = "unset";

            // Disable the checkbox.
            currentInputMenuItems[5].removeAttribute("disabled");
        }
        else {
            currentInputMenuItems[4].style.display = "none";
            currentInputMenuItems[5].style.display = "none";

            // Reset the checkbox, i.e., uncheck it.
            currentInputMenuItems[5].checked = false;

            // Remove the disabled attribute from the checkbox.
            currentInputMenuItems[5].setAttribute("disabled", "");
        }
    };
})(fluid);
