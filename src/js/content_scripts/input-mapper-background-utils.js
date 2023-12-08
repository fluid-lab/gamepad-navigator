/*
Copyright (c) 2023 The Gamepad Navigator Authors
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

        wrappedActionOptions.newTabOrWindowURL = that.model.prefs.newTabOrWindowURL;

        // Set the left pixel if the action is about changing "window size".
        if (actionOptions.action === "maximizeWindow" || actionOptions.action === "restoreWindowSize") {
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
     * @param {Object} actionOptions - The parameters for this action.
     * @property {Boolean} invert - Whether the zooming should be in opposite order.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.background.thumbstickZoom = async function (that, actionOptions, inputType, index) {
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;

        var value = fluid.get(that.model, [inputType, index]);

        var polarisedValue = value * inversionFactor;
        var zoomType = polarisedValue > 0 ? "zoomOut" : "zoomIn";

        var delegatedActionOptions = fluid.copy(actionOptions);
        delegatedActionOptions.action = zoomType;
        gamepad.inputMapperUtils.background.postMessage(that, delegatedActionOptions);
    };

    /**
     *
     * Sends message to the background script to change the current window size using
     * thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The parameters for this action.
     * @property {Boolean} invert - Whether the zooming should be in opposite order.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.background.thumbstickWindowSize = function (that, actionOptions, inputType, index) {
        var invert = fluid.get(actionOptions, "invert") || false;

        var value = fluid.get(that.model, [inputType, index]);

        var inversionFactor = invert ? -1 : 1;
        var polarisedValue = value * inversionFactor;

        var delegatedAction = polarisedValue > 0 ? "maximizeWindow" : "restoreWindowSize";

        var delegatedActionOptions = {
            action: delegatedAction,
            left: screen.availLeft
        };
        gamepad.inputMapperUtils.background.postMessage(that, delegatedActionOptions);
    };
})(fluid);
