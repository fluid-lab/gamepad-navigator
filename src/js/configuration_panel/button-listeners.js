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
     * TODO: Migrate to Fluid View Components, if needed. Refer:
     * https://github.com/fluid-lab/gamepad-navigator/issues/40
     */

    /**
     *
     * Set all the input action dropdown menus' value to none.
     *
     * @param {Object} that - The configurationPanel component.
     *
     */
    gamepad.configurationPanel.buttonListeners.setAllToNone = function (that) {
        // Get the list of all dropdowns in the configuration panel.
        var actionDropdownMenus = document.querySelectorAll(".action-dropdown");

        // Set all dropdown values to none.
        fluid.each(actionDropdownMenus, function (actionDropdown) {
            if (fluid.isDOMNode(actionDropdown)) {
                // Set selected option to none.
                actionDropdown.selectedIndex = 0;

                // Hide all other input menu configuration options.
                that.changeConfigMenuOptions(actionDropdown);
            }
        });

        // Toggle the "Save Changes" button.
        that.toggleSaveAndDiscardButtons();
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

                // Set the default option of the action dropdown.
                fluid.find(configurationMenu.querySelector(".action-dropdown").options, function (actionOption, actionIndex) {
                    if (actionOption.value === actionData.defaultAction) {
                        configurationMenu.querySelector(".action-dropdown").selectedIndex = actionIndex;
                        return true;
                    }
                });

                // Set the default value of the speed factor input.
                configurationMenu.querySelector(".speed-factor").value = actionData.speedFactor;

                // Mark the checkbox if it's checked by default.
                configurationMenu.querySelector(".checkbox").checked = actionData[isAxes ? "invert" : "background"];

                // Display/hide other configuration options as per the value of dropdown.
                that.changeConfigMenuOptions(configurationMenu.querySelector(".action-dropdown"));
            }
        });

        // Toggle the "Save Changes" button.
        that.toggleSaveAndDiscardButtons();
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
                        actionDropdown = configurationMenu.querySelector(".action-dropdown");
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
            that.toggleSaveAndDiscardButtons();
        });
    };

    /**
     *
     * Store the gamepad configuration from the configuration panel when triggered.
     *
     * @param {Object} that - The configurationPanel component.
     * @param {String} configurationName - The name with which the configuration should be saved.
     *
     */
    gamepad.configurationPanel.buttonListeners.storeChanges = function (that, configurationName) {
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
                var currentAction = fluid.get(configurationMenu.querySelector(".action-dropdown"), "value");
                inputConfiguration.currentAction = currentAction;

                /**
                 * Obtain and insert the new speed factor value inside the
                 * gamepadConfiguration object (if not disabled).
                 */
                var speedFactorElement = configurationMenu.querySelector(".speed-factor");
                if (!speedFactorElement.hasAttribute("disabled")) {
                    var speedFactorValue = parseFloat(speedFactorElement.value);

                    // Reduce the speed factor value to 2.5 if it's more than that.
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

                // Save the input's configuration in the gamepadConfiguration object.
                gamepadConfiguration[isAxes ? "axes" : "buttons"][inputIndex] = inputConfiguration;
            }
        });

        // Remove the old configuration from Chrome's localStorage.
        chrome.storage.local.remove([configurationName], function () {
            var configurationWrapper = {};
            configurationWrapper[configurationName] = gamepadConfiguration;

            // Save the new configuration.
            chrome.storage.local.set(configurationWrapper, function () {
                /**
                 * Toggle (disable) the buttons if the data is stored as
                 * "gamepadConfiguration" and not the unsaved changes.
                 */
                if (configurationName === "gamepadConfiguration") {
                    that.toggleSaveAndDiscardButtons();
                }
            });
        });
    };

    /**
     *
     * Toggle the "Save Changes" and "Discard Changes" buttons when the input
     * configuration is changed.
     *
     * @param {Object} that - The configurationPanel component.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     * @param {Object} discardButton - The "Discard Changes" button on the panel.
     *
     */
    gamepad.configurationPanel.buttonListeners.toggleSaveAndDiscardButtons = function (that, saveChangesButton, discardButton) {
        saveChangesButton = saveChangesButton[0];
        discardButton = discardButton[0];
        chrome.storage.local.get(["gamepadConfiguration"], function (gamepadConfigurationWrapper) {
            // Get the list of all dropdowns in the configuration panel.
            var configurationMenus = document.querySelectorAll(".menu-item");

            /**
             * Iterate through each input's configuration menu and compare whether any
             * configuration option has changed.
             */
            var isChanged = fluid.find(configurationMenus, function (configurationMenu, index) {
                if (fluid.isDOMNode(configurationMenu)) {
                    var isAxes = index / 16 >= 1,
                        inputIndex = index % 16,
                        isStoredData = gamepadConfigurationWrapper.gamepadConfiguration !== undefined;

                    // Get data about the initial values of the configuration options.
                    var initialConfiguration = gamepadConfigurationWrapper.gamepadConfiguration || that.model.map,
                        initialInputData = initialConfiguration[isAxes ? "axes" : "buttons"][inputIndex];

                    /**
                     * Enable the "Save Changes" and "Discard Changes" buttons if
                     * dropdown option is changed.
                     */
                    var actionDropdown = configurationMenu.querySelector(".action-dropdown"),
                        currentDropdownValue = actionDropdown.value,
                        initialDropdownValue = initialInputData[isStoredData ? "currentAction" : "defaultAction"] || "null";
                    if (currentDropdownValue !== initialDropdownValue) {
                        saveChangesButton.removeAttribute("disabled");
                        discardButton.removeAttribute("disabled");

                        /**
                         * Store the unsaved changes to avoid loss of configuration if
                         * the panel is closed temporarily.
                         */
                        that.storeUnsavedChanges();
                        return true;
                    }

                    /**
                     * Enable the "Save Changes" and "Discard Changes" buttons if the
                     * value of speedFactor is changed.
                     */
                    var speedFactorElement = configurationMenu.querySelector(".speed-factor");
                    if (!speedFactorElement.hasAttribute("disabled")) {
                        var initialSpeedFactorValue = initialInputData.speedFactor,
                            currentSpeedFactorValue = parseFloat(speedFactorElement.value);
                        if (initialSpeedFactorValue !== currentSpeedFactorValue) {
                            saveChangesButton.removeAttribute("disabled");
                            discardButton.removeAttribute("disabled");

                            /**
                             * Store the unsaved changes to avoid loss of configuration if
                             * the panel is closed temporarily.
                             */
                            that.storeUnsavedChanges();
                            return true;
                        }
                    }

                    /**
                     * Enable the "Save Changes" and "Discard Changes" buttons if the
                     * value of third configuraton option is changed.
                     */
                    var checkboxElement = configurationMenu.querySelector(".checkbox");
                    if (!checkboxElement.hasAttribute("disabled")) {
                        var wasCheckboxChecked = initialInputData[isAxes ? "invert" : "background"],
                            isCheckboxChecked = checkboxElement.checked;
                        if (wasCheckboxChecked !== isCheckboxChecked) {
                            saveChangesButton.removeAttribute("disabled");
                            discardButton.removeAttribute("disabled");

                            /**
                             * Store the unsaved changes to avoid loss of configuration if
                             * the panel is closed temporarily.
                             */
                            that.storeUnsavedChanges();
                            return true;
                        }
                    }
                }
            });

            if (!isChanged) {
                // Remove the unsaved changes stored in the Chrome's storage.
                chrome.storage.local.remove(["unsavedConfiguration"], function () {
                    // Disable the "Save Changes" and "Discard Changes" buttons.
                    saveChangesButton.setAttribute("disabled", "");
                    discardButton.setAttribute("disabled", "");
                });
            }
        });
    };
})(fluid);
