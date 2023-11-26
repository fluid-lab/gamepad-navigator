/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, jqUnit */

(function (fluid, $) {
    "use strict";

    $(document).ready(function () {

        fluid.registerNamespace("gamepad.tests");

        var counter;
        var windowMock;
        jqUnit.module("Gamepad Navigator Arrow Tests", {
            setup: function () {
                counter = gamepad.tests.utils.arrows.counter("body");
                windowMock = gamepad.test.window();

            },
            teardown: function () {
                counter.destroy();
                windowMock.destroy();
            }
        });

        var arrowButtons = {
            12: "ArrowUp",
            13: "ArrowDown",
            14: "ArrowLeft",
            15: "ArrowRight"
        };

        fluid.each(arrowButtons, function (keyCode, button) {
            jqUnit.test("Arrow button tests: " + keyCode, function () {
                counter.focus();
                var inputMapper = gamepad.tests.arrows.buttonInputMapper({
                    windowObject: windowMock
                });

                inputMapper.pollGamepads();
                var initialKeydownValue = fluid.get(counter, ["model", "eventCount", "keydown", keyCode ]);
                jqUnit.assertUndefined("There should be no initial keydown counter value for " + keyCode, initialKeydownValue);

                var initialKeyupValue = fluid.get(counter, ["model", "eventCount", "keyup", keyCode ]);
                jqUnit.assertUndefined("There should be no initial keyup counter value for " + keyCode, initialKeyupValue);

                windowMock.applier.change(["gamepads", "0", "buttons", button], 1);
                inputMapper.pollGamepads();

                var updatedKeydownValue = fluid.get(counter, ["model", "eventCount", "keydown", keyCode ]);
                jqUnit.assertEquals("The keydown counter value should have been updated for " + keyCode, 1, updatedKeydownValue);

                var updatedKeyupValue = fluid.get(counter, ["model", "eventCount", "keyup", keyCode ]);
                jqUnit.assertEquals("The keydown counter value should have been updated for " + keyCode, 1, updatedKeyupValue);

                inputMapper.destroy();
            });
        });

        var axisTestDefs = {
            "Horizontal Axis": {
                invert: false,
                axis: 0,
                negativeKey: "ArrowLeft",
                positiveKey: "ArrowRight"
            },
            "Inverted Horizontal Axis": {
                invert: true,
                axis: 0,
                negativeKey: "ArrowRight",
                positiveKey: "ArrowLeft"
            },
            "Vertical Axis": {
                invert: false,
                axis: 1,
                negativeKey: "ArrowUp",
                positiveKey: "ArrowDown"
            },
            "Inverted Vertical Axis": {
                invert: true,
                axis: 1,
                negativeKey: "ArrowDown",
                positiveKey: "ArrowUp"
            }
        };

        fluid.each(axisTestDefs, function (testDef, testDefKey) {
            jqUnit.test(testDefKey, function () {
                var negativeModelPath = ["model", "eventCount", "keydown", testDef.negativeKey];
                var positiveModelPath = ["model", "eventCount", "keydown", testDef.positiveKey];

                counter.focus();
                var inputMapper = gamepad.tests.axisInputMapper({
                    windowObject: windowMock,
                    invert: testDef.invert
                });
                inputMapper.pollGamepads();

                var initialNegativeValue = fluid.get(counter, negativeModelPath);
                jqUnit.assertUndefined("There should be no initial keydown counter value for the negative side of the axis.", initialNegativeValue);

                var initialPositiveValue = fluid.get(counter, positiveModelPath);
                jqUnit.assertUndefined("There should be no initial keydown counter value for the positive side of the axis.", initialPositiveValue);

                windowMock.applier.change(["gamepads", "0", "axes", testDef.axis], -1);
                inputMapper.pollGamepads();

                // Because the gamepad is driven by polling, we have to wait at least a polling cycle (50ms * speed factor (1)).
                jqUnit.stop();
                setTimeout(function () {
                    jqUnit.start();
                    var secondNegativeValue = fluid.get(counter, negativeModelPath);
                    jqUnit.assertEquals("An arrow should have been sent from the negative side of the axis.", 1, secondNegativeValue);

                    var secondPositiveValue = fluid.get(counter, positiveModelPath);
                    jqUnit.assertUndefined("An arrow should not have been sent from the positive side of the axis.", secondPositiveValue);

                    jqUnit.stop();
                    setTimeout(function () {
                        jqUnit.start();
                        inputMapper.pollGamepads();
                        var thirdNegativeValue = fluid.get(counter, negativeModelPath);
                        jqUnit.assertEquals("A second arrow should have been sent from the negative side of the axis.", 2, thirdNegativeValue);

                        windowMock.applier.change(["gamepads", "0", "axes", testDef.axis], 1);
                        inputMapper.pollGamepads();

                        jqUnit.stop();
                        setTimeout(function () {
                            jqUnit.start();
                            var finalPositiveValue = fluid.get(counter, positiveModelPath);
                            jqUnit.assertEquals("An arrow should have been sent from the positive side of the axis.", 1, finalPositiveValue);

                            var finalNegativeValue = fluid.get(counter, negativeModelPath);
                            jqUnit.assertEquals("No additional arrows should have been sent from the negative side of the axis.", 2, finalNegativeValue);

                            inputMapper.destroy();

                        }, 50);
                    }, 50);
                }, 50);
            });
        });
    });
})(fluid, jQuery);
