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

    fluid.defaults("gamepad.osk.modal.base", {
        gradeNames: ["gamepad.modal"],
        model: {
            classNames: " onscreen-keyboard-modal",
            closeButtonLabel: "Cancel",
            label: "Gamepad Navigator: Onscreen Keyboard",
            lastExternalFocused: false,
            inputValue: ""
        },
        components: {
            input: {
                container: "{that}.dom.modalBody",
                type: "osk.inputs.text",
                options: {
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
                type: "gamepad.osk.keyboard.text",
                options: {
                    model: {
                        arrowNav: "{gamepad.osk.modal}.model.prefs.arrowModals"
                    },
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

    fluid.defaults("gamepad.osk.updateButton", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<button class='gamepad-navigator-osk-update-button' disabled>%label</button>"
        },
        model: {
            lastExternalFocused: false,
            label: "Update Field",
            disabled: true
        },
        modelRelay: {
            disabled: {
                source: "{that}.model.disabled",
                target: "{that}.model.dom.container.attr.disabled"
            },
            label: {
                source: "{that}.model.label",
                target: "{that}.model.dom.container.text"
            }
        },
        modelListeners: {
            lastExternalFocused: {
                funcName: "gamepad.osk.updateButton.updateText",
                args: ["{that}"]
            }
        }
    });

    gamepad.osk.updateButton.updateText = function (that) {
        var label = "Update Field";

        if (that.model.lastExternalFocused && gamepad.inputMapperUtils.content.isSearchField(that.model.lastExternalFocused)) {
            label = "Search";
        }

        that.applier.change("label", label);
    };

    fluid.defaults("gamepad.osk.modal", {
        gradeNames: ["gamepad.osk.modal.base"],
        model: {
            disableUpdateButton: true
        },
        modelRelay: [
            {
                source: "inputValue",
                target: "draftInputValue",
                backward: {
                    excludeSource: "*"
                }
            }
        ],
        modelListeners: {
            draftInputValue: {
                excludeSource: "init",
                funcName: "gamepad.osk.modal.validateOnChange",
                args: ["{that}"]
            }
        },
        invokers: {
            handleUpdateClick: {
                funcName: "gamepad.osk.modal.handleUpdateClick",
                args: ["{that}", "{arguments}.0"] // event

            },
            validateInput: {
                funcName: "fluid.identity",
                args: [true]
            }
        },
        components: {
            input: {
                container: "{that}.dom.modalBody",
                type: "osk.inputs.text",
                options: {
                    model: {
                        composition: "{gamepad.osk.modal}.model.draftInputValue"
                    }
                }
            },
            updateButton: {
                container: "{that}.dom.modalFooter",
                type: "gamepad.osk.updateButton",
                options: {
                    model: {
                        lastExternalFocused: "{gamepad.osk.modal}.model.lastExternalFocused",
                        disabled: "{gamepad.osk.modal}.model.disableUpdateButton"                        
                    },
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{updateButton}.container",
                            method: "click",
                            args: ["{gamepad.osk.modal}.handleUpdateClick"]
                        }
                    }
                }
            }
        }
    });

    gamepad.osk.modal.validateOnChange = function (that) {
        var hasChanged = (that.model.draftInputValue !== that.model.inputValue);
        var hasValidChanges =  hasChanged && that.validateInput();
        that.applier.change("disableUpdateButton", !hasValidChanges);
    };

    gamepad.osk.modal.handleUpdateClick = function (that, event) {
        that.applier.change("inputValue", that.model.draftInputValue);

        that.closeModal(event);
    };
})(fluid);
