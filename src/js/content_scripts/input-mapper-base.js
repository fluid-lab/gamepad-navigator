/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global ally */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.configMaps");
    fluid.registerNamespace("gamepad.inputMapper.base");
    fluid.registerNamespace("gamepad.inputMapperUtils.content");

    fluid.defaults("gamepad.inputMapper.base", {
        gradeNames: ["gamepad.configMaps", "gamepad.navigator"],
        model: {
            pageInView: true
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
            "onCreate.trackDOM": "{that}.trackDOM",
            "onDestroy.stopTrackingDOM": "{that}.stopTrackingDOM",
            /**
             * TODO: Adjust the gamepaddisconnected event so that the other gamepad's
             * navigation doesn't break.
             */
            "onGamepadDisconnected.clearIntervalRecords": "{that}.clearIntervalRecords"
        },
        members: {
            /**
             * TODO: Move the member variables used for the inter-navigation web page
             * features to the "inputMapper" component.
             */
            intervalRecords: {
                upwardScroll: null,
                downwardScroll: null,
                leftScroll: null,
                rightScroll: null,
                forwardTab: null,
                reverseTab: null,
                zoomIn: null,
                zoomOut: null,
                ArrowLeft: null,
                ArrowRight: null,
                ArrowUp: null,
                ArrowDown: null
            },
            currentTabIndex: 0,
            tabbableElements: null,
            mutationObserverInstance: null
        },
        // TODO: Make this configurable.
        // "Jitter" cutoff Value for analog thumb sticks.
        cutoffValue: 0.40,
        scrollInputMultiplier: 50,
        invokers: {
            updateTabbables: {
                funcName: "gamepad.inputMapper.base.updateTabbables",
                args: ["{that}"]
            },
            produceNavigation: {
                funcName: "gamepad.inputMapper.base.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.base.clearIntervalRecords",
                args: ["{that}.intervalRecords"]
            },
            trackDOM: {
                funcName: "gamepad.inputMapper.base.trackDOM",
                args: ["{that}"]
            },
            stopTrackingDOM: {
                "this": "{that}.mutationObserverInstance",
                method: "disconnect"
            },
            vibrate: {
                funcName: "gamepad.inputMapper.base.vibrate",
                args: ["{that}"]
            },

            // Actions are called with value, oldValue, actionOptions
            click: {
                funcName: "gamepad.inputMapperUtils.content.click",
                args: ["{that}", "{arguments}.0"]
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
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "reverseTab"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "forwardTab"]
            },

            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.content.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.content.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.content.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.content.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
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
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            // Arrow actions for buttons
            sendArrowLeft: {
                funcName: "gamepad.inputMapperUtils.content.sendKey",
                args: ["{that}", "{arguments}.0", "ArrowLeft"] // value, key
            },
            sendArrowRight: {
                funcName: "gamepad.inputMapperUtils.content.sendKey",
                args: ["{that}", "{arguments}.0", "ArrowRight"] // value, key
            },
            sendArrowUp: {
                funcName: "gamepad.inputMapperUtils.content.sendKey",
                args: ["{that}", "{arguments}.0", "ArrowUp"] // value, key
            },
            sendArrowDown: {
                funcName: "gamepad.inputMapperUtils.content.sendKey",
                args: ["{that}", "{arguments}.0", "ArrowDown"] // value, key
            },
            // Arrow actions for axes
            thumbstickHorizontalArrows: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickArrows",
                args: ["{that}", "{arguments}.0", "{arguments}.2", "ArrowRight", "ArrowLeft"] // value, actionOptions, forwardKey, backwardKey
            },
            thumbstickVerticalArrows: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickArrows",
                args: ["{that}", "{arguments}.0", "{arguments}.2", "ArrowDown", "ArrowUp"] // value, actionOptions, forwardKey, backwardKey
            }
        }
    });

    /**
     * TODO: Replace the "inputMapper" with "inputMapper.base" in the JSDoc comments for
     * the invokers of "inputMapper.base" component.
     */

    /**
     *
     * Calls the invoker methods when axes/button is disturbed according to the
     * configured action map to produce a navigation effect.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} change - The receipt for the change in input values.
     *
     */
    gamepad.inputMapper.base.produceNavigation = function (that, change) {
        // Only respond to gamepad input if we are "in view".
        if (that.model.pageInView) {
            /**
             * Check if input is generated by axis or button and which button/axes was
             * disturbed.
             */
            var inputType = change.path[0], // i. e. "button", or "axis"
                index = change.path[1], // i.e. 0, 1, 2
                inputValue = change.value,
                oldInputValue = change.oldValue || 0;

            // Look for a binding at map.axis.0, map.button.1, et cetera.
            var binding = that.model.map[inputType][index];
            // TODO: See how/whether we ever fail over using this structure.
            var actionLabel = fluid.get(binding, "currentAction") || fluid.get(binding, "defaultAction");

            /**
             * TODO: Modify the action call in such a manner that the action gets triggered
             * when the inputs are released.
             * (To gain shortpress and longpress actions)
             *
             * Refer:
             * https://github.com/fluid-lab/gamepad-navigator/pull/21#discussion_r453507050
             */

            // Execute the actions only if the action label is available.
            if (actionLabel) {
                var action = fluid.get(that, actionLabel);

                // Trigger the action only if a valid function is found.
                if (action) {
                    var actionOptions = fluid.copy(binding);
                    actionOptions.homepageURL = that.model.commonConfiguration.homepageURL;

                    action(
                        inputValue,
                        oldInputValue,
                        actionOptions
                    );
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
    gamepad.inputMapper.base.clearIntervalRecords = function (records) {
        fluid.each(records, function (record) {
            clearInterval(record);
        });
    };

    gamepad.inputMapper.base.updateTabbables = function (that) {
        that.tabbableElements = ally.query.tabsequence({ strategy: "strict" });
    };


    /**
     *
     * A listener to track DOM elements and update the list when the DOM is updated.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.base.trackDOM = function (that) {
        var body = document.querySelector("body"),
            MutationObserver = that.options.windowObject.MutationObserver;

        // Record the tabbable elements when the component is created.
        that.updateTabbables();

        // Create an instance of the mutation observer.
        that.mutationObserverInstance = new MutationObserver(that.updateTabbables);

        // Specify the mutations to be observed.
        var observerConfiguration = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        };

        // Start observing the DOM mutations.
        that.mutationObserverInstance.observe(body, observerConfiguration);
    };


    gamepad.inputMapper.base.vibrate = function (that) {
        // TODO: Make this configurable, and/or make more than one vibration.

        var gamepads = that.options.windowObject.navigator.getGamepads();
        var nonNullGamepads = gamepads.filter(function (gamepad) { return gamepad !== null; });

        fluid.each(nonNullGamepads, function (gamepad) {
            if (gamepad.vibrationActuator) {
                gamepad.vibrationActuator.playEffect(
                    "dual-rumble",
                    {
                        duration: 250,
                        startDelay: 0,
                        strongMagnitude: 0.25,
                        weakMagnitude: .75
                    }
                );
            }
        });
    };
})(fluid);
