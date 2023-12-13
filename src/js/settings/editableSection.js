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

    fluid.defaults("gamepad.settings.ui.editableSection", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-settings-editable-section%classNames'><h3>%label</h3><div class='gamepad-settings-editable-section-body'></div><div class='gamepad-settings-editable-section-footer'></div></div>"
        },
        selectors: {
            body: ".gamepad-settings-editable-section-body",
            footer: ".gamepad-settings-editable-section-footer"
        },
        model: {
            label: "Editable Section",
            classNames: "",
            draftClean: true
        },
        components: {
            discardButton: {
                container: "{that}.dom.footer",
                type: "gamepad.settings.draftHandlingButton.discard",
                options: {
                    model: {
                        disabled: "{gamepad.settings.ui.editableSection}.model.draftClean"
                    },
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{gamepad.settings.draftHandlingButton}.container",
                            method: "click",
                            args: ["{gamepad.settings.ui.editableSection}.resetDraft"]
                        }
                    }
                }
            },
            saveButton: {
                container: "{that}.dom.footer",
                type: "gamepad.settings.draftHandlingButton.save",
                options: {
                    model: {
                        disabled: "{gamepad.settings.ui.editableSection}.model.draftClean"
                    },
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{gamepad.settings.draftHandlingButton}.container",
                            method: "click",
                            args: ["{gamepad.settings.ui.editableSection}.saveDraft"]
                        }
                    }
                }
            }
        },
        invokers: {
            saveDraft: {
                funcName: "fluid.notImplemented"
            },
            resetDraft: {
                funcName: "fluid.notImplemented"
            }
        }
    });
})(fluid);
