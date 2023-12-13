/*
Copyright (c) 2023 The Gamepad Navigator Authors
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

    // TODO: Add tests to detect extension errors.
    fluid.defaults("gamepad.navigator", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            connected: false,
            axes: {},
            buttons: {},
            prefs: {
                pollingFrequency: 50
            }
        },
        events: {
            onGamepadConnected: null,
            onGamepadDisconnected: null
        },
        listeners: {
            onCreate: "{that}.attachListener",
            onGamepadConnected: "{that}.onConnected",
            "onGamepadDisconnected.handleConnectedGamepads": "{that}.onDisconnected",
            "onDestroy.clearConnectivityInterval": "{that}.clearConnectivityInterval"
        },
        modelListeners: {
            "prefs.pollingFrequency": {
                funcName: "gamepad.navigator.setGamepadPollingInterval",
                args: ["{that}"]
            },
            "connected": {
                funcName: "gamepad.navigator.setGamepadPollingInterval",
                args: ["{that}"]
            }
        },
        windowObject: window,
        members: {
            connectivityIntervalReference: null
        },
        invokers: {
            attachListener: {
                funcName: "gamepad.navigator.attachListener",
                args: ["{that}"]
            },
            onConnected: {
                funcName: "gamepad.navigator.onConnected",
                args: ["{that}"]
            },
            pollGamepads: {
                funcName: "gamepad.navigator.pollGamepads",
                args: ["{that}"]
            },
            onDisconnected: {
                funcName: "gamepad.navigator.onDisconnected",
                args: ["{that}"]
            },
            clearConnectivityInterval: {
                funcName: "clearInterval",
                args: ["{that}.connectivityIntervalReference"]
            }
        }
    });

    /**
     *
     * Attaches a event listener to the gamepad events which fire the gamepad navigator
     * component's events on being triggered.
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.navigator.attachListener = function (that) {
        // When a gamepad is connected
        that.options.windowObject.addEventListener("gamepadconnected", function () {
            that.events.onGamepadConnected.fire();
        });

        // When gamepad is disconnected
        that.options.windowObject.addEventListener("gamepaddisconnected", function () {
            that.events.onGamepadDisconnected.fire();
        });
    };

    /**
     *
     * A listener for the gamepad navigator component's event "onGamepadConnected".
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.navigator.onConnected = function (that) {
        that.applier.change("connected", true);
    };

    gamepad.navigator.setGamepadPollingInterval = function (that) {
        clearInterval(that.connectivityIntervalReference);

        if (that.model.connected) {
            var pollingFrequency = fluid.get(that.model, "prefs.pollingFrequency") || 50;

            // Poll the state of all connected gamepads.
            that.connectivityIntervalReference = setInterval(that.pollGamepads, pollingFrequency);
        }
    };

    /**
     *
     * Handles the various connected gamepads and reads data from all the gamepads to get
     * a combined feedback.
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.navigator.pollGamepads = function (that) {
        // Retrieve the list of gamepads.
        var gamepadsList = that.options.windowObject.navigator.getGamepads(),
            combinedGamepadData = {
                connected: false,
                axes: {},
                buttons: {}
            };

        // Combine the inputs from all the gamepads.
        for (var index = 0; index < gamepadsList.length; index++) {
            var singleGamepad = gamepadsList[index];
            if (singleGamepad) {
                var connected = fluid.get(singleGamepad, "connected") || false;
                if (connected) {
                    // Set the connected status to true if any gamepad is available.
                    combinedGamepadData.connected = true;

                    // Combine the axes values from the gamepad currently scanned.
                    fluid.each(gamepadsList[index].axes, function (axesValue, axesIndex) {
                        if (!combinedGamepadData.axes[axesIndex]) {
                            combinedGamepadData.axes[axesIndex] = 0;
                        }
                        combinedGamepadData.axes[axesIndex] += axesValue;
                    });

                    // Combine the button values from the gamepad currently scanned.
                    fluid.each(gamepadsList[index].buttons, function (buttonObject, buttonIndex) {
                        if (!combinedGamepadData.buttons[buttonIndex]) {
                            combinedGamepadData.buttons[buttonIndex] = 0;
                        }
                        combinedGamepadData.buttons[buttonIndex] += buttonObject.value;
                    });
                }
            }
        }

        var modelUpdateTransaction = that.applier.initiate();
        modelUpdateTransaction.fireChangeRequest({ path: "connected", value: combinedGamepadData.connected });

        if (combinedGamepadData.connected) {
            modelUpdateTransaction.fireChangeRequest({ path: "axes", value: combinedGamepadData.axes });
            modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: combinedGamepadData.buttons });
        }

        modelUpdateTransaction.commit();
    };

    /**
     *
     * A listener for the gamepad navigator component's event "onGamepadDisconnected".
     * Handles the gamepads and fires the component's "onGamepadConnected" event if it
     * finds any other connected gamepad after a gamepad is disconnected.
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.navigator.onDisconnected = function (that) {
        // Assume by default that no other gamepad is connected/available.
        var isGamepadAvailable = false;

        // Check if any other gamepad is already connected.
        for (var index = 0; index < that.options.windowObject.navigator.getGamepads().length; index++) {
            var singleGamepad = that.options.windowObject.navigator.getGamepads()[index];
            if ( singleGamepad !== null && singleGamepad.connected) {
                isGamepadAvailable = true;
            }
        }

        /**
         * Fire the "onGamepadConnected" event of the component to maintain
         * connection to other gamepads if available. Otherwise, restore the
         * component's model to its initial state.
         */
        var modelUpdateTransaction = that.applier.initiate();

        modelUpdateTransaction.fireChangeRequest({ path: "connected", value: isGamepadAvailable });

        if (!isGamepadAvailable) {
            modelUpdateTransaction.fireChangeRequest({ path: "axes", type: "DELETE" });
            modelUpdateTransaction.fireChangeRequest({ path: "axes", value: {} });
            modelUpdateTransaction.fireChangeRequest({ path: "buttons", type: "DELETE" });
            modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: {} });
        }

        modelUpdateTransaction.commit();
    };
})(fluid);
