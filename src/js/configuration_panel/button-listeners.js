/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, chrome */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.configurationPanel.buttonListeners");

    /**
     *
     * Set all the input action dropdown menus' value to none.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.buttonListeners.setAllToNone = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var dropdownMenusArray = document.querySelectorAll("select");

        // Set all dropdown values to none.
        fluid.each(dropdownMenusArray, function (dropdownMenu) {
            if (fluid.isDOMNode(dropdownMenu)) {
                // Set selected option to none.
                dropdownMenu.selectedIndex = 0;

                // Hide all other input menu configuration options.
                that.changeConfigMenuOptions(dropdownMenu);
            }
        });

        // Toggle the "Save Changes" button.
        that.toggleSaveAndDiscardButton();
    };

    /**
     *
     * Set all the input action dropdown menus' value to their default value.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.buttonListeners.setToDefault = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var configurationMenus = document.querySelectorAll(".menu-item");

        /**
         * Iterate through each input's configuration menu and set configuration option
         * values to the default ones.
         */
        fluid.each(configurationMenus, function (configurationMenu, index) {
            if (fluid.isDOMNode(configurationMenu)) {
                var isAxes = index / 16 >= 1,
                    inputIndex = index % 16,
                    actionData = that.model.map[isAxes ? "axes" : "buttons"][inputIndex];

                // Set the default value of the action dropdown.
                fluid.find(configurationMenu.querySelector("select").options, function (actionOption, actionIndex) {
                    if (actionOption.value === actionData.defaultAction) {
                        configurationMenu.querySelector("select").selectedIndex = actionIndex;
                        return true;
                    }
                });

                // Set the default value of the speed factor input.
                configurationMenu.querySelector(".speed-factor").value = actionData.speedFactor;

                // Set the default value of the checkbox input.
                configurationMenu.querySelector(".checkbox").checked = actionData[isAxes ? "invert" : "background"];

                // Display/hide other configuration options as per the value of dropdown.
                that.changeConfigMenuOptions(configurationMenu.querySelector("select"));
            }
        });

        // Toggle the "Save Changes" button.
        that.toggleSaveAndDiscardButton();
    };

    /**
     *
     * Discards the unsaved changes and restores the last saved changes.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.buttonListeners.discardChanges = function (that) {
        // Get all the input configuration menus.
        var configurationMenus = document.querySelectorAll(".menu-item");

        // Write the new gamepadConfiguration in Chrome's localStorage.
        chrome.storage.local.get(["gamepadConfiguration"], function (configWrapper) {
            var isStoredData = configWrapper.gamepadConfiguration ? true : false,
                gamepadConfiguration = configWrapper.gamepadConfiguration || that.model.map;

            // Set the values of all configuration options as being used currently.
            fluid.each(configurationMenus, function (configurationMenu, menuIndex) {
                if (fluid.isDOMNode(configurationMenu)) {
                    var inputIndex = menuIndex % 16,
                        isAxes = menuIndex / 16 >= 1;

                    // Obtain the configuration for the current input.
                    var inputConfiguration = gamepadConfiguration[isAxes ? "axes" : "buttons"][inputIndex];

                    // Set the value of the dropdown action for the current input.
                    var actionValue = inputConfiguration[isStoredData ? "currentAction" : "defaultAction"],
                        actionDropdown = configurationMenu.querySelector("select");
                    fluid.find(actionDropdown.options, function (actionOption, actionIndex) {
                        if (actionOption.value === actionValue) {
                            actionDropdown.selectedIndex = actionIndex;
                            return true;
                        }
                    });

                    // Display/hide other configuration options as per the value of dropdown.
                    that.changeConfigMenuOptions(actionDropdown);

                    // Set the value of the speed factor for the current input.
                    var speedFactorElement = configurationMenu.querySelector(".speed-factor");
                    if (!speedFactorElement.hasAttribute("disabled")) {
                        var speedFactorValue = inputConfiguration.speedFactor;
                        speedFactorElement.value = speedFactorValue;
                    }

                    // Set the checkbox for the current input.
                    var checkboxElement = configurationMenu.querySelector(".speed-factor");
                    if (!checkboxElement.hasAttribute("disabled")) {
                        var isChecked = inputConfiguration[isAxes ? "invert" : "background"];
                        checkboxElement.checked = isChecked;
                    }
                }
            });

            // Disable the "Discard Changes" and "Save Changes" button.
            that.toggleSaveAndDiscardButton();
        });
    };

    /**
     *
     * Save the new gamepad configuration from the configuration panel when triggered.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.buttonListeners.saveChanges = function (that) {
        // Get all the input configuration menus.
        var configurationMenus = document.querySelectorAll(".menu-item"),
            gamepadConfiguration = {
                buttons: {},
                axes: {}
            };

        // Save all the configuration options inside the gamepadConfiguration object.
        fluid.each(configurationMenus, function (configurationMenu, menuIndex) {
            if (fluid.isDOMNode(configurationMenu)) {
                var inputIndex = menuIndex % 16,
                    isAxes = menuIndex / 16 >= 1,
                    inputConfiguration = {};

                // Obtain and store the selected action for the current input.
                var currentAction = fluid.get(configurationMenu.querySelector("select"), "value");
                inputConfiguration.currentAction = currentAction;

                /**
                 * Obtain and insert the new speed factor value inside the
                 * gamepadConfiguration object (if not disabled).
                 */
                var speedFactorElement = configurationMenu.querySelector(".speed-factor");
                if (!speedFactorElement.hasAttribute("disabled")) {
                    var speedFactorValue = parseFloat(speedFactorElement.value);

                    // Reduce the value to 2.5 if it's more than that.
                    inputConfiguration.speedFactor = Math.min(2.5, speedFactorValue);
                }

                /**
                 * Insert the third configuration option checkbox value inside the
                 * gamepadConfiguration object (if not disabled).
                 */
                var checkboxValueElement = configurationMenu.querySelector(".checkbox");
                if (!checkboxValueElement.hasAttribute("disabled")) {
                    var thirdConfigurationOption = isAxes ? "invert" : "background";
                    inputConfiguration[thirdConfigurationOption] = checkboxValueElement.checked;
                }

                // Save the input in the gamepadConfiguration object.
                gamepadConfiguration[isAxes ? "axes" : "buttons"][inputIndex] = inputConfiguration;
            }
        });

        // Write the new gamepadConfiguration in Chrome's localStorage.
        chrome.storage.local.remove(["gamepadConfiguration"], function () {
            chrome.storage.local.set({ gamepadConfiguration: gamepadConfiguration }, that.toggleSaveAndDiscardButton);
        });
    };

    /**
     *
     * Save the new configuration from the configuration panel when triggered.
     *
     * @param {Object} that - The configurationPanel component.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     * @param {Object} discardButton - The "Discard Changes" button on the panel.
     *
     */
    gamepad.configurationPanel.buttonListeners.toggleSaveAndDiscardButton = function (that, saveChangesButton, discardButton) {
        saveChangesButton = saveChangesButton[0];
        discardButton = discardButton[0];
        chrome.storage.local.get(["gamepadConfiguration"], function (gamepadConfigurationWrapper) {
            // Get the list of all dropdowns in the configuration panel.
            var configurationMenus = document.querySelectorAll(".menu-item");

            /**
             * Iterate through each input's configuration menu and compare whether any
             * configuration option has changed.
             */
            fluid.find(configurationMenus, function (configurationMenu, index) {
                if (fluid.isDOMNode(configurationMenu)) {
                    var isAxes = index / 16 >= 1,
                        inputIndex = index % 16,
                        isStoredData = gamepadConfigurationWrapper.gamepadConfiguration !== undefined;

                    // Get data about the initial values of the configuration options.
                    var initialConfiguration = gamepadConfigurationWrapper.gamepadConfiguration || that.model.map,
                        initialInputData = initialConfiguration[isAxes ? "axes" : "buttons"][inputIndex];

                    /**
                     * Enable the "Save Changes" button if dropdown option is changed.
                     * Otherwise, disable the button.
                     */
                    var actionDropdown = configurationMenu.querySelector("select"),
                        currentDropdownValue = actionDropdown.value,
                        initialDropdownValue = initialInputData[isStoredData ? "currentAction" : "defaultAction"];
                    if (currentDropdownValue !== initialDropdownValue) {
                        saveChangesButton.removeAttribute("disabled");
                        discardButton.removeAttribute("disabled");
                        return true;
                    }
                    else {
                        saveChangesButton.setAttribute("disabled", "");
                        discardButton.setAttribute("disabled", "");
                    }

                    /**
                     * Enable the "Save Changes" button if the value of speedFactor is
                     * changed. Otherwise, disable the button.
                     */
                    var speedFactorElement = configurationMenu.querySelector(".speed-factor");
                    if (!speedFactorElement.hasAttribute("disabled")) {
                        var initialSpeedFactorValue = initialInputData.speedFactor,
                            currentSpeedFactorValue = parseFloat(speedFactorElement.value);
                        if (initialSpeedFactorValue !== currentSpeedFactorValue) {
                            saveChangesButton.removeAttribute("disabled");
                            discardButton.removeAttribute("disabled");
                            return true;
                        }
                        else {
                            saveChangesButton.setAttribute("disabled", "");
                            discardButton.setAttribute("disabled", "");
                        }
                    }

                    /**
                     * Enable the "Save Changes" button if the value of third
                     * configuraton option is changed. Otherwise, disable the button.
                     */
                    var checkboxElement = configurationMenu.querySelector(".checkbox");
                    if (!checkboxElement.hasAttribute("disabled")) {
                        var wasCheckboxChecked = initialInputData[isAxes ? "invert" : "background"],
                            isCheckboxChecked = checkboxElement.checked;
                        if (wasCheckboxChecked !== isCheckboxChecked) {
                            saveChangesButton.removeAttribute("disabled");
                            discardButton.removeAttribute("disabled");
                            return true;
                        }
                        else {
                            saveChangesButton.setAttribute("disabled", "");
                            discardButton.setAttribute("disabled", "");
                        }
                    }
                }
            });
        });
    };
})(fluid);
