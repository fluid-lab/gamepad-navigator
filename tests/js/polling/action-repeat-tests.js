/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/
/* global jqUnit */
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");

    jqUnit.module("Gamepad Navigator Repeat Rate Tests");

    // Test instance of mapper with a non-repeating action bound to
    // button/axes 0, and a repeating action bound to button/axes 1.
    fluid.defaults("gamepad.test.repeatRate.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        windowObject: window,
        model: {
            count: 0,
            bindings: {
                axes: { 0: { action: "count" }, 1: { action: "count", repeatRate: 0.3 }},
                buttons: { 0: { action: "count" }, 1: { action: "count", repeatRate: 0.3 }}
            }
        },
        invokers: {
            "count": {
                funcName: "gamepad.test.repeatRate.inputMapper.updateCount",
                args: ["{that}"]
            }
        }
    });

    gamepad.test.repeatRate.inputMapper.updateCount = function (that) {
        var currentCount = that.model.count || 0;
        that.applier.change("count", currentCount + 1);
    };

    fluid.each(["axes", "buttons"], function (inputType) {
        jqUnit.test("Non-repeating actions bound to " + inputType + " should not repeat.", function () {
            var inputMapper = gamepad.test.repeatRate.inputMapper();

            jqUnit.assertEquals("No actions should have been executed on startup.", 0, inputMapper.model.count);

            inputMapper.applier.change([inputType, 0], 1);

            jqUnit.assertEquals("The initial " + inputType + " press should have fired an action.", 1, inputMapper.model.count);

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertEquals("The action should not have been fired again.", 1, inputMapper.model.count);
            }, 500);
        });
    });

    fluid.each(["axes", "buttons"], function (inputType) {
        jqUnit.test("Repeating " + inputType + " actions should repeat.", function () {
            var inputMapper = gamepad.test.repeatRate.inputMapper();

            jqUnit.assertEquals("No actions should have been executed on startup.", 0, inputMapper.model.count);

            inputMapper.applier.change([inputType, 1], 1);

            jqUnit.assertEquals("The initial " + inputType + " press should have fired an action.", 1, inputMapper.model.count);

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertEquals("The action should have been fired again.", 2, inputMapper.model.count);
            }, 500);
        });
    });


    fluid.each(["axes", "buttons"], function (inputType) {
        jqUnit.test("Analog " + inputType + " should work properly with non-repeating actions.", function () {
            var inputMapper = gamepad.test.repeatRate.inputMapper();

            jqUnit.assertEquals("No actions should have been executed on startup.", 0, inputMapper.model.count);

            inputMapper.applier.change([inputType, 0], 1);

            jqUnit.assertEquals("The initial " + inputType + " press should have fired an action.", 1, inputMapper.model.count);

            inputMapper.applier.change([inputType, 0], 0.75);

            jqUnit.assertEquals("A different " + inputType + " value above the threshold should not fire an action.", 1, inputMapper.model.count);

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertEquals("The action should not have repeated.", 1, inputMapper.model.count);
            }, 500);
        });
    });

    fluid.each(["axes", "buttons"], function (inputType) {
        jqUnit.test("Analog " + inputType + " should work properly with repeating actions.", function () {
            var inputMapper = gamepad.test.repeatRate.inputMapper();

            jqUnit.assertEquals("No actions should have been executed on startup.", 0, inputMapper.model.count);

            inputMapper.applier.change([inputType, 1], 1);

            jqUnit.assertEquals("The initial input should have fired an action.", 1, inputMapper.model.count);

            inputMapper.applier.change([inputType, 1], 0.75);

            jqUnit.assertEquals("A different analog value above the threshold should not fire an action.", 1, inputMapper.model.count);

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();

                jqUnit.assertEquals("The action should eventually have been repeated.", 2, inputMapper.model.count);
            }, 500);
        });
    });
})(fluid);
