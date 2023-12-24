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


    fluid.defaults("gamepad.modalManager", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-navigator-modal-manager'></div>",
            styles: "<style>%styles</style>"
        },
        model: {
            activeModal: false,
            shadowElement: false,
            lastExternalFocused: false,
            textInputValue: "",
            textInputType: "",

            // Inline all styles from JS-wrapped global namespaced variable.
            styles: gamepad.css
        },
        events: {
            onShadowReady: null
        },
        components: {
            actionLauncher: {
                container: "{that}.model.shadowElement",
                type: "gamepad.actionLauncher",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        hidden: "{gamepad.modalManager}.model.hideActionLauncher",
                        prefs: "{gamepad.modalManager}.model.prefs"
                    }
                }
            },
            onscreenKeyboard: {
                container: "{that}.model.shadowElement",
                type: "gamepad.osk.modal",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        hidden: "{gamepad.modalManager}.model.hideOnscreenKeyboard",
                        prefs: "{gamepad.modalManager}.model.prefs",
                        textInputValue: "{gamepad.modalManager}.model.textInputValue"
                    }
                }
            },
            searchKeyboard: {
                container: "{that}.model.shadowElement",
                type: "gamepad.searchKeyboard.modal",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        hidden: "{gamepad.modalManager}.model.hideSearchKeyboard",
                        prefs: "{gamepad.modalManager}.model.prefs"
                    }
                }
            },
            selectOperator: {
                container: "{that}.model.shadowElement",
                type: "gamepad.selectOperator",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        hidden: "{gamepad.modalManager}.model.hideSelectOperator",
                        prefs: "{gamepad.modalManager}.model.prefs",
                        selectElement: "{gamepad.modalManager}.model.selectElement"
                    }
                }
            }
        },
        listeners: {
            "onCreate.createShadow": {
                funcName: "gamepad.modalManager.createShadow",
                args: ["{that}"]
            }
        },
        modelListeners: {
            activeModal: {
                excludeSource: "init",
                funcName: "gamepad.modalManager.toggleModals",
                args: ["{that}"]
            }
        }
    });

    gamepad.modalManager.createShadow = function (that) {
        var host = that.container[0];
        var shadowElement = host.attachShadow({mode: "open"});

        // We inline all styles here so that all modals get the common styles,
        // and to avoid managing multiple shadow elements.
        shadowElement.innerHTML = fluid.stringTemplate(that.options.markup.styles, that.model);

        that.applier.change("shadowElement", shadowElement);
        that.events.onShadowReady.fire();
    };

    gamepad.modalManager.toggleModals = function (that) {
        var transaction = that.applier.initiate();
        var hideActionLauncher = that.model.activeModal !== "actionLauncher";
        transaction.fireChangeRequest({ path: "hideActionLauncher", value: hideActionLauncher });

        var hideOnscreenKeyboard = that.model.activeModal !== "onscreenKeyboard";
        transaction.fireChangeRequest({ path: "hideOnscreenKeyboard", value: hideOnscreenKeyboard });


        var hideSearchKeyboard = that.model.activeModal !== "searchKeyboard";
        transaction.fireChangeRequest({ path: "hideSearchKeyboard", value: hideSearchKeyboard });

        var hideSelectOperator = that.model.activeModal !== "selectOperator";
        transaction.fireChangeRequest({ path: "hideSelectOperator", value: hideSelectOperator });

        transaction.commit();
    };
})(fluid);
