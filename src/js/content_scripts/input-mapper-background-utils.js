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
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} background - Whether the new tab should open in background.
     *
     */
    gamepad.inputMapperUtils.background.openNewTab = function (that, value, background) {
        if (value > that.options.cutoffValue) {
            var actionData = { actionName: "openNewTab", active: !background };
            chrome.runtime.sendMessage(actionData);
        }
    };

    /**
     *
     * Sends message to the background script to close the currently opened tab.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.background.closeCurrentTab = function (that, value) {
        if (value > that.options.cutoffValue) {
            var actionData = { actionName: "closeCurrentTab" };
            chrome.runtime.sendMessage(actionData);
        }
    };
})(fluid);
