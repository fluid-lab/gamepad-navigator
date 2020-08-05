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

    fluid.registerNamespace("gamepad.inputMapperUtils.background");

    // TODO: Add continuous / long-press browser tab navigation, if needed.
    // TODO: Add browser tab navigation for thumbsticks.

    /**
     * TODO: Save the DOM element focused before switching tabs so that it can be
     * restored when the user navigates back to the same tab.
     */

    /**
     *
     * Sends message to the background script to perform the given action.
     *
     * @param {Object} that - The inputMapper component.
     * @param {String} actionName - The action to be performed.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Boolean} background - Whether the new tab should open in background.
     * @param {String} homepageURL - The URL for the new tab.
     *
     */
    gamepad.inputMapperUtils.background.sendMessage = function (that, actionName, value, oldValue, background, homepageURL) {
        if (value < oldValue && oldValue > that.options.cutoffValue) {
            // Set the data object for the action.
            var actionData = { actionName: actionName };

            // Set active key if background parameter is passed as an argument.
            if (background !== undefined) {
                actionData.active = !background;
            }
            if (homepageURL) {
                actionData.homepageURL = homepageURL;
            }

            // Set the left pixel if the action is about changing "window size".
            if (actionName === "maximizeWindow" || actionName === "restoreWindowSize") {
                actionData.left = screen.availLeft;
            }

            // Send the message to the background script with the action details.
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to zoom in/out on the webpage using
     * thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} invert - Whether the zooming should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.background.thumbstickZoom = function (that, value, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        var zoomType = value > 0 ? "zoomOut" : "zoomIn",
            actionData = { actionName: zoomType };
        value = value * (value > 0 ? 1 : -1);

        // Call the zoom changing invokers according to the input values.
        clearInterval(that.intervalRecords.zoomIn);
        clearInterval(that.intervalRecords.zoomOut);
        if (value > that.options.cutoffValue) {
            that.intervalRecords[zoomType] = setInterval(chrome.runtime.sendMessage, that.options.frequency, actionData);
        }
    };

    /**
     *
     * Sends message to the background script to change the current window size using
     * thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} invert - Whether the zooming should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.background.thumbstickWindowSize = function (that, value, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1,
            windowSizeActionLabel = null;
        value = value * inversionFactor;
        if (value > 0) {
            windowSizeActionLabel = "maximizeWindow";
        }
        else {
            windowSizeActionLabel = "restoreWindowSize";
            value = value * -1;
        }

        // Call the window size changing invokers according to the input value.
        if (value > that.options.cutoffValue) {
            chrome.runtime.sendMessage({
                actionName: windowSizeActionLabel,
                left: screen.availLeft
            });
        }
    };
})(fluid);
