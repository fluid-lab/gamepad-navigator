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
            value: 1,
            oldValue: 0,
            speedFactor: 1,
            invert: false,
            background: false,
            homepageURL: "https://www.google.com/",
            frequency: 100
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
            }
        }
    });

    gamepad.actionLauncher.action.handleClick = function (actionComponent, inputMapperComponent, modalComponent, event) {
        event.preventDefault();

        // Close modal and restore previous focus.
        modalComponent.closeModal(event);

        var actionFn = fluid.get(inputMapperComponent, actionComponent.model.actionKey);
        if (actionFn) {
            // Simulate a button press and release so that all actions are
            // triggered appropriately.

            // All actions are called with:
            // value, speedFactor, invert, background, oldValue, homepageURL

            // Simulate button down
            actionFn(
                1,
                actionComponent.model.speedFactor,
                actionComponent.model.invert,
                actionComponent.model.background,
                0,
                actionComponent.model.homepageURL
            );

            // Simulate button up after a delay (100ms by default)
            setTimeout(function () {
                actionFn(
                    0,
                    actionComponent.model.speedFactor,
                    actionComponent.model.invert,
                    actionComponent.model.background,
                    1,
                    actionComponent.model.homepageURL
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
            // TODO: Add support for controlling `backgroundOption` in the `openNewTab` and `openNewWindow` actions.
            actionDefs: {
                // All button-driven actions, except for the action launcher itself.
                click: {
                    description: "Click"
                },
                previousPageInHistory: {
                    description: "History back button"
                },
                nextPageInHistory: {
                    description: "History next button"
                },
                reverseTab: {
                    description: "Focus on the previous element"
                },
                forwardTab: {
                    description: "Focus on the next element"
                },
                scrollLeft: {
                    description: "Scroll left",
                    frequency: 250
                },
                scrollRight: {
                    description: "Scroll right",
                    frequency: 250
                },
                scrollUp: {
                    description: "Scroll up",
                    frequency: 250
                },
                scrollDown: {
                    description: "Scroll down",
                    frequency: 250
                },
                goToPreviousTab: {
                    description: "Switch to the previous browser tab"
                },
                goToNextTab: {
                    description: "Switch to the next browser tab"
                },
                closeCurrentTab: {
                    description: "Close current browser tab"
                },
                openNewTab: {
                    description: "Open a new tab"
                },
                closeCurrentWindow: {
                    description: "Close current browser window"
                },
                openNewWindow: {
                    description: "Open a new browser window"
                },
                goToPreviousWindow: {
                    description: "Switch to the previous browser window"
                },
                goToNextWindow: {
                    description: "Switch to the next browser window"
                },
                zoomIn: {
                    description: "Zoom-in on the active web page"
                },
                zoomOut: {
                    description: "Zoom-out on the active web page"
                },
                maximizeWindow: {
                    description: "Maximize the current browser window"
                },
                restoreWindowSize: {
                    description: "Restore the size of current browser window"
                },
                reopenTabOrWindow: {
                    description: "Re-open the last closed tab or window"
                },
                sendArrowLeft: {
                    description: "Send left arrow to the focused element."
                },
                sendArrowRight: {
                    description: "Send right arrow to the focused element."
                },
                sendArrowUp: {
                    description: "Send up arrow to the focused element."
                },
                sendArrowDown: {
                    description: "Send down arrow to the focused element."
                }
                // TODO: Add action to open configuration menu, when available.
            }
        },

        dynamicComponents: {
            action: {
                container: "{that}.container",
                type: "gamepad.actionLauncher.action",
                sources: "{that}.model.actionDefs",
                options: {
                    model: {
                        actionKey: "{sourcePath}",
                        description: "{source}.description",
                        speedFactor: "{source}.speedFactor",
                        invert: "{source}.invert",
                        background: "{source}.background",
                        frequency: "{source}.frequency"
                    }
                }
            }
        }
    });
})(fluid);
