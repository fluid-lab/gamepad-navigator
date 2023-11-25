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

    fluid.defaults("gamepad.actionLauncher", {
        gradeNames: ["gamepad.modal"],
        model: {
            classNames: " actionLauncher-modal",
            label: "Gamepad Navigator: Launch Action"
        },
        components: {
            actionsPanel: {
                container: "{that}.dom.modalBody",
                type: "gamepad.actionLauncher.actionsPanel"
            }
        }
    });

    fluid.defaults("gamepad.actionLauncher.action", {
        gradeNames: ["gamepad.templateRenderer"],

        selectors: {
            expanded: ".actionLauncher-actions-action-expanded"
        },

        model: {
            row: -1,
            value: 1,
            oldValue: 0,
            commonConfiguration: {
                homepageURL: "https://www.google.com/"
            },
            actionOptions: {
                speedFactor: 1,
                invert: false,
                background: false,
                frequency: 100
            }
        },

        markup: {
            container: "<div class='actionLauncher-actions-action' tabindex=0><div class='actionLauncher-actions-action-description'>%description</div></div>"
        },

        invokers: {
            handleClick: {
                funcName: "gamepad.actionLauncher.action.handleClick",
                args: ["{that}", "{gamepad.inputMapper}", "{gamepad.actionLauncher}", "{arguments}.0"] // actionLauncher, inputMapper, modalComponent, event
            },
            handleKeydown: {
                funcName: "gamepad.actionLauncher.action.handleKeydown",
                args: ["{that}", "{arguments}.0"] // event
            },
            handleFocus: {
                funcName: "gamepad.actionLauncher.action.handleFocus",
                args: ["{that}", "{arguments}.0"] // event
            }
        },

        listeners: {
            "onCreate.bindClick": {
                this: "{that}.container",
                method: "click",
                args: ["{that}.handleClick"]
            },
            "onCreate.bindKeydown": {
                this: "{that}.container",
                method: "keydown",
                args: ["{that}.handleKeydown"]
            },
            "onCreate.bindFocus": {
                this: "{that}.container",
                method: "focus",
                args: ["{that}.handleFocus"]
            }
        },

        modelListeners: {
            "focusedRow": {
                funcName: "gamepad.actionLauncher.action.handleFocusedRowChange",
                args: ["{that}", "{that}.model.focusedRow", "{that}.model.row"]
            }
        }
    });

    gamepad.actionLauncher.action.handleFocusedRowChange = function (that, focusedRow, row) {
        if (row === focusedRow) {
            that.container[0].focus();
        }
    };

    gamepad.actionLauncher.action.handleFocus = function (that) {
        that.applier.change("focusedRow", that.model.row);
    };

    gamepad.actionLauncher.action.handleClick = function (actionComponent, inputMapperComponent, modalComponent, event) {
        event.preventDefault();

        // Close modal and restore previous focus.
        modalComponent.closeModal(event);

        var actionFn = fluid.get(inputMapperComponent, actionComponent.model.actionKey);
        if (actionFn) {
            // Simulate a button press and release so that all actions are
            // triggered appropriately.

            // All actions are called with:
            // value, oldValue, actionOptions

            // Simulate button down
            actionFn(
                1,
                0,
                actionComponent.model.actionOptions
            );

            // Simulate button up after a delay (100ms by default)
            setTimeout(function () {
                actionFn(
                    0,
                    1,
                    actionComponent.model.actionOptions
                );
            }, actionComponent.model.frequency);
        }
    };

    gamepad.actionLauncher.action.handleKeydown = function (that, event) {
        if (event.key === " " || event.key === "Enter") {
            that.handleClick(event);
        }
    };

    fluid.defaults("gamepad.actionLauncher.actionsPanel", {
        gradeNames: ["gamepad.templateRenderer"],

        markup: {
            container: "<div class='actionLauncher-actions'></div>"
        },

        model: {
            focusedRow: 0,
            // TODO: Add support for controlling `backgroundOption` in the `openNewTab` and `openNewWindow` actions.
            actionDefs: [
                // All button-driven actions, except for the action launcher itself, ordered by subjective "usefulness".
                // TODO: Add action to open configuration menu, when available.
                {
                    key: "openSearchKeyboard",
                    description: "Search"
                },
                {
                    key: "openNewWindow",
                    description: "Open a new browser window"
                },
                {
                    key: "openNewTab",
                    description: "Open a new tab"
                },
                {
                    key: "goToPreviousWindow",
                    description: "Switch to the previous browser window"
                },
                {
                    key: "goToNextWindow",
                    description: "Switch to the next browser window"
                },
                {
                    key: "goToPreviousTab",
                    description: "Switch to the previous browser tab"
                },
                {
                    key: "goToNextTab",
                    description: "Switch to the next browser tab"
                },
                {
                    key: "closeCurrentTab",
                    description: "Close current browser tab"
                },
                {
                    key: "closeCurrentWindow",
                    description: "Close current browser window"
                },
                {
                    key: "reopenTabOrWindow",
                    description: "Re-open the last closed tab or window"
                },
                {
                    key: "previousPageInHistory",
                    description: "History back button"
                },
                {
                    key: "nextPageInHistory",
                    description: "History next button"
                },
                {
                    key: "maximizeWindow",
                    description: "Maximize the current browser window"
                },
                {
                    key: "restoreWindowSize",
                    description: "Restore the size of current browser window"
                },
                // These should nearly always already be bound.
                {
                    key: "click",
                    description: "Click"
                },
                {
                    key: "reverseTab",
                    description: "Focus on the previous element"
                },
                {
                    key: "forwardTab",
                    description: "Focus on the next element"
                },
                // Here for completeness, but IMO less likely to be used.
                {
                    key: "scrollLeft",
                    description: "Scroll left",
                    frequency: 250
                },
                {
                    key: "scrollRight",
                    description: "Scroll right",
                    frequency: 250
                },
                {
                    key: "scrollUp",
                    description: "Scroll up",
                    frequency: 250
                },
                {
                    key: "scrollDown",
                    description: "Scroll down",
                    frequency: 250
                },
                {
                    key: "zoomIn",
                    description: "Zoom-in on the active web page"
                },
                {
                    key: "zoomOut",
                    description: "Zoom-out on the active web page"
                },
                {
                    key: "sendArrowLeft",
                    description: "Send left arrow to the focused element."
                },
                {
                    key: "sendArrowRight",
                    description: "Send right arrow to the focused element."
                },
                {
                    key: "sendArrowUp",
                    description: "Send up arrow to the focused element."
                },
                {
                    key: "sendArrowDown",
                    description: "Send down arrow to the focused element."
                }
            ]
        },

        dynamicComponents: {
            action: {
                container: "{that}.container",
                type: "gamepad.actionLauncher.action",
                sources: "{that}.model.actionDefs",
                options: {
                    model: {
                        focusedRow: "{gamepad.actionLauncher.actionsPanel}.model.focusedRow",
                        row: "{sourcePath}",
                        actionKey: "{source}.key",
                        description: "{source}.description",
                        actionOptions: {
                            speedFactor: "{source}.speedFactor",
                            invert: "{source}.invert",
                            background: "{source}.background",
                            frequency: "{source}.frequency"
                        }
                    }
                }
            }
        },

        invokers: {
            handleKeydown: {
                funcName: "gamepad.actionLauncher.actionsPanel.handleKeydown",
                args: ["{that}", "{arguments}.0"] // event
            }
        },

        listeners: {
            "onCreate.bindKeydown": {
                this: "{that}.container",
                method: "keydown",
                args: ["{that}.handleKeydown"]
            }
        }
    });

    gamepad.actionLauncher.actionsPanel.handleKeydown = function (that, event) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
            event.preventDefault();
            var lastRow = that.model.actionDefs.length - 1;
            switch (event.code) {
                case "ArrowLeft":
                case "ArrowUp":
                    var previousRow = that.model.focusedRow > 0 ? that.model.focusedRow - 1 : lastRow;
                    that.applier.change("focusedRow", previousRow);
                    break;
                case "ArrowRight":
                case "ArrowDown":
                    var nextRow = that.model.focusedRow < lastRow ? that.model.focusedRow + 1 : 0;
                    that.applier.change("focusedRow", nextRow);
                    break;
            }
        }
    };
})(fluid);
