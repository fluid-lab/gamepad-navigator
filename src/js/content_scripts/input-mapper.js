/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global ally, chrome */

(function (fluid, $) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapperUtils");

    fluid.defaults("gamepad.inputMapper", {
        gradeNames: ["gamepad.navigator"],
        model: {
            // TODO: Make functions used in axes to be reusable for analogue buttons.
            map: {
                buttons: {
                    // Face Button.
                    // Cross on PlayStation controller & A on Xbox controller.
                    "0": {
                        defaultAction: "click",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Circle on PlayStation controller & B on Xbox controller.
                    "1": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Square on PlayStation controller & X on Xbox controller.
                    "2": {
                        defaultAction: "previousPageInHistory",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Face Button.
                    // Triangle on PlayStation controller & Y on Xbox controller.
                    "3": {
                        defaultAction: "nextPageInHistory",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Left Bumper.
                    "4": {
                        defaultAction: "reverseTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    // Right Bumper.
                    "5": {
                        defaultAction: "forwardTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    // Left Trigger.
                    "6": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Right Trigger.
                    "7": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Select/Share on PlayStation controller & Back on Xbox controller.
                    "8": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Start/Options on PlayStation controller & Start on Xbox controller.
                    "9": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Left thumbstick button.
                    "10": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Right thumbstick button.
                    "11": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad up direction button.
                    "12": {
                        defaultAction: "scrollUp",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad down direction button.
                    "13": {
                        defaultAction: "scrollDown",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad left direction button.
                    "14": {
                        defaultAction: "scrollLeft",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // D-Pad right direction button.
                    "15": {
                        defaultAction: "scrollRight",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Badge icon
                    // PS button on PlayStation controller & Xbox logo button.
                    // Reserved for launching reconfiguration panel.
                    "16": null,
                    // Reserved for mousepad/touchpad functionality.
                    "17": null
                },
                axes: {
                    // Left thumbstick horizontal axis.
                    "0": {
                        defaultAction: "scrollHorizontally",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Left thumbstick vertical axis.
                    "1": {
                        defaultAction: "scrollVertically",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick horizontal axis.
                    "2": {
                        defaultAction: "thumbstickTabbing",
                        currentAction: null,
                        speedFactor: 2.5,
                        invert: false
                    },
                    // Right thumbstick vertical axis.
                    "3": {
                        defaultAction: "thumbstickHistoryNavigation",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    }
                }
            }
        },
        modelListeners: {
            "axes.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            },
            "buttons.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            }
        },
        listeners: {
            "onCreate.restoreFocusBeforeHistoryNavigation": "{that}.restoreFocusBeforeHistoryNavigation",
            "onDestroy.clearIntervalRecords": "{that}.clearIntervalRecords",
            /**
             * TODO: Adjust the gamepaddisconnected event so that the other gamepad's
             * navigation doesn't break.
             */
            "onGamepadDisconnected.clearIntervalRecords": "{that}.clearIntervalRecords"
        },
        members: {
            intervalRecords: {
                upwardScroll: null,
                downwardScroll: null,
                leftScroll: null,
                rightScroll: null,
                forwardTab: null,
                reverseTab: null
            },
            currentTabIndex: 0
        },
        cutoffValue: 0.20,
        scrollInputMultiplier: 50,
        invokers: {
            produceNavigation: {
                funcName: "gamepad.inputMapper.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.clearIntervalRecords",
                args: ["{that}.intervalRecords"]
            },
            restoreFocusBeforeHistoryNavigation: {
                funcName: "gamepad.inputMapper.restoreFocus",
                args: ["{that}.options.windowObject", "{that}.tabindexSortFilter"]
            },
            /**
             * TODO: Add tests for links and other elements that involve navigation
             * between pages.
             */
            click: {
                funcName: "gamepad.inputMapperUtils.click",
                args: ["{arguments}.0"]
            },
            previousPageInHistory: {
                funcName: "gamepad.inputMapperUtils.previousPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            nextPageInHistory: {
                funcName: "gamepad.inputMapperUtils.nextPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            // TODO: Investigate, identify, and fix tab navigation issues.
            tabindexSortFilter: {
                funcName: "gamepad.inputMapperUtils.tabindexSortFilter",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            reverseTab: {
                funcName: "gamepad.inputMapperUtils.reverseTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.forwardTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollHorizontally: {
                funcName: "gamepad.inputMapperUtils.scrollHorizontally",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollVertically: {
                funcName: "gamepad.inputMapperUtils.scrollVertically",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            // TODO: Add tests for when the number of tabbable elements changes.
            thumbstickTabbing: {
                funcName: "gamepad.inputMapperUtils.thumbstickTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            thumbstickHistoryNavigation: {
                funcName: "gamepad.inputMapperUtils.thumbstickHistoryNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            }
        }
    });

    /**
     *
     * Calls the invoker methods when axes/button is disturbed according to the
     * configured action map to produce a navigation effect.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} change - The recipt for the change in input values.
     *
     */
    gamepad.inputMapper.produceNavigation = function (that, change) {
        /**
         * Check if input is generated by axis or button and which button/axes was
         * disturbed.
         */
        var inputType = change.path[0],
            index = change.path[1],
            inputValue = change.value;

        var inputProperties = that.model.map[inputType][index],
            actionLabel = fluid.get(inputProperties, "currentAction") || fluid.get(inputProperties, "defaultAction");

        // Execute the actions only if the action label is available.
        if (actionLabel) {
            var action = fluid.get(that, actionLabel);

            // Trigger the action only if a valid function is found.
            if (action) {
                // Take into account the third parameter "invert" for actions linked to axes input only.
                if (inputType === "axes") {
                    action(inputValue, inputProperties.speedFactor, inputProperties.invert);
                }
                else {
                    action(inputValue, inputProperties.speedFactor);
                }
            }
        }
    };

    /**
     *
     * A listener for the input mapper component to clear the connectivity interval when
     * the instance of the component is destroyed.
     *
     * @param {Object} records - The interval records object.
     *
     */
    gamepad.inputMapper.clearIntervalRecords = function (records) {
        fluid.each(records, function (record) {
            clearInterval(record);
        });
    };

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
})(fluid, jQuery);
