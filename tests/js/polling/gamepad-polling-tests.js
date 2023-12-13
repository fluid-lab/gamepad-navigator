/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
/* global jqUnit */
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.test.repeatRate.navigator", {
        gradeNames: ["gamepad.navigator"]
    });

    var navigator;
    var windowMock;
    jqUnit.module("Gamepad Navigator Gamepad Polling Tests", {
        setup: function () {
            windowMock = gamepad.test.window();
            navigator = gamepad.test.repeatRate.navigator({
                windowObject: windowMock
            });
        }
    });

    jqUnit.test("Polling should not occur when no gamepads are connected.", function () {
        var initialValue = fluid.get(navigator, "model.buttons.0") || 0;
        jqUnit.assertEquals("No button value should have been recorded on startup.", 0, initialValue);

        // Create the enclosing gamepad definition, but flag it as disconnected.
        windowMock.applier.change("gamepads.0", { disconnected: true });
        // Now simulate a button press.
        windowMock.applier.change("gamepads.0.buttons.0", 1);

        jqUnit.stop();
        setTimeout(function () {
            jqUnit.start();

            var updatedValue = fluid.get(navigator, "model.buttons.0") || 0;

            jqUnit.assertEquals("There should still be no button value after several polling cycles have elapsed.", 0, updatedValue);
        }, (navigator.model.prefs.pollingFrequency * 2));
    });

    jqUnit.test("Polling should start when a gamepad is connected.", function () {
        var initialValue = fluid.get(navigator, "model.buttons.0") || 0;
        jqUnit.assertEquals("No button value should have been recorded on startup.", 0, initialValue);

        // Simulate a button press.
        windowMock.applier.change("gamepads.0.buttons.0", 1);
        windowMock.events.gamepadconnected.fire();

        jqUnit.stop();
        setTimeout(function () {
            jqUnit.start();

            var updatedValue = fluid.get(navigator, "model.buttons.0") || 0;

            jqUnit.assertEquals("There should be a button value after several polling cycles have elapsed.", 1, updatedValue);
        }, (navigator.model.prefs.pollingFrequency * 2));
    });

    jqUnit.test("Polling should continue if only some gamepads are disconnected.", function () {
        var initialValue = fluid.get(navigator, "model.buttons.0") || 0;
        jqUnit.assertEquals("No button value should have been recorded on startup.", 0, initialValue);

        // Create a connected gamepad and simulate a button press.
        windowMock.applier.change("gamepads.0.buttons.0", 1);
        windowMock.events.gamepadconnected.fire();

        windowMock.applier.change("gamepads.1.buttons.1", 1);
        windowMock.applier.change("gamepads.1.disconnected", true);

        windowMock.events.gamepaddisconnected.fire();

        jqUnit.stop();
        setTimeout(function () {
            jqUnit.start();

            var updatedValue = fluid.get(navigator, "model.buttons.0") || 0;

            jqUnit.assertEquals("There should be a button value after several polling cycles have elapsed.", 1, updatedValue);
        }, (navigator.model.prefs.pollingFrequency * 2));
    });


    jqUnit.test("Polling should stop when the last gamepad is disconnected.", function () {
        var timeToWait = (navigator.model.prefs.pollingFrequency * 2);
        var initialValue = fluid.get(navigator, "model.buttons.0") || 0;
        jqUnit.assertEquals("No button value should have been recorded on startup.", 0, initialValue);

        // Create a connected gamepad and simulate a button press.
        windowMock.applier.change("gamepads.0.buttons.0", 1);
        windowMock.events.gamepadconnected.fire();

        jqUnit.stop();
        setTimeout(function () {
            jqUnit.start();

            var updatedValue = fluid.get(navigator, "model.buttons.0") || 0;

            jqUnit.assertEquals("There should be a button value after several polling cycles have elapsed.", 1, updatedValue);

            windowMock.applier.change("gamepads.0.disconnected", true);
            windowMock.events.gamepaddisconnected.fire();

            jqUnit.stop();

            setTimeout(function () {
                jqUnit.start();
                var valueAfterDisconnect = fluid.get(navigator, "model.buttons.0") || 0;

                jqUnit.assertEquals("The button value should have been cleared after controller disconnect.", 0, valueAfterDisconnect);
            }, timeToWait);
        }, timeToWait);
    });
})(fluid);
