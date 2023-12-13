/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
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
            label: "Gamepad Navigator: Launch Action",
            actions: gamepad.actions.launchable
        },
        components: {
            actionsPanel: {
                container: "{that}.dom.modalBody",
                type: "gamepad.ui.listSelector",
                options: {
                    model: {
                        description: "Select an action to launch from the list below, or hit &quot;Cancel&quot; to close this modal.",
                        items: "{gamepad.actionLauncher}.model.actions"
                    },
                    invokers: {
                        handleItemClick: {
                            funcName: "gamepad.actionLauncher.handleItemClick",
                            args: ["{gamepad.modal}", "{gamepad.inputMapper}", "{arguments}.0", "{arguments}.1"] // modalComponent, inputMapperComponent, itemIndex, event
                        }
                    }
                }
            }
        }
    });

    gamepad.actionLauncher.handleItemClick = function (modalComponent, inputMapperComponent, itemIndex, event) {
        event.preventDefault();

        // Close modal and restore previous focus.
        modalComponent.closeModal(event);

        var actionDef = fluid.get(modalComponent, ["model", "actions", itemIndex]);

        var actionFn = fluid.get(inputMapperComponent, actionDef.action);
        if (actionFn) {
            // Simulate a button press so that actions that care about the input value (like scroll) will work.
            // We use one that is not ordinarily possible to trigger to avoid any possible conflict with bindings.
            inputMapperComponent.applier.change(["buttons", "999"], 1);

            // Call the action with our simulated button. All actions are called with: actionOptions, inputType, index
            actionFn(
                actionDef,
                "buttons",
                "999"
            );

            // Release our fake button press after a delay.
            setTimeout(function () {
                var transaction = inputMapperComponent.applier.initiate();
                transaction.fireChangeRequest({ path: ["buttons", "999"], type: "DELETE"});
                transaction.commit();
            }, 100);
        }
    };
})(fluid);
