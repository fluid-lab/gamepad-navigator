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
    fluid.registerNamespace("gamepad.inputMapperUtils");

    fluid.defaults("gamepad.inputMapper", {
        gradeNames: ["gamepad.navigator"],
        model: {
            map: {
                buttons: {
                    "0": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "1": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "2": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "3": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "4": {
                        defaultAction: "reverseTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    "5": {
                        defaultAction: "forwardTab",
                        currentAction: null,
                        speedFactor: 2.5
                    },
                    "6": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "7": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "8": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "9": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "10": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "11": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1
                    },
                    "12": {
                        defaultAction: "scrollUp",
                        currentAction: null,
                        speedFactor: 1
                    },
                    "13": {
                        defaultAction: "scrollDown",
                        currentAction: null,
                        speedFactor: 1
                    },
                    "14": {
                        defaultAction: "scrollLeft",
                        currentAction: null,
                        speedFactor: 1
                    },
                    "15": {
                        defaultAction: "scrollRight",
                        currentAction: null,
                        speedFactor: 1
                    },
                    // Reserved for launching reconfiguration panel.
                    "16": null
                },
                axes: {
                    "0": {
                        defaultAction: "scrollHorizontally",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    "1": {
                        defaultAction: "scrollVertically",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    "2": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    "3": {
                        defaultAction: "analogTabbing",
                        currentAction: null,
                        speedFactor: 2.5,
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
            "onDestroy.clearIntervalRecords": "{that}.clearIntervalRecords"
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
        invokers: {
            produceNavigation: {
                funcName: "gamepad.inputMapper.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.clearIntervalRecords",
                args: ["{that}.options.members.intervalRecords"]
            },
            scrollHorizontally: {
                funcName: "gamepad.inputMapperUtils.scrollHorizontally",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollVertically: {
                funcName: "gamepad.inputMapperUtils.scrollVertically",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            analogTabbing: {
                funcName: "gamepad.inputMapperUtils.analogTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.forwardTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            reverseTab: {
                funcName: "gamepad.inputMapperUtils.reverseTab",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            tabindexSortFilter: {
                funcName: "gamepad.inputMapperUtils.tabindexSortFilter",
                args: ["{arguments}.0", "{arguments}.1"]
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

        // Execute navigation actions for any input other than button 16 (badge button).
        if (!(inputType === "buttons" && index === "16")) {
            var inputProperties = that.model.map[inputType][index],
                actionLabel = fluid.get(inputProperties, "currentAction") || inputProperties.defaultAction;

            // Execute the actions only if the action label is available.
            if (actionLabel) {
                var action = fluid.get(that, actionLabel);

                // Trigger the action only if a valid function is found.
                if (action) {
                    // Take into account the third parameter "invert" for actions linked to axes input only.
                    (inputType === "axes") ? action(inputValue, inputProperties.speedFactor, inputProperties.invert) : action(inputValue, inputProperties.speedFactor);
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

    gamepad.inputMapper();
})(fluid);
