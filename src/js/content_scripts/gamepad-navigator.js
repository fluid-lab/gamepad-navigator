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

    // TODO: Add tests to detect extension errors.
    fluid.defaults("gamepad.navigator", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            connected: false,
            axes: [],
            buttons: []
        },
        events: {
            onGamepadConnected: null,
            onGamepadDisconnected: null
        },
        listeners: {
            onCreate: "{that}.attachListener",
            onGamepadConnected: "{that}.onConnected",
            onGamepadDisconnected: "{that}.onDisconnected",
            "onDestroy.clearConnectivityInterval": "{that}.clearConnectivityInterval"
        },
        windowObject: window,
        frequency: 50,
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
     * Handles the various connected gamepads and reads data from all the gamepads to get
     * a combined feedback.
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.navigator.onConnected = function (that) {
        // Store the gamepad info if no other gamepad is already connected.
        if (!that.model.connected) {
            // Scan the state of gamepad frequently.
            that.connectivityIntervalReference = setInterval(function () {
                // Retrieve the list of gamepads.
                var gamepadsList = navigator.getGamepads(),
                    combinedGamepadData = {
                        connected: false,
                        axes: {},
                        buttons: {}
                    };

                // Combine the inputs from all the gamepads.
                for (var index = 0; index < gamepadsList.length; index++) {
                    // Look for the gamepad data if it is connected.
                    if (gamepadsList[index]) {
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

                /**
                 * If at least one gamepad is available then update the component's model
                 * as per the combined inputs.
                 */
                if (combinedGamepadData.connected) {
                    // Initiate the gamepad navigator model transaction.
                    var modelUpdateTransaction = that.applier.initiate();

                    modelUpdateTransaction.fireChangeRequest({ path: "connected", value: combinedGamepadData.connected });
                    modelUpdateTransaction.fireChangeRequest({ path: "axes", value: combinedGamepadData.axes });
                    modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: combinedGamepadData.buttons });

                    // Commit the current state of gamepad.
                    modelUpdateTransaction.commit();
                }
            }, that.options.frequency);
        }
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
        // Stop the interval loop scanning the gamepad state.
        clearInterval(that.connectivityIntervalReference);

        // Assume by default that no other gamepad is connected/available.
        var isGamepadAvailable = false;

        // Check if any other gamepad is already connected.
        for (var index = 0; index < navigator.getGamepads().length; index++) {
            if (navigator.getGamepads()[index] !== null) {
                isGamepadAvailable = true;
            }
        }

        /**
         * Fire the "onGamepadConnected" event of the component to maintain
         * connection to other gamepads if available. Otherwise, restore the
         * component's model to its initial state.
         */
        var modelUpdateTransaction = that.applier.initiate();
        modelUpdateTransaction.fireChangeRequest({ path: "connected", value: false });
        if (isGamepadAvailable) {
            /**
             * Commit the connected state as false for the onGamepadConnected event to
             * work.
             */
            modelUpdateTransaction.commit();
            that.events.onGamepadConnected.fire();
        }
        else {
            modelUpdateTransaction.fireChangeRequest({ path: "axes", value: [] });
            modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: [] });

            // Commit the initial model.
            modelUpdateTransaction.commit();
        }
    };
})(fluid);
