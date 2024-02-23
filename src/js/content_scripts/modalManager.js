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
        gradeNames: ["gamepad.shadowHolder"],
        markup: {
            container: "<div class='gamepad-navigator-modal-manager'></div>"
        },
        model: {
            activeModal: false,
            fullscreen: false,
            lastExternalFocused: false,
            inputValue: "",
            inputType: ""
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
                        lastExternalFocused: "{gamepad.modalManager}.model.lastExternalFocused",
                        inputValue: "{gamepad.modalManager}.model.inputValue"
                    }
                }
            },
            onscreenNumpad: {
                container: "{that}.model.shadowElement",
                type: "gamepad.numpad.modal",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        hidden: "{gamepad.modalManager}.model.hideOnscreenNumpad",
                        prefs: "{gamepad.modalManager}.model.prefs",
                        inputValue: "{gamepad.modalManager}.model.inputValue"
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
        modelListeners: {
            activeModal: {
                excludeSource: "init",
                funcName: "gamepad.modalManager.toggleModals",
                args: ["{that}"]
            },
            fullscreen: {
                excludeSource: "init",
                funcName: "gamepad.modalManager.reattachToDOM",
                args: ["{that}"]
            }
        }
    });

    gamepad.modalManager.reattachToDOM = function (that) {
        that.applier.change("activeModal", false);

        var toAttach = document.fullscreenElement || document.body;
        toAttach.appendChild(that.container[0]);
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

        var hideOnscreenNumpad = that.model.activeModal !== "onscreenNumpad";
        transaction.fireChangeRequest({ path: "hideOnscreenNumpad", value: hideOnscreenNumpad});

        transaction.commit();
    };
})(fluid);
