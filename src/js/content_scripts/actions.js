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
            action: "thumbstickHistoryNavigation",
            description: "Navigate through history with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickHorizontalArrows: {
            action: "thumbstickHorizontalArrows",
            description: "Send left or right arrows with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickTabbing: {
            action: "thumbstickTabbing",
            description: "Move through the focusable elements using a stick input",
            repeatRate: 0,
            invert:false
        },
        scrollHorizontally: {
            action: "scrollHorizontally",
            description: "Scroll horizontally with a stick input",
            repeatRate: 0.1,
            scrollFactor: 10,
            invert:false
        },
        scrollVertically: {
            action: "scrollVertically",
            description: "Scroll vertically with a stick input",
            repeatRate: 0.1,
            scrollFactor: 10,
            invert:false
        },
        thumbstickVerticalArrows: {
            action: "thumbstickVerticalArrows",
            description: "Send up or down arrows with a stick input",
            repeatRate: 0.5,
            invert:false
        },
        thumbstickWindowSize: {
            action: "thumbstickWindowSize",
            description: "Change the window size with a stick input",
            repeatRate: 0,
            invert:false
        },
        thumbstickZoom: {
            action: "thumbstickZoom",
            description: "Zoom in or out of the window with a stick input",
            repeatRate: 1,
            invert:false
        }
    };

    gamepad.actions.button = {
        click: {
            action: "click",
            description: "Click the focused element"
        },
        closeCurrentTab: {
            action: "closeCurrentTab",
            description: "Close the current tab"
        },
        closeCurrentWindow: {
            action: "closeCurrentWindow",
            description: "Close the current window"
        },
        enterFullscreen: {
            action: "enterFullscreen",
            description: "Enter fullscreen mode."
        },
        exitFullscreen: {
            action: "exitFullscreen",
            description: "Exit fullscreen mode."
        },
        goToNextTab: {
            action: "goToNextTab",
            description: "Switch to the next tab",
            repeatRate: 1
        },
        goToNextWindow: {
            action: "goToNextWindow",
            description: "Switch to the next window",
            repeatRate: 1
        },
        goToPreviousTab: {
            action: "goToPreviousTab",
            description: "Switch to the previous tab",
            repeatRate: 1
        },
        goToPreviousWindow: {
            action: "goToPreviousWindow",
            description: "Switch to the previous window",
            repeatRate: 1
        },
        maximizeWindow: {
            action: "maximizeWindow",
            description: "Maximise the window"
        },
        nextPageInHistory: {
            action: "nextPageInHistory",
            description: "Switch to the next page in history"
        },
        openNewTab: {
            action: "openNewTab",
            description: "Open a new tab",
            background: false
        },
        openNewWindow: {
            action: "openNewWindow",
            description: "Open a new window",
            background: false
        },
        openActionLauncher: {
            action: "openActionLauncher",
            description: "Open the action launcher"
        },
        openSearchKeyboard: {
            action: "openSearchKeyboard",
            description: "Start a search"
        },
        openConfigPanel: {
            action: "openConfigPanel",
            description: "Open the settings panel"
        },
        previousPageInHistory: {
            action: "previousPageInHistory",
            description: "Switch to the previous page in history"
        },
        reloadTab: {
            action: "reloadTab",
            description: "Reload the current active tab"
        },
        reopenTabOrWindow: {
            action: "reopenTabOrWindow",
            description: "Reopen the most recently closed tab or window"
        },
        restoreWindowSize: {
            action: "restoreWindowSize",
            description: "Restore the window to its previous size."
        },
        scrollDown: {
            action: "scrollDown",
            description: "Scroll down",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollLeft: {
            action: "scrollLeft",
            description: "Scroll left",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollRight: {
            action: "scrollRight",
            description: "Scroll right",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        scrollUp: {
            action: "scrollUp",
            description: "Scroll up",
            repeatRate: 0.1,
            scrollFactor: 10
        },
        sendKey: {
            action: "sendKey",
            description: "Send a key to the focused element",
            repeatRate: 0
        },
        tabBackward: {
            action: "tabBackward",
            description: "Focus on the previous focusable element",
            repeatRate: 0.4
        },
        tabForward: {
            action: "tabForward",
            description: "Focus on the next focusable element",
            repeatRate: 0.4
        },
        zoomIn: {
            action: "zoomIn",
            description: "Zoom in to the current window",
            repeatRate: 0.5
        },
        zoomOut: {
            action: "zoomOut",
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
        "reloadTab",
        "reopenTabOrWindow",
        "previousPageInHistory",
        "nextPageInHistory",
        "maximizeWindow",
        "restoreWindowSize",
        "enterFullscreen",
        "exitFullscreen",
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

        // The list of launchable actions also controls the order in which they're displayed in the
        fluid.each(gamepad.actions.keys.launchable, function (actionKey) {
            var reworkedDef = fluid.copy(originalLaunchableDefs[actionKey]);
            reworkedDef.key = actionKey;

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
