/*
Copyright (c) 2023 The Gamepad Navigator Authors
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
     * Handles switching between the various inputs' configuration menu.
     *
     * @param {Object} inputList - The jQuery selector of the input name menu.
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.configurationPanel.handleEvents.switchMenu = function (inputList, configurationMenu) {
        inputList = inputList[0];
        configurationMenu = configurationMenu[0];

        // Attach listener to the input dropdown.
        inputList.addEventListener("change", function (event) {
            var inputMenuClassName = event.target.value,
                inputMenus = configurationMenu.querySelectorAll(".menu-item");

            // Hide the currently visible configuration menus.
            fluid.find(inputMenus, function (inputMenu) {
                if (fluid.isDOMNode(inputMenu) && inputMenu.style.display !== "none") {
                    inputMenu.style.display = "none";
                    return true;
                }
            });

            // Display the input configuration menu according to the selected option.
            var currentInputMenu = configurationMenu.getElementsByClassName(inputMenuClassName)[0];
            currentInputMenu.style.display = "grid";
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
    gamepad.configurationPanel.handleEvents.modifyActionDropdownMenu = function (that) {
        // Get the list of all configuration menus on the configuration panel.
        var inputMenusArray = document.querySelectorAll(".menu-item");

        /**
         * Set dropdown values to their default values and other configuration options
         * accordingly.
         */
        fluid.each(inputMenusArray, function (inputMenu) {
            if (fluid.isDOMNode(inputMenu)) {
                that.changeConfigMenuOptions(inputMenu.querySelector(".action-dropdown"));
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
    gamepad.configurationPanel.handleEvents.listenActionDropdownChanges = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var actionDropdowns = document.querySelectorAll(".action-dropdown");

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
     * TODO: Make another sub-component managing the mapping for one control, its
     * visibility, and settings and relay them into the parent component.
     * Refer:
     * https://github.com/fluid-lab/gamepad-navigator/issues/40
     */

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
        /**
         * TODO: Use viewComponent infrastructure instead of the class selectors.
         * Refer:
         * https://github.com/fluid-lab/gamepad-navigator/issues/40
         */
        var selectedAction = $(dropdownMenu).val(),
            dropdownClassName = dropdownMenu.classList[1],
            currentInputMenuItems = document.getElementsByClassName(dropdownClassName);

        /**
         * Show speed factor input box and its label if selected option is applicable for
         * using speed factor. Othewise, hide the speed factor input box and label and
         * increase the input width.
         */
        if (that.options.actions.speedFactorOption.includes(selectedAction)) {
            currentInputMenuItems[2].classList.remove("hidden");
            currentInputMenuItems[3].classList.remove("hidden");

            // Disable the speed factor input box.
            currentInputMenuItems[3].removeAttribute("disabled");

            // Reduce the width of the action dropdown.
            dropdownMenu.classList.add("reduced");
        }
        else {
            currentInputMenuItems[2].classList.add("hidden");
            currentInputMenuItems[3].classList.add("hidden");

            // Reset the speed factor input box value.
            currentInputMenuItems[3].value = "1";

            // Remove the disabled attribute from the input box.
            currentInputMenuItems[3].setAttribute("disabled", "");

            // Increase the width of the action dropdown.
            dropdownMenu.classList.remove("reduced");
        }

        /**
         * Show checkbox if selected option is applicable for opening tabs/windows in
         * background or is invertible. Otherwise, hide the checkboxes and their labels.
         */
        if (that.options.actions.backgroundOption.includes(selectedAction) || that.options.actions.invertOption.includes(selectedAction)) {
            currentInputMenuItems[4].classList.remove("hidden");
            currentInputMenuItems[5].classList.remove("hidden");

            // Disable the checkbox.
            currentInputMenuItems[5].removeAttribute("disabled");
        }
        else {
            currentInputMenuItems[4].classList.add("hidden");
            currentInputMenuItems[5].classList.add("hidden");

            // Reset the checkbox, i.e., uncheck it.
            currentInputMenuItems[5].checked = false;

            // Remove the disabled attribute from the checkbox.
            currentInputMenuItems[5].setAttribute("disabled", "");
        }
    };
})(fluid);
