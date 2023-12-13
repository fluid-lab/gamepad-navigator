/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");

    // Adapted from: https://github.com/duhrer/fluid-osk/blob/GH-1/examples/js/customTextInput.js

    fluid.defaults("gamepad.osk.modal", {
        gradeNames: ["gamepad.modal"],
        model: {
            classNames: " onscreen-keyboard-modal",
            label: "Gamepad Navigator: Onscreen Keyboard",
            lastExternalFocused: false,
            textInputValue: ""
        },
        components: {
            input: {
                container: "{that}.dom.modalBody",
                type: "osk.inputs.text",
                options: {
                    model: {
                        composition: "{gamepad.osk.modal}.model.textInputValue"
                    },
                    modelListeners: {
                        composition: {
                            excludeSource: "local",
                            funcName: "gamepad.osk.modal.updateTextInputWithExternalValue",
                            args: ["{that}"]
                        }
                    }
                }
            },
            osk: {
                container: "{that}.dom.modalBody",
                type: "gamepad.osk.keyboard",
                options: {
                    listeners: {
                        "onAction.updateInput": {
                            priority: "before:handleLatches",
                            funcName: "gamepad.osk.modal.processAction",
                            args: ["{that}", "{osk.inputs.text}", "{arguments}.0"] // inputComponent, actionDef
                        }
                    }
                }
            }
        }
    });

    // Our assumptions are slightly different than fluid-osk, so we hack in an override to pass in external values.
    // It may be possible to move this to fluid-osk, but in testing this causes problems with other external updates,
    // i.e. those made indirectly via addChar and other invokers.
    gamepad.osk.modal.updateTextInputWithExternalValue = function (inputComponent) {
        var transaction = inputComponent.applier.initiate();
        transaction.fireChangeRequest({ path: "cursorIndex", value: inputComponent.model.composition.length});
        transaction.fireChangeRequest({ path: "beforeCursor", value: inputComponent.model.composition });
        transaction.fireChangeRequest({ path: "afterCursor", value: "" });
        transaction.commit();
    };

    gamepad.osk.modal.processAction = function (keyboardComponent, inputComponent, actionDef) {
        if (actionDef.action === "text") {
            var toAdd = actionDef.payload;
            if (keyboardComponent.model.latchedKeys.ShiftLeft || keyboardComponent.model.latchedKeys.ShiftRight ) {
                toAdd = actionDef.shiftPayload;
            }
            else if (keyboardComponent.model.latchedKeys.CapsLock) {
                toAdd = actionDef.capsPayload;
            }
            var isInsert = keyboardComponent.model.latchedKeys.Insert;
            inputComponent.addChar(toAdd, isInsert);
        }
        else if (actionDef.action === "backspace") {
            inputComponent.removePreviousChar();
        }
        else if (actionDef.action === "delete") {
            inputComponent.removeNextChar();
        }
        else if (actionDef.action === "up" || actionDef.action === "left") {
            inputComponent.moveCursor(-1);
        }
        else if (actionDef.action === "down" || actionDef.action === "right") {
            inputComponent.moveCursor(1);
        }
        else if (actionDef.action === "home") {
            inputComponent.moveCursorToStart();
        }
        else if (actionDef.action === "end") {
            inputComponent.moveCursorToEnd();
        }
    };

    // Wrapped in case we want to extend later, for example to add bespoke
    // buttons for domains.
    fluid.defaults("gamepad.osk.keyboard", {
        gradeNames: ["osk.keyboard.qwerty"]
    });
})(fluid);
