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

// TODO: Make this use the list selector.

(function (fluid) {
    "use strict";

    fluid.defaults("gamepad.actionLauncher", {
        gradeNames: ["gamepad.modal"],
        model: {
            classNames: " actionLauncher-modal",
            closeButtonLabel: "Cancel",
            label: "Gamepad Navigator: Launch Action"
        },
        components: {
            actionsPanel: {
                container: "{that}.dom.modalBody",
                type: "gamepad.actionLauncher.actionsPanel"
            }
        }
    });

    // Simulate gamepad input as though all keys and axes were held.
    fluid.defaults("gamepad.actionLauncher.action", {
        gradeNames: ["gamepad.templateRenderer"],

        selectors: {
            expanded: ".actionLauncher-actions-action-expanded"
        },

        model: {
            row: -1,
            actionOptions: {
                scrollFactor: 1,
                invert: false,
                background: false,
                repeatRate: 0
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
            // Simulate a button press so that actions that care about the input value (like scroll) will work.
            // We use one that is not ordinarily possible to trigger to avoid any possible conflict with bindings.
            inputMapperComponent.applier.change(["buttons", "999"], 1);

            // Call the action with our simulated button. All actions are called with: actionOptions, inputType, index
            actionFn(
                actionComponent.model.actionOptions,
                "buttons",
                "999"
            );

            // Remove our fake button press after a delay (100ms by default)
            setTimeout(function () {
                var transaction = inputMapperComponent.applier.initiate();
                transaction.fireChangeRequest({ path: ["buttons", "999"], type: "DELETE"});
                transaction.commit();
            }, actionComponent.model.repeatRate);
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
            actionDefs: gamepad.actions.launchable
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
                            scrollFactor: "{source}.scrollFactor",
                            invert: "{source}.invert",
                            background: "{source}.background",
                            repeatRate: "{source}.repeatRate"
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
