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

    fluid.registerNamespace("gamepad.configurationDashboard");

    fluid.defaults("gamepad.configurationDashboard", {
        gradeNames: ["fluid.viewComponent"],
        buttonSelectOptions: [
            ["vacant", "Do nothing", 1],
            ["click", "Click", 0],
            ["previousPageInHistory", "History back button", 2],
            ["nextPageInHistory", "History next button", 3],
            ["reverseTab", "Focus on the previous element", 4],
            ["forwardTab", "Focus on the next element", 5],
            ["scrollLeft", "Scroll left", 6],
            ["scrollRight", "Scroll right", 7],
            ["scrollUp", "Scroll up", null],
            ["scrollDown", "Scroll down", null],
            ["goToPreviousTab", "Switch to the previous browser tab", 14],
            ["goToNextTab", "Switch to the next browser tab", 15],
            ["closeCurrentTab", "Close current browser tab", 8],
            ["openNewTab", "Open a new tab", 9],
            ["closeCurrentWindow", "Close current browser window", 10],
            ["openNewWindow", "Open a new browser window", 11],
            ["goToPreviousWindow", "Switch to the previous browser window", 12],
            ["goToNextWindow", "Switch to the next browser window", 13]
        ],
        axesSelectOptions: [
            ["vacant", "Do nothing", null],
            ["scrollHorizontally", "Scroll horizontally", 0],
            ["scrollVertically", "Scroll vertically", 1],
            ["thumbstickHistoryNavigation", "History navigation", 2],
            ["thumbstickTabbing", "Focus on the previous/next element", 3]
        ],
        listeners: {
            "onCreate.loadConfigurationPanel": "{that}.createPanel"
        },
        invokers: {
            createPanel: {
                funcName: "gamepad.configurationDashboard.createPanel",
                args: ["{that}"]
            }
        }
    });

    /**
     *
     * Create a configuration panel inside the Chrome extension's popup window..
     *
     * @param {Object} that - The configurationDashboard component.
     *
     */
    gamepad.configurationDashboard.createPanel = function (that) {
        // Obtain the configuration dashboard selector.
        var configurationDashboard = document.querySelector(".configuration-dashboard");
        configurationDashboard.innerHTML = "";

        /**
         * Create the gamepad image DOM element and inject it inside configuration
         * dashboard.
         */
        var gamepadImage = document.createElement("img");
        gamepadImage.classList.add("gamepad-controls");
        gamepadImage.setAttribute("src", "../images/gamepad.svg");
        configurationDashboard.appendChild(gamepadImage);

        // Create the gamepad controls configuration menu.
        var configurationMenu = document.createElement("div");
        configurationMenu.classList.add("configuration-menu");

        var totalInputs = 20,
            axesLabels = [
                "Left Axis Horizontal Direction",
                "Left Axis Vertical Direction",
                "Right Axis Horizontal Direction",
                "Right Axis Vertical Direction"
            ];

        /**
         * Create the options menu for each input and inject it inside gamepad controls
         * configuration menu.
         */
        for (var inputCounter = 0; inputCounter < totalInputs; inputCounter++) {
            var inputMenuItem = document.createElement("div");
            inputMenuItem.classList.add("menu-item");

            // Compute input label and index of input.
            var inputIndex = inputCounter % 16,
                isAxes = inputCounter / 16 >= 1,
                inputName = null,
                forAttributeValue = null;
            if (isAxes) {
                inputName = axesLabels[inputIndex];
                forAttributeValue = "axes-" + inputIndex;
            }
            else {
                inputName = "Button " + inputIndex;
                forAttributeValue = "button-" + inputIndex;
            }

            // Set attributes and text of the input label.
            var inputLabel = document.createElement("h1");
            inputLabel.classList.add(forAttributeValue);
            inputLabel.innerHTML = inputName;
            inputMenuItem.appendChild(inputLabel);

            // Create a label for the input action and inject it.
            var actionLabel = document.createElement("label");
            actionLabel.setAttribute("for", forAttributeValue + "-action");
            actionLabel.innerHTML = "Action:";
            inputMenuItem.appendChild(actionLabel);

            // Create the options menu for the input action.
            var inputSelectMenu = document.createElement("select");
            inputSelectMenu.setAttribute("name", forAttributeValue + "-action");

            var actionsList = isAxes ? that.options.axesSelectOptions : that.options.buttonSelectOptions;
            // eslint-disable-next-line
            fluid.each(actionsList, function (optionArray, optionIndex) {
                var option = document.createElement("option");
                option.setAttribute("value", optionArray[0]);
                option.innerHTML = optionArray[1];
                if (optionArray[2] === inputIndex) {
                    option.setAttribute("selected", "");
                }
                inputSelectMenu.appendChild(option);
            });

            // Inject the input options menu into the DOM.
            inputMenuItem.appendChild(inputSelectMenu);

            // Create a speed factor label and inject it inside DOM.
            var speedFactorLabel = document.createElement("label");
            speedFactorLabel.classList.add("speed-factor-label");
            speedFactorLabel.setAttribute("for", forAttributeValue + "-speedFactor");
            speedFactorLabel.innerHTML = "Speed Factor:";
            inputMenuItem.appendChild(speedFactorLabel);

            // Create a speed factor input box and inject it.
            var speedFactorInput = document.createElement("input");
            inputSelectMenu.setAttribute("name", forAttributeValue + "-speedFactor");
            speedFactorInput.setAttribute("type", "number");
            speedFactorInput.classList.add("speed-factor");
            speedFactorInput.setAttribute("placeholder", 1.0);
            speedFactorInput.setAttribute("step", 0.1);
            speedFactorInput.setAttribute("min", 0.5);
            speedFactorInput.setAttribute("max", 2.5);
            inputMenuItem.appendChild(speedFactorInput);

            // Create and set the third configuration option label and inject it.
            var thirdConfigurationOptionLabel = document.createElement("label");
            thirdConfigurationOptionLabel.classList.add("checkbox-label");
            thirdConfigurationOptionLabel.innerHTML = isAxes ? "Invert Action" : "Open new tab/window in background";
            var forSuffix = isAxes ? "invert" : "background";
            thirdConfigurationOptionLabel.setAttribute("for", forAttributeValue + "-" + forSuffix);
            inputMenuItem.appendChild(thirdConfigurationOptionLabel);

            // Create the third configuration option checkbox and inject it.
            var thirdConfigurationOption = document.createElement("input");
            thirdConfigurationOption.setAttribute("name", forAttributeValue + "-" + forSuffix);
            thirdConfigurationOption.setAttribute("type", "checkbox");
            inputMenuItem.appendChild(thirdConfigurationOption);

            configurationMenu.appendChild(inputMenuItem);
        }

        // Inject the configuration menu inside the configuration dashboard.
        configurationDashboard.appendChild(configurationMenu);

        // Create the progress bar and inject it inside the configuration dashboard.
        var progressBar = document.createElement("div"),
            progressIndicator = document.createElement("div");
        progressBar.classList.add("progress-bar");
        progressIndicator.classList.add("progress-indicator");
        progressBar.appendChild(progressIndicator);
        configurationDashboard.appendChild(progressBar);

        // Create the buttons menu and inject it.
        var buttonsContainer = document.createElement("div"),
            setControlsButton = document.createElement("button"),
            resetControlsButton = document.createElement("button");
        setControlsButton.innerHTML = "Set Controls";
        resetControlsButton.innerHTML = "Restore Defaults";
        setControlsButton.classList.add("button");
        resetControlsButton.classList.add("button");
        buttonsContainer.classList.add("buttons-container");
        buttonsContainer.appendChild(resetControlsButton);
        buttonsContainer.appendChild(setControlsButton);
        configurationDashboard.appendChild(buttonsContainer);
    };
})(fluid);
