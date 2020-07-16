/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global chrome, ally */

(function (fluid, $) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapper");

    fluid.defaults("gamepad.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        listeners: {
            "onCreate.restoreFocus": "{that}.restoreFocus"
        },
        invokers: {
            restoreFocus: {
                funcName: "gamepad.inputMapper.restoreFocus",
                args: ["{that}.options.windowObject", "{that}.tabindexSortFilter"]
            },
            goToPreviousTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToPreviousTab", "{arguments}.0", "{arguments}.4"]
            },
            goToNextTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToNextTab", "{arguments}.0", "{arguments}.4"]
            },
            closeCurrentTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "closeCurrentTab", "{arguments}.0", "{arguments}.4"]
            },
            openNewTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "openNewTab", "{arguments}.0", "{arguments}.4", "{arguments}.3", "{arguments}.5"]
            },
            openNewWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "openNewWindow", "{arguments}.0", "{arguments}.4", "{arguments}.3", "{arguments}.5"]
            },
            closeCurrentWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "closeCurrentWindow", "{arguments}.0", "{arguments}.4"]
            }
        }
    });

    /**
     *
     * Restore the previously focused element on the webpage after history navigation.
     *
     * @param {Object} windowObject - The inputMapper component's windowObject option.
     * @param {Function} tabindexSortFilter - The filter to be used for sorting elements
     *                                        based on their tabindex value.
     *
     */
    gamepad.inputMapper.restoreFocus = function (windowObject, tabindexSortFilter) {
        $(document).ready(function () {
            /**
             * Get the index of the previously focused element stored in the local
             * storage.
             */
            var pageAddress = windowObject.location.href;
            chrome.storage.local.get([pageAddress], function (resultObject) {
                // Focus only if some element was focused before the history navigation.
                var activeElementIndex = resultObject[pageAddress];
                if (activeElementIndex && activeElementIndex !== -1) {
                    var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(tabindexSortFilter),
                        activeElement = tabbableElements[activeElementIndex];
                    if (activeElement) {
                        activeElement.focus();
                    }

                    // Clear the stored index of the active element after usage.
                    chrome.storage.local.remove([pageAddress]);
                }
            });
        });
    };

    // Create an instance of the inputMapper when a new page is opened.
    gamepad.inputMapperInstance = null;
    gamepad.inputMapperInstance = gamepad.inputMapper();

    /**
     * Restore or destroy the instance of the inputMapper when the visibility of current
     * window/tab is changed.
     */
    document.addEventListener("visibilitychange", function () {
        var isDestroyed = fluid.isDestroyed(gamepad.inputMapperInstance);
        if (document.visibilityState === "visible" && isDestroyed) {
            /**
             * Create an instance of the inputMapper when the tab/window is focused
             * again and start reading gamepad inputs (if any gamepad is connected).
             */
            gamepad.inputMapperInstance = gamepad.inputMapper();
            gamepad.inputMapperInstance.events.onGamepadConnected.fire();
        }
        else if (document.visibilityState === "hidden" && !isDestroyed) {
            /**
             * Destroy the instance of the inputMapper in the current tab when another
             * window/tab is focused or opened.
             */
            gamepad.inputMapperInstance.destroy();
        }
    });
})(fluid, jQuery);
