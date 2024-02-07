/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global ally */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.inputMapper.base", {
        gradeNames: ["gamepad.navigator"],
        members: {
            resizeObserver: false
        },
        model: {
            fullscreen: false,
            pageInView: true,
            prefs: gamepad.prefs.defaults,
            bindings: {}
        },
        modelListeners: {
            "axes.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            },
            "buttons.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            },
            "prefs.controlsOnAllMedia": {
                func: "{that}.updateMediaControls",
                args: [true] // performFullUpdate
            }
        },
        listeners: {
            "onDestroy.clearIntervalRecords": "{that}.clearIntervalRecords",
            "onCreate.startTrackingDOM": {
                funcName: "gamepad.inputMapper.base.startTrackingDOM",
                args: ["{that}"]
            },
            "onDestroy.stopTrackingDOM": "{that}.stopTrackingDOM",
            "onGamepadDisconnected.clearIntervalRecords": "{that}.clearIntervalRecords"
        },
        members: {
            intervalRecords: {},
            currentTabIndex: 0,
            tabbableElements: null,
            mutationObserverInstance: null
        },

        invokers: {
            updateTabbables: {
                funcName: "gamepad.inputMapper.base.updateTabbables",
                args: ["{that}"]
            },
            updateMediaControls: {
                funcName: "gamepad.inputMapper.base.updateMediaControls",
                args: ["{that}", "{arguments}.0"] // performFullUpdate
            },
            produceNavigation: {
                funcName: "gamepad.inputMapper.base.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.base.clearIntervalRecords",
                args: ["{that}"]
            },
            handleDOMMutation: {
                funcName: "gamepad.inputMapper.base.handleDOMMutation",
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

            // Actions are called with actionOptions, inputType, index

            // button actions
            click: {
                funcName: "gamepad.inputMapperUtils.content.click",
                args: ["{that}"]
            },
            previousPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.previousPageInHistory",
                args: ["{that}"]
            },
            nextPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.nextPageInHistory",
                args: ["{that}"]
            },

            tabBackward: {
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            tabForward: {
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
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

            enterFullscreen: {
                funcName: "gamepad.inputMapperUtils.content.enterFullscreen",
                args: ["{that}"]
            },
            exitFullscreen: {
                funcName: "gamepad.inputMapperUtils.content.exitFullscreen",
                args: ["{that}"]
            },

            sendKey: {
                funcName: "gamepad.inputMapperUtils.content.sendKey",
                args: ["{that}", "{arguments}.0"] // actionOptions
            },

            // Thumb stick actions
            thumbstickHistoryNavigation: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickHistoryNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            // TODO: Add tests for when the number of tabbable elements changes.
            thumbstickTabbing: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },

            // Arrow actions for axes
            thumbstickHorizontalArrows: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickArrows",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "ArrowRight", "ArrowLeft"] // actionOptions, inputType, index, forwardKey, backwardKey
            },
            thumbstickVerticalArrows: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickArrows",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "ArrowDown", "ArrowUp"] // actionOptions, inputType, index, forwardKey, backwardKey
            }
        }
    });

    /**
     *
     * Respond when the value of a bound button/axis changes. This function is now the sole arbiter of "discrete" vs.
     * "continuous" actions, and is also the sole enforcer of the "analog cutoff".
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} change - The receipt for the change in input values.
     *
     */
    gamepad.inputMapper.base.produceNavigation = function (that, change) {
        var inputType = change.path[0], // i. e. "button", or "axis"
            index = change.path[1], // i.e. 0, 1, 2
            inputValue = change.value,
            oldInputValue = change.oldValue || 0;

        var binding = fluid.get(that.model, ["bindings", inputType, index]);
        if (binding) {
            var action = fluid.get(binding, "action");
            var actionFn = fluid.get(that, action);

            var actionOptions = fluid.copy(binding);

            // Trigger the action only if a valid function is found.
            if (actionFn) {
                var intervalKey = gamepad.inputMapper.base.getIntervalKey(actionOptions, inputType, index);

                if (that.model.pageInView) {
                    if (action === "openNewTab" || action === "openNewWindow") {
                        actionOptions.newTabOrWindowURL = that.model.prefs.newTabOrWindowURL;
                    }

                    var valueIsAboveCutoff = Math.abs(inputValue) > that.model.prefs.analogCutoff;

                    if (valueIsAboveCutoff) {
                        // In response to the initial "down" event,  perform the action immediately.
                        if (Math.abs(oldInputValue) < that.model.prefs.analogCutoff) {
                            // Always the first time.
                            actionFn(
                                actionOptions,
                                inputType,
                                index
                            );
                        }

                        var repeatRate = fluid.get(actionOptions, "repeatRate") || 0;
                        if (repeatRate) {
                            var repeatRateMs = repeatRate * 1000;
                            // For analog controls that fluctuate, we only want to start polling when they first
                            // cross the analog cutoff threshold.
                            if (!that.intervalRecords[intervalKey]) {
                                that.intervalRecords[intervalKey] = setInterval(
                                    actionFn,
                                    repeatRateMs,
                                    actionOptions, inputType, index
                                );
                            }
                        }
                    }
                    // clear the interval on button release.
                    else {
                        gamepad.inputMapper.base.clearInterval(that, intervalKey);
                    }
                }
                // clear the interval if our page is not in view.
                else {
                    gamepad.inputMapper.base.clearInterval(that, intervalKey);
                }
            }
            else {
                fluid.log(fluid.logLevel.WARN, "Invalid binding for input type " + inputType + ", index " + index + ", no handler found for action '" + action + "'");
            }
        }
    };

    /**
     *
     * A listener for the input mapper component to clear the connectivity interval when
     * the instance of the component is destroyed.
     *
     * @param {Object} that - The component whose interval records need to be cleared.
     *
     */
    gamepad.inputMapper.base.clearIntervalRecords = function (that) {
        fluid.each(that.intervalRecords, function (intervalNumber, intervalKey) {
            clearInterval(intervalNumber);
            delete that.intervalRecords[intervalKey];
        });
    };

    gamepad.inputMapper.base.getIntervalKey = function (actionOptions, inputType, index) {
        var action = fluid.get(actionOptions, "action");
        var intervalKey = [inputType, index, action].join("-");
        return intervalKey;
    };

    gamepad.inputMapper.base.clearInterval = function (that, intervalKey) {
        if (that.intervalRecords[intervalKey]) {
            clearInterval(that.intervalRecords[intervalKey]);
            delete that.intervalRecords[intervalKey];
        }
    };

    gamepad.inputMapper.base.updateTabbables = function (that) {
        var tababbleOptions = { strategy: "strict" };
        if (document.fullscreenElement) {
            tababbleOptions.context = document.fullscreenElement;
        }

        that.tabbableElements = ally.query.tabsequence(tababbleOptions);
    };


    /**
     *
     * A listener to track DOM elements and update the list when the DOM is updated.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.base.startTrackingDOM = function (that) {
        var body = document.querySelector("body"),
            MutationObserver = that.options.windowObject.MutationObserver;

        // Do whatever we need to with the initial DOM before there are changes.
        that.handleDOMMutation();

        // Create an instance of the mutation observer.
        that.mutationObserverInstance = new MutationObserver(that.handleDOMMutation);

        // Specify the mutations to be observed.
        // TODO: We could probably safely remove `characterData`, `attributeOldValue` and `characterDataOldValue` here.
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

    gamepad.inputMapper.base.handleDOMMutation = function (that) {
        that.updateMediaControls();

        gamepad.inputMapper.base.listenForFullscreenChanges(that);

        // Because we need to consider the order of elements, this method can't benefit from any insight into what has
        // changed. Run this after any potential changes that would make media elements "tabbable".
        that.updateTabbables();
    };

    // Ideally we would rather listen for "fullscreenchange", but this is broken under some circumstances.
    // See: https://stackoverflow.com/questions/21103478/fullscreenchange-event-not-firing-in-chrome
    gamepad.inputMapper.base.listenForFullscreenChanges = function (that) {
        if (that.resizeObserver) {
            that.resizeObserver.disconnect();
        }
        else {
            that.resizeObserver = new ResizeObserver(function () {
                var fullscreen = document.fullscreenElement ? true : false;
                that.applier.change("fullscreen", fullscreen);
            });
        }

        var videoElements = document.querySelectorAll("video");

        if (videoElements.length) {
            videoElements.forEach(function (videoElement) {
                that.resizeObserver.observe(videoElement);
            });
        }
    };

    gamepad.inputMapper.base.updateMediaControls = function (that, performFullUpdate) {
        if (that.model.prefs.controlsOnAllMedia) {
            // If we are working based on a change to the DOM, we can just focus on added elements.
            if (!performFullUpdate && that.mutationObserverInstance) {
                fluid.each(that.mutationObserverInstance.takeRecords(), function (mutationRecord) {
                    for (var addedNodeIndex = 0; addedNodeIndex < mutationRecord.addedNodes.length; addedNodeIndex++) {
                        var addedNode = mutationRecord.addedNodes[addedNodeIndex];
                        var isMediaElement = gamepad.inputMapperUtils.content.isMediaElement(addedNode);
                        if (isMediaElement) {
                            addedNode.setAttribute("controls", true);
                        }
                    }
                });
            }
            // Fall back to updating the entire DOM if we're not yet working with a mutation observer.
            else {
                gamepad.inputMapper.base.enableControls();
            }
        }
        else if (performFullUpdate) {
            gamepad.inputMapper.base.disableControls();
        }
    };

    gamepad.inputMapper.base.enableControls = function () {
        var mediaElements = document.querySelectorAll("video,audio");

        for (var mediaElementIndex = 0; mediaElementIndex < mediaElements.length; mediaElementIndex++) {
            var mediaElementToEnable = mediaElements[mediaElementIndex];
            if (!mediaElementToEnable.hasAttribute("controls")) {
                mediaElementToEnable.setAttribute("controls-off-by-default", true);
                mediaElementToEnable.setAttribute("controls", true);
            }
        }
    };

    gamepad.inputMapper.base.disableControls = function () {
        var mediaElements = document.querySelectorAll("video,audio");
        for (var mediaElementIndex = 0; mediaElementIndex < mediaElements.length; mediaElementIndex++) {
            var mediaElement = mediaElements[mediaElementIndex];
            if (mediaElement.hasAttribute("controls-off-by-default")) {
                mediaElement.removeAttribute("controls");
                mediaElement.removeAttribute("controls-off-by-default");
            }
        }
    };

    gamepad.inputMapper.base.vibrate = function (that) {
        if (that.model.prefs.vibrate) {
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
        }
    };
})(fluid);
