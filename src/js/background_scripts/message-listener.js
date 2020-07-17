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

    fluid.registerNamespace("gamepad.messageListener");
    fluid.registerNamespace("gamepad.messageListenerUtils");

    fluid.defaults("gamepad.messageListener", {
        gradeNames: ["fluid.component"],
        listeners: {
            onCreate: "{that}.addListener"
        },
        invokers: {
            addListener: {
                "this": "chrome.runtime.onMessage",
                method: "addListener",
                args: ["{that}.actionExecutor"]
            },
            actionExecutor: {
                funcName: "gamepad.messageListener.actionExecutor",
                args: ["{that}", "{arguments}.0"]
            },
            openNewTab: {
                funcName: "gamepad.messageListenerUtils.openNewTab",
                args: ["{arguments}.2", "{arguments}.3"]
            },
            closeCurrentTab: {
                "this": "chrome.tabs",
                method: "remove",
                args: ["{arguments}.0"]
            },
            goToPreviousTab: {
                funcName: "gamepad.messageListenerUtils.switchTab",
                args: ["previousTab"]
            },
            goToNextTab: {
                funcName: "gamepad.messageListenerUtils.switchTab",
                args: ["nextTab"]
            },
            openNewWindow: {
                funcName: "gamepad.messageListenerUtils.openNewWindow",
                args: ["{arguments}.2", "{arguments}.3"]
            },
            closeCurrentWindow: "gamepad.messageListenerUtils.closeCurrentWindow",
            goToPreviousWindow: {
                funcName: "gamepad.messageListenerUtils.switchWindow",
                args: ["previousWindow"]
            },
            goToNextWindow: {
                funcName: "gamepad.messageListenerUtils.switchWindow",
                args: ["nextWindow"]
            }
        }
    });

    /**
     *
     * Calls the invoker methods according to the message is recieved from the content
     * script.
     *
     * @param {Object} that - The messageListener component.
     * @param {Object} actionData - The message object recieved from the content scripts.
     *
     */
    gamepad.messageListener.actionExecutor = function (that, actionData) {
        // Execute the actions only if the action data is available.
        if (fluid.get(actionData, "actionName")) {
            var action = fluid.get(that, actionData.actionName);

            // Trigger the action only if a valid action is found.
            if (action) {
                var invert = fluid.get(actionData, "invert"),
                    active = fluid.get(actionData, "active"),
                    homepageURL = fluid.get(actionData, "homepageURL");
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    action(tabs[0].id, invert, active, homepageURL);
                });
            }
        }
    };
})(fluid);
