/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* eslint-env browser */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.gamepadNavigator", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            index: null,
            axes: [],
            buttons: []
        },
        listeners: {
            "onCreate.gamepadListener": "{that}.gamepadListener"
        },
        frequency: 100,
        connectivityIntervalReference: null,
        invokers: {
            gamepadListener: {
                funcName: "gamepad.gamepadNavigator.gamepadListener",
                args: ["{that}"]
            },
            transformArrayToObject: {
                funcName: "gamepad.gamepadNavigator.arrayToObject",
                args: ["{arguments}.0"]
            }
        }
    });

    /**
     *
     * Listens to the connected and disconnected events of the gamepad and updates the
     * gamepad navigator component's model according to the state of the gamepad.
     *
     * @param {Object} that - The gamepad navigator component.
     *
     */
    gamepad.gamepadNavigator.gamepadListener = function (that) {
        // When a gamepad is connected
        window.addEventListener("gamepadconnected", function () {
            // Store the gamepad info if no other gamepad is already connected.
            if (!fluid.isValue(that.model.index)) {
                // Scan the state of gamepad frequently.
                that.options.connectivityIntervalReference = setInterval(function () {
                    // Catch the current state of gamepad.
                    var connectedGamepad = navigator.getGamepads()[0];

                    // Initiate the gamepad navigator model transaction.
                    var modelUpdateTransaction = that.applier.initiate();

                    modelUpdateTransaction.fireChangeRequest({ path: "index", value: connectedGamepad.index });
                    modelUpdateTransaction.fireChangeRequest({ path: "axes", value: that.transformArrayToObject(connectedGamepad.axes) });
                    modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: that.transformArrayToObject(connectedGamepad.buttons) });

                    // Commit the current state of gamepad.
                    modelUpdateTransaction.commit();
                }, that.options.frequency);
            }
        });

        // When gamepad is disconnected
        window.addEventListener("gamepaddisconnected", function (event) {
            // Ensure that the gamepad navigator doesn't break if any other gamepad is disconnected.
            if (that.model.index === event.gamepad.index) {
                // Stop the interval loop scanning the gamepad state.
                clearInterval(that.options.connectivityIntervalReference);

                // Restore the gamepad navigator model to its initial state.
                var modelUpdateTransaction = that.applier.initiate();

                modelUpdateTransaction.fireChangeRequest({ path: "index", value: null });
                modelUpdateTransaction.fireChangeRequest({ path: "axes", value: [] });
                modelUpdateTransaction.fireChangeRequest({ path: "buttons", value: [] });

                // Commit the initial model.
                modelUpdateTransaction.commit();
            }
        });
    };

    /**
     *
     * Converts the input array into an object with the keys as the index of the
     * corresponding element.
     *
     * @param {Array} array - The buttons and axes array to be converted into an object.
     * @return {Object} outputObject - The transformed object.
     *
     */
    gamepad.gamepadNavigator.arrayToObject = function (array) {
        var outputObject = {};
        fluid.each(array, function (inputData, index) {
            /**
             * Button data is stored as an array of objects whereas axes data is stored
             * as an array of floating numbers. To obtain the primary values, we need to
             * access both differently.
             */
            outputObject[index] = fluid.isPrimitive(inputData) ? inputData : inputData.value;
        });
        return outputObject;
    };

    // Create an instance of the gamepad navigator.
    gamepad.gamepadNavigator();
})(fluid);
