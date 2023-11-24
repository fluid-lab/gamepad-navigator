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
     * TODO: Save the DOM element focus before switching tabs so that it can be restored
     * when the user navigates back to the same tab.
     */

    gamepad.inputMapperUtils.background.postMessageOnControlRelease = function (that, value, oldValue, actionOptions) {
        if (value < oldValue && oldValue > that.options.cutoffValue) {
            gamepad.inputMapperUtils.background.postMessage(that, actionOptions);
        }
    };

    /**
     *
     * Connect to the background script, send a message, and handle the response.
     *
     * @param {Object} that - The inputMapper component.
     * @param {String} actionOptions - The action payload to be transmitted.
     *
     */
    gamepad.inputMapperUtils.background.postMessage = async function (that, actionOptions) {
        // We use this because chrome.runtime.sendMessage did not leave enough time to receive a response.
        var port = chrome.runtime.connect();
        port.onMessage.addListener(function (response) {
            var vibrate = fluid.get(response, "vibrate");
            if (vibrate) {
                that.vibrate();
            }
        });

        var wrappedActionOptions = fluid.copy(actionOptions);

        wrappedActionOptions.homepageURL = that.model.commonConfiguration.homepageURL;

        // Set the left pixel if the action is about changing "window size".
        if (actionOptions.actionName === "maximizeWindow" || actionOptions.actionName === "restoreWindowSize") {
            wrappedActionOptions.left = screen.availLeft;
        }

        port.postMessage(wrappedActionOptions);
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
    gamepad.inputMapperUtils.background.thumbstickZoom = async function (that, value, invert) {
        clearInterval(that.intervalRecords.zoomIn);
        clearInterval(that.intervalRecords.zoomOut);

        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        var polarisedValue = value * inversionFactor;
        var zoomType = polarisedValue > 0 ? "zoomOut" : "zoomIn";
        var actionOptions = { actionName: zoomType };

        // Call the zoom changing invokers according to the input values.
        if (Math.abs(value) > that.options.cutoffValue) {
            that.intervalRecords[zoomType] = setInterval(function (actionOptions) {
                gamepad.inputMapperUtils.background.postMessage(that, actionOptions);
            }, that.options.frequency, actionOptions);
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
        var inversionFactor = invert ? -1 : 1;
        var polarisedValue = value * inversionFactor;

        var actionName = polarisedValue > 0 ? "maximizeWindow" : "restoreWindowSize";

        var actionOptions = {
            actionName: actionName,
            left: screen.availLeft
        };

        // Call the window size changing invokers according to the input value.
        if (Math.abs(value) > that.options.cutoffValue) {
            gamepad.inputMapperUtils.background.postMessage(that, actionOptions);
        }
    };
})(fluid);
