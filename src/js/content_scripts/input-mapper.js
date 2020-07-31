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
            "onCreate.restoreFocus": "{that}.restoreFocus",
            "onCreate.updateControls": "{that}.updateControls"
        },
        invokers: {
            restoreFocus: {
                funcName: "gamepad.inputMapper.restoreFocus",
                args: ["{that}.options.windowObject", "{that}.tabindexSortFilter"]
            },
            updateControls: {
                funcName: "gamepad.inputMapper.updateControls",
                args: ["{that}"]
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
            },
            goToPreviousWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToPreviousWindow", "{arguments}.0", "{arguments}.4"]
            },
            goToNextWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToNextWindow", "{arguments}.0", "{arguments}.4"]
            },
            zoomIn: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "zoomIn", "{arguments}.0", "{arguments}.4"]
            },
            zoomOut: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "zoomOut", "{arguments}.0", "{arguments}.4"]
            },
            thumbstickZoom: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickZoom",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            maximizeWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "maximizeWindow", "{arguments}.0", "{arguments}.4"]
            },
            restoreWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "restoreWindowSize", "{arguments}.0", "{arguments}.4"]
            },
            thumbstickWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickWindowSize",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            reopenTabOrWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "reopenTabOrWindow", "{arguments}.0", "{arguments}.4"]
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

    /**
     *
     * Tracks the page/window visibility state and calls the inputMapper instance manager
     * accordingly.
     *
     * @param {Function} inputMapperManager - The function that handles the instance of
     *                                        the inputMapper component.
     *
     */
    gamepad.visibilityChangeTracker = (function (windowObject) {
        // Assume that the page isn't focused initially.
        var inView = false;
        return function (inputMapperManager) {
            // Track changes to the focus/visibility of the window object.
            windowObject.onfocus = windowObject.onblur = windowObject.onpageshow = windowObject.onpagehide = function (event) {
                /**
                 * Call the inputMapper instance manager according to the visibility
                 * status of the page/window and update the inView value.
                 */
                if (event.type === "focus" || event.type === "pageshow") {
                    /**
                     * Call the inputMapper instance manager with the "visible" status if
                     * the page/window is focused back after switching or when page loads
                     * (using inView to verify).
                     */
                    if (!inView) {
                        inputMapperManager("visible");
                        inView = true;
                    }
                }
                else if (inView) {
                    /**
                     * Otherwise, call the inputMapper instance manager with the "hidden"
                     * status when the focus/visibility of current window/tab is moved to
                     * some other window/tab.
                     */
                    inputMapperManager("hidden");
                    inView = false;
                }
            };
        };
    })(window);

    /**
     *
     * Manages the inputMapper instance according to the visibility status of the
     * tab/window.
     *
     * @param {String} visibilityStatus - The visibility status of the tab/window.
     *
     */
    gamepad.inputMapperManager = (function () {
        var inputMapperInstance = null;

        return function (visibilityStatus) {
            /**
             * Create an instance of the inputMapper when the tab/window is focused
             * again and start reading gamepad inputs (if any gamepad is connected).
             */
            if (visibilityStatus === "visible") {
                // Obtain the saved configuration of the gamepad.
                inputMapperInstance = gamepad.inputMapper();
                inputMapperInstance.events.onGamepadConnected.fire();
            }
            else if (visibilityStatus === "hidden" && inputMapperInstance !== null) {
                /**
                 * Destroy the instance of the inputMapper in the current tab when another
                 * window/tab is focused or opened.
                 */
                inputMapperInstance.destroy();
            }
        };
    })();

    /**
     *
     * Update the gamepad configuration if a custom configuration is available.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.updateControls = function (that) {
        chrome.storage.local.get(["gamepadConfiguration"], function (configWrapper) {
            var gamepadConfig = configWrapper.gamepadConfiguration;

            // Update the gamepad configuration only if it's available.
            if (gamepadConfig) {
                that.applier.change("map", gamepadConfig);
            }
        });
    };

    gamepad.visibilityChangeTracker(gamepad.inputMapperManager);
})(fluid, jQuery);
