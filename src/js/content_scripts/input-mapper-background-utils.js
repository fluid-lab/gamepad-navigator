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

    /**
     *
     * Sends message to the background script to open a new tab.
     *
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} background - Whether the new tab should open in background.
     * @param {Integer} oldInputValue - The previous value of the gamepad input.
     * @param {String} homepageURL - The URL for the new tab.
     *
     */
    gamepad.inputMapperUtils.background.openNewTab = function (value, background, oldInputValue, homepageURL) {
        if (value < oldInputValue) {
            var actionData = {
                actionName: "openNewTab",
                active: !background,
                homepageURL: homepageURL
            };
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to close the currently opened tab.
     *
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} oldInputValue - The previous value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.background.closeCurrentTab = function (value, oldInputValue) {
        if (value < oldInputValue) {
            var actionData = { actionName: "closeCurrentTab" };
            chrome.runtime.sendMessage(actionData);
        }
    };

    // TODO: Add continuous / long-press browser tab navigation, if needed.
    // TODO: Add browser tab navigation for thumbsticks.

    /**
     *
     * Sends message to the background script to switch to the previous tab.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.background.goToPreviousTab = function (that, value, oldValue) {
        if (value < oldValue && oldValue > that.options.cutoffValue) {
            var actionData = { actionName: "goToPreviousTab" };

            // Send message to the background script to switch to previous tab.
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to switch to the next tab.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.background.goToNextTab = function (that, value, oldValue) {
        if (value < oldValue && oldValue > that.options.cutoffValue) {
            var actionData = { actionName: "goToNextTab" };

            // Send message to the background script to switch to previous tab.
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to open a new window.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} background - Whether the new window should open in background.
     * @param {Integer} oldInputValue - The previous value of the gamepad input.
     * @param {String} homepageURL - The URL for the new window.
     *
     */
    gamepad.inputMapperUtils.background.openNewWindow = function (that, value, background, oldInputValue, homepageURL) {
        if (value < oldInputValue) {
            var actionData = {
                actionName: "openNewWindow",
                active: !background,
                homepageURL: homepageURL
            };
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to close the currently opened window.
     *
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} oldInputValue - The previous value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.background.closeCurrentWindow = function (value, oldInputValue) {
        if (value < oldInputValue) {
            var actionData = { actionName: "closeCurrentWindow" };
            chrome.runtime.sendMessage(actionData);
        }
    };
})(fluid);
