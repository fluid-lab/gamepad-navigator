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

    fluid.registerNamespace("gamepad.tests.utils.arrows");

    // Custom gamepad navigator component grade for arrow button tests.
    fluid.defaults("gamepad.tests.arrows.buttonInputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        invokers: {
            // Disable polling to reduce the need for timeouts and other async management.
            onConnected: {
                funcName: "fluid.identity"
            }
        },
        model: {
            bindings: {
                buttons: {
                    // D-Pad Buttons.  No custom options, so use the default definitions.
                    12: { action: "sendKey", key: "ArrowUp"},
                    13: { action: "sendKey", key: "ArrowDown"},
                    14: { action: "sendKey", key: "ArrowLeft"},
                    15: { action: "sendKey", key: "ArrowRight"}
                }
            }
        }
    });

    // Custom gamepad navigator component grade for arrow axis tests.
    fluid.defaults("gamepad.tests.axisInputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        invert: false,
        members: { count: 2 },
        model: {
            bindings: {
                axes: {
                    0: { action: "thumbstickHorizontalArrows", scrollFactor: 50, invert: "{that}.options.invert", repeatRate: 0.4 },
                    1: { action: "thumbstickVerticalArrows", scrollFactor: 50, invert: "{that}.options.invert", repeatRate: 0.4 }
                }
            }
        }
    });

    // Client-side component to count arrows sent.
    fluid.defaults("gamepad.tests.utils.arrows.counter", {
        gradeNames: ["fluid.viewComponent"],
        model: {
            eventCount: {
            }
        },
        selectors: {
            target: "#arrow-target"
        },
        invokers: {
            handleKeydown: {
                funcName: "gamepad.tests.utils.arrows.counter.handleEvent",
                args: ["{that}", "keydown", "{arguments}.0"] // eventType, event
            },
            handleKeyup: {
                funcName: "gamepad.tests.utils.arrows.counter.handleEvent",
                args: ["{that}", "keyup", "{arguments}.0"] // eventType, event
            },
            focus: {
                this: "{that}.dom.target",
                method: "focus"
            }
        },
        listeners: {
            "onCreate.bindTargetKeydown": {
                this: "{that}.dom.target",
                method: "keydown",
                args: ["{that}.handleKeydown"]
            },
            "onCreate.bindTargetKeyup": {
                this: "{that}.dom.target",
                method: "keyup",
                args: ["{that}.handleKeyup"]
            }
        }
    });

    gamepad.tests.utils.arrows.counter.handleEvent = function (that, eventType, event) {
        var keyCode = fluid.get(event, "code");
        if (keyCode !== undefined) {
            var currentCount = fluid.get(that, ["model", "eventCount", eventType, keyCode]) || 0;
            that.applier.change(["eventCount", eventType, keyCode], currentCount + 1);
        }
    };
})(fluid);
