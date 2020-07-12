/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapper.base");
    fluid.registerNamespace("gamepad.inputMapperUtils.content");

    fluid.defaults("gamepad.inputMapper.base", {
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
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Circle on PlayStation controller & B on Xbox controller.
                    "1": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Square on PlayStation controller & X on Xbox controller.
                    "2": {
                        defaultAction: "previousPageInHistory",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Triangle on PlayStation controller & Y on Xbox controller.
                    "3": {
                        defaultAction: "nextPageInHistory",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Left Bumper.
                    "4": {
                        defaultAction: "reverseTab",
                        currentAction: null,
                        speedFactor: 2.5,
                        background: false
                    },
                    // Right Bumper.
                    "5": {
                        defaultAction: "forwardTab",
                        currentAction: null,
                        speedFactor: 2.5,
                        background: false
                    },
                    // Left Trigger.
                    "6": {
                        defaultAction: "scrollLeft",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Right Trigger.
                    "7": {
                        defaultAction: "scrollRight",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Select/Share on PlayStation controller & Back on Xbox controller.
                    "8": {
                        defaultAction: "closeCurrentTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Start/Options on PlayStation controller & Start on Xbox controller.
                    "9": {
                        defaultAction: "openNewTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Left thumbstick button.
                    "10": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Right thumbstick button.
                    "11": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad up direction button.
                    "12": {
                        defaultAction: "scrollUp",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad down direction button.
                    "13": {
                        defaultAction: "scrollDown",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad left direction button.
                    "14": {
                        defaultAction: "goToPreviousTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad right direction button.
                    "15": {
                        defaultAction: "goToNextTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
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
                        defaultAction: "thumbstickHistoryNavigation",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick vertical axis.
                    "3": {
                        defaultAction: "thumbstickTabbing",
                        currentAction: null,
                        speedFactor: 2.5,
                        invert: false
                    }
                }
            },
            commonConfiguration: {
                homepageURL: "https://www.google.com/"
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
                funcName: "gamepad.inputMapper.base.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.base.clearIntervalRecords",
                args: ["{that}.intervalRecords"]
            },
            // TODO: Investigate, identify, and fix tab navigation issues.
            tabindexSortFilter: {
                funcName: "gamepad.inputMapperUtils.content.tabindexSortFilter",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            /**
             * TODO: Add tests for links and other elements that involve navigation
             * between pages.
             */
            click: {
                funcName: "gamepad.inputMapperUtils.content.click",
                args: ["{arguments}.0"]
            },
            previousPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.previousPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            nextPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.nextPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            reverseTab: {
                funcName: "gamepad.inputMapperUtils.content.reverseTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.content.forwardTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.content.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.content.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.content.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.content.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollHorizontally: {
                funcName: "gamepad.inputMapperUtils.content.scrollHorizontally",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollVertically: {
                funcName: "gamepad.inputMapperUtils.content.scrollVertically",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            thumbstickHistoryNavigation: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickHistoryNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            // TODO: Add tests for when the number of tabbable elements changes.
            thumbstickTabbing: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
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
    gamepad.inputMapper.base.produceNavigation = function (that, change) {
        /**
         * Check if input is generated by axis or button and which button/axes was
         * disturbed.
         */
        var inputType = change.path[0],
            index = change.path[1],
            inputValue = change.value,
            oldInputValue = change.oldValue || 0;

        var inputProperties = that.model.map[inputType][index],
            actionLabel = fluid.get(inputProperties, "currentAction") || fluid.get(inputProperties, "defaultAction"),
            homepageURL = that.model.commonConfiguration.homepageURL;

        /**
         * TODO: Modify the action call in such a manner that the action gets triggered
         * when the inputs are released. (To gain shortpress and longpress actions)
         */

        // Execute the actions only if the action label is available.
        if (actionLabel) {
            var action = fluid.get(that, actionLabel);

            // Trigger the action only if a valid function is found.
            if (action) {
                action(
                    inputValue,
                    inputProperties.speedFactor,
                    inputProperties.invert,
                    inputProperties.background,
                    oldInputValue,
                    homepageURL
                );
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
    gamepad.inputMapper.base.clearIntervalRecords = function (records) {
        fluid.each(records, function (record) {
            clearInterval(record);
        });
    };
})(fluid);
