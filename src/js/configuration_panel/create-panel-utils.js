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

    fluid.registerNamespace("gamepad.configurationPanel.createPanelUtils");

    /**
     *
     * Create the input action label and its dropdown and inject both into the
     * configuration menu (of the given input).
     *
     * @param {Object} that - The configurationPanel component.
     * @param {String} inputIdentifier - The String containing input type with its index.
     *                                   For example, "button-0".
     * @param {Object} configMenu - The configuration menu (container) for a given input.
     * @param {Boolean} inputType - The type of the gamepad input, i.e., "axes" or "buttons".
     * @param {Object} currentValue - The current value of the input action dropdown for
     *                                a given input.
     *
     */
    gamepad.configurationPanel.createPanelUtils.createInputActionDropdown = function (that, inputIdentifier, configMenu, inputType, currentValue) {
        // Create a label for the input action dropdown and set its inner text.
        var actionLabel = document.createElement("label");
        actionLabel.innerHTML = "Action:";

        // Set the attributes and class names of the input action label.
        actionLabel.setAttribute("for", inputIdentifier + "-action");
        actionLabel.classList.add(inputIdentifier + "-child");

        // Inject the input action label into configuration menu (of the given input).
        configMenu.appendChild(actionLabel);

        // Create the input action dropdown (select) for the given input.
        var inputSelectMenu = document.createElement("select");

        // Set the value of the dropdown to the action currently selected.
        var actionsList = that.options.message[inputType];
        fluid.each(actionsList, function (actionLabel, actionValue) {
            // Create an option for the action and set its value and label.
            var option = document.createElement("option");
            option.setAttribute("value", actionValue);
            option.innerHTML = actionLabel;

            // Mark the option as selected if it is being used.
            if (currentValue === actionValue) {
                option.setAttribute("selected", "");
            }

            // Inject the option into the dropdown.
            inputSelectMenu.appendChild(option);
        });

        // Set other attributes and class names of the input action dropdown menu.
        inputSelectMenu.setAttribute("name", inputIdentifier + "-action");
        inputSelectMenu.classList.add(inputIdentifier + "-child");

        // Inject the dropdown menu into configuration menu (of the given input).
        configMenu.appendChild(inputSelectMenu);
    };

    /**
     *
     * Create the speed factor label and its input box and inject both into the
     * configuration menu (of the given input).
     *
     * @param {String} inputIdentifier - The String containing input type with its index.
     *                                   For example, "button-0".
     * @param {Object} configMenu - The configuration menu (container) for a given input.
     * @param {Object} currentValue - The current value of speedFactor for a given input
     *                                (if applicable).
     *
     */
    gamepad.configurationPanel.createPanelUtils.createSpeedFactorOption = function (inputIdentifier, configMenu, currentValue) {
        // Create a speed factor label and set its inner text.
        var speedFactorLabel = document.createElement("label");
        speedFactorLabel.innerHTML = "Speed Factor:";

        // Set the attributes and class names of the speed factor label.
        speedFactorLabel.setAttribute("for", inputIdentifier + "-speedFactor");
        speedFactorLabel.classList.add("speed-factor-label", inputIdentifier + "-child");

        // Inject the speed factor label into configuration menu (of the given input).
        configMenu.appendChild(speedFactorLabel);

        // Create a speed factor numeric input box and set its default value.
        var speedFactorInput = document.createElement("input");
        speedFactorInput.setAttribute("type", "number");
        speedFactorInput.value = currentValue;

        // Set the minimun, maximum, and increment value of the input box.
        speedFactorInput.setAttribute("step", 0.1);
        speedFactorInput.setAttribute("min", 0.5);
        speedFactorInput.setAttribute("max", 2.5);

        // Set other attributes and class names of the speed factor input box.
        speedFactorInput.setAttribute("name", inputIdentifier + "-speedFactor");
        speedFactorInput.classList.add("speed-factor", inputIdentifier + "-child");

        // Inject speed factor input box into configuration menu (of the given input).
        configMenu.appendChild(speedFactorInput);
    };

    /**
     *
     * Create the third configuration option label and checkbox and inject both into the
     * configuration menu (of the given input).
     *
     * @param {String} inputIdentifier - The String containing input type with its index.
     *                                   For example, "button-0".
     * @param {Object} configMenu - The configuration menu (container) for a given input.
     * @param {Boolean} isAxes - Whether the current input is "axes".
     * @param {Object} currentValue - The current value of the third configuration option
     *                                for a given input (if applicable).
     *
     */
    gamepad.configurationPanel.createPanelUtils.createCheckbox = function (inputIdentifier, configMenu, isAxes, currentValue) {
        // Create the third configuration option label and set its inner text.
        var thirdConfigurationOptionLabel = document.createElement("label");
        thirdConfigurationOptionLabel.innerHTML = isAxes ? "Invert Action" : "Open new tab/window in background";

        // Set the attributes and class names of the third configuration option label.
        var forSuffix = isAxes ? "invert" : "background";
        thirdConfigurationOptionLabel.setAttribute("for", inputIdentifier + "-" + forSuffix);
        thirdConfigurationOptionLabel.classList.add("checkbox-label", inputIdentifier + "-child");

        // Inject the checkbox label into configuration menu (of the given input).
        configMenu.appendChild(thirdConfigurationOptionLabel);

        // Create the third configuration option checkbox and set its value.
        var thirdConfigurationOption = document.createElement("input");
        thirdConfigurationOption.setAttribute("type", "checkbox");
        thirdConfigurationOption.checked = currentValue;

        // Set other attributes and class names of the checkbox.
        thirdConfigurationOption.setAttribute("name", inputIdentifier + "-" + forSuffix);
        thirdConfigurationOption.classList.add("checkbox", inputIdentifier + "-child");

        // Inject the checkbox into configuration menu (of the given input).
        configMenu.appendChild(thirdConfigurationOption);
    };
})(fluid);
