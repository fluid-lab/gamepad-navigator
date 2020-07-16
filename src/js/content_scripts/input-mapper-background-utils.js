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

            // Send the message to the background script with the action details.
            chrome.runtime.sendMessage(actionData);
        }
    };
})(fluid);
