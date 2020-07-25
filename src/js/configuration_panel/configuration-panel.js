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

    fluid.registerNamespace("gamepad.configMaps");
    fluid.registerNamespace("gamepad.configurationPanel");
    fluid.registerNamespace("gamepad.configurationPanel.createPanelUtils");
    fluid.registerNamespace("gamepad.configurationPanel.handleEvents");
    fluid.registerNamespace("gamepad.configurationPanel.buttonListeners");

    fluid.defaults("gamepad.configurationPanel", {
        gradeNames: ["gamepad.configMaps", "fluid.viewComponent"],
        selectors: {
            configurationMenu: ".configuration-menu",
            buttonsContainer: ".buttons-container",
            setAllToNoneButton: "#set-to-none",
            restoreDefaultsButton: "#set-to-default",
            saveChangesButton: "#save-changes",
            discardButton: "#discard-changes"
        },
        listeners: {
            "onCreate.loadConfigurationPanel": "{that}.createPanel",
            "onCreate.handleSwitching": "{that}.handleSwitching"
        },
        description: {
            buttons: {
                "0": "Button 0: A (Xbox), &#10799; (PS4)",
                "1": "Button 1: B (Xbox), O (PS4)",
                "2": "Button 2: X (Xbox), &#9723; (PS4)",
                "3": "Button 3: Y (Xbox), &#9651; (PS4)",
                "4": "Button 4: Left Bumper",
                "5": "Button 5: Right Bumper",
                "6": "Button 6: Left Trigger",
                "7": "Button 7: Right Trigger",
                "8": "Button 8: Back (Xbox), Share (PS4)",
                "9": "Button 9: Start (Xbox), Options (PS4)",
                "10": "Button 10: Left Thumbstick Button",
                "11": "Button 11: Right Thumbstick Button",
                "12": "Button 12: D-Pad Up Button",
                "13": "Button 13: D-Pad Down Button",
                "14": "Button 14: D-Pad Left Button",
                "15": "Button 15: D-Pad Right Button"
            },
            axes: {
                "0": "Left Thumbstick Horizontal Direction",
                "1": "Left Thumbstick Vertical Direction",
                "2": "Right Thumbstick Horizontal Direction",
                "3": "Right Thumbstick Vertical Direction"
            }
        },
        message: {
            buttons: {
                null: "None",
                click: "Click",
                previousPageInHistory: "History back button",
                nextPageInHistory: "History next button",
                reverseTab: "Focus on the previous element",
                forwardTab: "Focus on the next element",
                scrollLeft: "Scroll left",
                scrollRight: "Scroll right",
                scrollUp: "Scroll up",
                scrollDown: "Scroll down",
                goToPreviousTab: "Switch to the previous browser tab",
                goToNextTab: "Switch to the next browser tab",
                closeCurrentTab: "Close current browser tab",
                openNewTab: "Open a new tab",
                closeCurrentWindow: "Close current browser window",
                openNewWindow: "Open a new browser window",
                goToPreviousWindow: "Switch to the previous browser window",
                goToNextWindow: "Switch to the next browser window"
            },
            axes: {
                null: "None",
                scrollHorizontally: "Scroll horizontally",
                scrollVertically: "Scroll vertically",
                thumbstickHistoryNavigation: "History navigation",
                thumbstickTabbing: "Focus on the previous/next element"
            }
        },
        // Describes the actions that use a particular configuration option.
        actions: {
            speedFactorOption: [
                "reverseTab",
                "forwardTab",
                "scrollLeft",
                "scrollRight",
                "scrollUp",
                "scrollDown",
                "scrollHorizontally",
                "scrollVertically",
                "thumbstickTabbing"
            ],
            backgroundOption: ["openNewTab", "openNewWindow"],
            invertOption: [
                "scrollHorizontally",
                "scrollVertically",
                "thumbstickHistoryNavigation",
                "thumbstickTabbing"
            ]
        },
        invokers: {
            createPanel: {
                funcName: "gamepad.configurationPanel.createPanel",
                args: ["{that}", "{that}.dom.configurationMenu"]
            },
            createInputActionDropdown: {
                funcName: "gamepad.configurationPanel.createPanelUtils.createInputActionDropdown",
                args: [
                    "{that}",
                    "{arguments}.0",
                    "{arguments}.1",
                    "{arguments}.2",
                    "{arguments}.3"
                ]
            },
            createSpeedFactorOption: {
                funcName: "gamepad.configurationPanel.createPanelUtils.createSpeedFactorOption",
                args: ["{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            createCheckbox: {
                funcName: "gamepad.configurationPanel.createPanelUtils.createCheckbox",
                args: [
                    "{arguments}.0",
                    "{arguments}.1",
                    "{arguments}.2",
                    "{arguments}.3"
                ]
            },
            attachListeners: {
                funcName: "gamepad.configurationPanel.attachListeners",
                args: [
                    "{that}",
                    "{that}.dom.setAllToNoneButton",
                    "{that}.dom.restoreDefaultsButton",
                    "{that}.dom.saveChangesButton",
                    "{that}.dom.discardButton"
                ]
            },
            handleSwitching: {
                funcName: "gamepad.configurationPanel.handleEvents.switching",
                args: ["{that}.dom.configurationMenu"]
            },
            modifyDropdownMenu: {
                funcName: "gamepad.configurationPanel.handleEvents.modifyDropdownMenu",
                args: ["{that}"]
            },
            listenDropdownChanges: {
                funcName: "gamepad.configurationPanel.handleEvents.listenDropdownChanges",
                args: ["{that}"]
            },
            changeConfigMenuOptions: {
                funcName: "gamepad.configurationPanel.handleEvents.changeConfigMenuOptions",
                args: ["{that}", "{arguments}.0"]
            },
            setAllToNoneListener: {
                funcName: "gamepad.configurationPanel.buttonListeners.setAllToNone",
                args: ["{that}"]
            },
            setToDefaultListener: {
                funcName: "gamepad.configurationPanel.buttonListeners.setToDefault",
                args: ["{that}"]
            },
            discardChangesListener: {
                funcName: "gamepad.configurationPanel.buttonListeners.discardChanges",
                args: ["{that}"]
            },
            saveChangesListener: {
                funcName: "gamepad.configurationPanel.buttonListeners.saveChanges",
                args: ["{that}"]
            },
            toggleSaveAndDiscardButton: {
                funcName: "gamepad.configurationPanel.buttonListeners.toggleSaveAndDiscardButton",
                args: ["{that}", "{that}.dom.saveChangesButton", "{that}.dom.discardButton"]
            }
        }
    });

    /**
     *
     * Create a configuration panel on the Chrome extension's popup window.
     *
     * @param {Object} that - The configurationPanel component.
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.configurationPanel.createPanel = function (that, configurationMenu) {
        configurationMenu = configurationMenu[0];
        configurationMenu.innerHTML = "";

        /**
         * Create the configuration menu for each input and inject it inside the
         * configuration panel.
         */
        chrome.storage.local.get(["gamepadConfiguration"], function (storedConfigurationWrapper) {
            var totalGamepadInputs = 20,
                storedGamepadConfiguration = fluid.get(storedConfigurationWrapper, "gamepadConfiguration");

            for (var inputCounter = 0; inputCounter < totalGamepadInputs; inputCounter++) {
                // Compute input label and index of input.
                var inputIndex = inputCounter % 16,
                    isAxes = inputCounter / 16 >= 1;

                // Create a container for the particular input's configuration options.
                var inputMenuItem = document.createElement("div");

                // Set properties/attributes of the container element.
                var inputIdentifier = (isAxes ? "axes-" : "button-") + inputIndex;
                inputMenuItem.classList.add("menu-item", inputIdentifier);

                // Set attributes and text of the input description.
                var inputDescription = document.createElement("h1");
                inputDescription.innerHTML = that.options.description[isAxes ? "axes" : "buttons"][inputIndex];
                inputMenuItem.appendChild(inputDescription);

                /**
                 * Obtain and use the default input data for setting initial values on
                 * the panel, if the stored gamepad configuration data is unavailable.
                 */
                var actionValue = null,
                    speedFactor = null,
                    checkboxValue = null,
                    inputConfig = null;
                if (!storedGamepadConfiguration) {
                    inputConfig = that.model.map[isAxes ? "axes" : "buttons"][inputIndex];
                    actionValue = inputConfig.defaultAction;
                }
                else {
                    inputConfig = storedGamepadConfiguration[isAxes ? "axes" : "buttons"][inputIndex];
                    actionValue = fluid.get(inputConfig, "currentAction");
                }
                speedFactor = fluid.get(inputConfig, "speedFactor");
                checkboxValue = fluid.get(inputConfig, isAxes ? "invert" : "background");

                // Create the configuration option inputs for the current input.
                that.createInputActionDropdown(
                    inputIdentifier,
                    inputMenuItem,
                    isAxes,
                    actionValue
                );
                that.createSpeedFactorOption(inputIdentifier, inputMenuItem, speedFactor);
                that.createCheckbox(
                    inputIdentifier,
                    inputMenuItem,
                    isAxes,
                    checkboxValue
                );

                // Inject the input menu inside the configuration menu/panel.
                configurationMenu.appendChild(inputMenuItem);

                /**
                 * Modify the configuration panel according to the values of the
                 * configuration options and attach listeners to the configuration
                 * options and buttons.
                 */
                that.modifyDropdownMenu();
                that.listenDropdownChanges();
                that.attachListeners();
            }
        });
    };

    /**
     *
     * Attach listeners to the configuration options and buttons.
     *
     * @param {Object} that - The configurationPanel component.
     * @param {Object} setAllToNoneButton - The "Set All to None" button on the panel.
     * @param {Object} restoreDefaultsButton - The "Restore Default Controls" button on the panel.
     * @param {Object} saveChangesButton - The "Save Changes" button on the panel.
     * @param {Object} discardButton - The "Discard Changes" button on the panel.
     *
     */
    gamepad.configurationPanel.attachListeners = function (that, setAllToNoneButton, restoreDefaultsButton, saveChangesButton, discardButton) {
        // Attach listener to all configuration options to toggle "Save Changes" button.
        var configurationOptions = document.querySelectorAll("select, .speed-factor, .checkbox");
        fluid.each(configurationOptions, function (configurationOption) {
            if (fluid.isDOMNode(configurationOption)) {
                configurationOption.addEventListener("input", function () {
                    that.toggleSaveAndDiscardButton();
                });
            }
        });

        // Attach click listener to all the buttons.
        setAllToNoneButton.click(that.setAllToNoneListener);
        restoreDefaultsButton.click(that.setToDefaultListener);
        saveChangesButton.click(that.saveChangesListener);
        discardButton.click(that.discardChangesListener);
    };

    window.onload = function () {
        gamepad.configurationPanel(".configuration-dashboard");
    };
})(fluid);
