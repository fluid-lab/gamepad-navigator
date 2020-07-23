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

    fluid.registerNamespace("gamepad.configMaps");

    fluid.defaults("gamepad.configMaps", {
        gradeNames: ["fluid.modelComponent"],
        model: {
            // TODO: Make functions used in axes to be reusable for analogue buttons.
            map: {
                buttons: {
                    // Face Button.
                    // Cross on PlayStation controller & A on Xbox controller.
                    "0": {
                        defaultAction: "click",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Circle on PlayStation controller & B on Xbox controller.
                    "1": {
                        defaultAction: null,
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Square on PlayStation controller & X on Xbox controller.
                    "2": {
                        defaultAction: "previousPageInHistory",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Face Button.
                    // Triangle on PlayStation controller & Y on Xbox controller.
                    "3": {
                        defaultAction: "nextPageInHistory",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Left Bumper.
                    "4": {
                        defaultAction: "reverseTab",
                        currentAction: null,
                        speedFactor: 2.5,
                        background: false
                    },
                    // Right Bumper.
                    "5": {
                        defaultAction: "forwardTab",
                        currentAction: null,
                        speedFactor: 2.5,
                        background: false
                    },
                    // Left Trigger.
                    "6": {
                        defaultAction: "scrollLeft",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Right Trigger.
                    "7": {
                        defaultAction: "scrollRight",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Select/Share on PlayStation controller & Back on Xbox controller.
                    "8": {
                        defaultAction: "closeCurrentTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Start/Options on PlayStation controller & Start on Xbox controller.
                    "9": {
                        defaultAction: "openNewTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Left thumbstick button.
                    "10": {
                        defaultAction: "closeCurrentWindow",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Right thumbstick button.
                    "11": {
                        defaultAction: "openNewWindow",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad up direction button.
                    "12": {
                        defaultAction: "goToPreviousWindow",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad down direction button.
                    "13": {
                        defaultAction: "goToNextWindow",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad left direction button.
                    "14": {
                        defaultAction: "goToPreviousTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // D-Pad right direction button.
                    "15": {
                        defaultAction: "goToNextTab",
                        currentAction: null,
                        speedFactor: 1,
                        background: false
                    },
                    // Badge icon
                    // PS button on PlayStation controller & Xbox logo button.
                    // Reserved for launching reconfiguration panel.
                    "16": null,
                    // Reserved for mousepad/touchpad functionality.
                    "17": null
                },
                axes: {
                    // Left thumbstick horizontal axis.
                    "0": {
                        defaultAction: "scrollHorizontally",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Left thumbstick vertical axis.
                    "1": {
                        defaultAction: "scrollVertically",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick horizontal axis.
                    "2": {
                        defaultAction: "thumbstickHistoryNavigation",
                        currentAction: null,
                        speedFactor: 1,
                        invert: false
                    },
                    // Right thumbstick vertical axis.
                    "3": {
                        defaultAction: "thumbstickTabbing",
                        currentAction: null,
                        speedFactor: 2.5,
                        invert: false
                    }
                }
            },
            commonConfiguration: {
                homepageURL: "https://www.google.com/"
            }
        }
    });
})(fluid);
