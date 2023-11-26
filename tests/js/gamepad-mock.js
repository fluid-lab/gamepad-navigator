/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.tests.utils");

    /**
     *
     * Generate a mock of the standard Gamepad object. Optionally, it can take the
     * inputSpec as its parameter. The inputSpec should be in the following formats:
     *
     * {
     *   buttons: { "2": 1 }
     * }
     *
     * The above inputSpec returns a gamepad mock with the value of button 2 set to 1.
     *
     * {
     *   axes: { "1": 0.753 }
     * }
     *
     * The above inputSpec return a gamepad mock with the value of axes 2 set to 0.753.
     *
     * {
     *   buttons: {
     *     "5": 1,
     *     "11": 1
     *   },
     *   axes: { "3": 0.92 }
     * }
     *
     * The above inputSpec returns a gamepad mock with the value of button 5 set to 1,
     * button 11 set to 1, and of axes 3 set to 0.92.
     *
     * @param {Object} inputSpec - (optional) The object containing the desired value for
     *                             the gamepad inputs.
     * @return {Array} - The array containing the mock gamepad mock object.
     *
     */
    gamepad.tests.utils.generateGamepadMock = function (inputSpec) {
        inputSpec = inputSpec || {};
        var buttonsArray = [],
            axesArray = [];

        // Set button input values.
        for (var buttonIndex = 0; buttonIndex < 18; buttonIndex++) {
            var buttonIndexString = buttonIndex.toString(),
                defaultValue = {
                    value: 0,
                    pressed: false
                };
            /**
             * If any button's input value is provided as an argument, use it. Otherwise,
             * set it to the default value of gamepad button.
             */
            if ("buttons" in inputSpec && buttonIndexString in inputSpec.buttons) {
                buttonsArray.push({
                    value: inputSpec.buttons[buttonIndexString],
                    pressed: inputSpec.buttons[buttonIndexString] > 0 ? true : false
                });
            }
            else {
                buttonsArray.push(defaultValue);
            }
        }

        // Set axes input values.
        for (var axesIndex = 0; axesIndex < 4; axesIndex++) {
            var axesIndexString = axesIndex.toString();
            /**
             * If any axes' input value is provided as an argument, use it. Otherwise,
             * set it to the default value of gamepad button.
             */
            if ("axes" in inputSpec && axesIndexString in inputSpec.axes) {
                axesArray.push(inputSpec.axes[axesIndexString]);
            }
            else {
                axesArray.push(0);
            }
        }

        // According to the standard Gamepad specification.
        return [{
            id: "Sony PlayStation 4 Controller Mock",
            index: 0,
            connected: true,
            timestamp: 100,
            axes: axesArray,
            buttons: buttonsArray
        }];
    };
})(fluid);
