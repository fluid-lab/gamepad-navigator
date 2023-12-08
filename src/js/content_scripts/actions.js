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

    fluid.registerNamespace("gamepad.actions");

    gamepad.actions.axis = {
        thumbstickHistoryNavigation: {
            description: "Navigate through history with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickHorizontalArrows: {
            description: "Send left or right arrows with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickTabbing: {
            description: "Move through the focusable elements using a stick input",
            repeatRate: 0,
            invert:false
        },
        scrollHorizontally: {
            description: "Scroll horizontally with a stick input",
            repeatRate: 0.1,
            scrollFactor: 10,
            invert:false
        },
        scrollVertically: {
            description: "Scroll vertically with a stick input",
            repeatRate: 0.1,
            scrollFactor: 10,
            invert:false
        },
        thumbstickVerticalArrows: {
            description: "Send up or down arrows with a stick input",
            repeatRate: 0.5,
            invert:false
        },
        thumbstickWindowSize: {
            description: "Change the window size with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickZoom: {
            description: "Zoom in or out of the window with a stick input",
            repeatRate: 1,
            invert:false
        }
    };

    gamepad.actions.button = {
        click: {
            description: "Click the focused element"
        },
        closeCurrentTab: {
            description: "Close the current tab"
        },
        closeCurrentWindow: {
            description: "Close the current window"
        },
        goToNextTab: {
            description: "Switch to the next tab",
            repeatRate: 1
        },
        goToNextWindow: {
            description: "Switch to the next window",
            repeatRate: 1
        },
        goToPreviousTab: {
            description: "Switch to the previous tab",
            repeatRate: 1
        },
        goToPreviousWindow: {
            description: "Switch to the previous window",
            repeatRate: 1
        },
        maximizeWindow: {
            description: "Maximise the window"
        },
        nextPageInHistory: {
            description: "Switch to the next page in history"
        },
        openNewTab: {
            description: "Open a new tab",
            background: false
        },
        openNewWindow: {
            description: "Open a new window",
            background: false
        },
        openActionLauncher: {
            description: "Open the action launcher"
        },
        openSearchKeyboard: {
            description: "Start a search"
        },
        openConfigPanel: {
            description: "Open the settings panel"
        },
        previousPageInHistory: {
            description: "Switch to the previous page in history"
        },
        reopenTabOrWindow: {
            description: "Reopen the most recently closed tab or window"
        },
        restoreWindowSize: {
            description: "Restore the window to its previous size."
        },
        scrollDown: {
            description: "Scroll down",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollLeft: {
            description: "Scroll left",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollRight: {
            description: "Scroll right",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollUp: {
            description: "Scroll up",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        sendKey: {
            description: "Send a key to the focused element",
            repeatRate: 0
        },
        tabBackward: {
            description: "Focus on the previous focusable element",
            repeatRate: 0.4
        },
        tabForward: {
            description: "Focus on the next focusable element",
            repeatRate: 0.4
        },
        zoomIn: {
            description: "Zoom in to the current window",
            repeatRate: 0.5
        },
        zoomOut: {
            description: "Zoom out of the current window",
            repeatRate: 0.5
        }
    };

    gamepad.actions.all = fluid.merge({}, gamepad.actions.button, gamepad.actions.axis);

    fluid.registerNamespace("gamepad.actions.keys");
    gamepad.actions.keys.launchable = [
        "openConfigPanel",
        "openSearchKeyboard",
        "openNewWindow",
        "openNewTab",
        "goToPreviousWindow",
        "goToNextWindow",
        "goToPreviousTab",
        "goToNextTab",
        "closeCurrentTab",
        "closeCurrentWindow",
        "reopenTabOrWindow",
        "previousPageInHistory",
        "nextPageInHistory",
        "maximizeWindow",
        "restoreWindowSize",
        "click",
        "tabBackward",
        "tabForward",
        "scrollLeft",
        "scrollRight",
        "scrollUp",
        "scrollDown",
        "zoomIn",
        "zoomOut"
    ];

    // Derive the list of launchable actions from the above.
    gamepad.actions.launchable = (function () {
        var originalLaunchableDefs = fluid.filterKeys(gamepad.actions.button, gamepad.actions.keys.launchable);
        var reworkedDefs = [];
        fluid.each(originalLaunchableDefs, function (launchDef, key) {
            var reworkedDef = fluid.copy(launchDef);
            reworkedDef.key = key;

            // launcher actions should never repeat.
            if (reworkedDef.repeatRate) {
                reworkedDef.repeatRate = 0;
            }

            reworkedDefs.push(reworkedDef);
        });
        return reworkedDefs;
    })();

    gamepad.actions.mapToChoices = function (originalMap) {
        var choices = {};
        fluid.each(originalMap, function (value, key) {
            choices[key] = fluid.get(value, "description") || value;
        });
        return choices;
    };

    fluid.registerNamespace("gamepad.actions.choices");

    // Derive the actions available for buttons so that we can populate a drop-down.
    gamepad.actions.choices.button = gamepad.actions.mapToChoices(gamepad.actions.button);

    // Derive the actions available for axes so that we can populate a drop-down.
    gamepad.actions.choices.axis = gamepad.actions.mapToChoices(gamepad.actions.axis);

})(fluid);