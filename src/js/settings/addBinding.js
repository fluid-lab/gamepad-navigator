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

    fluid.defaults("gamepad.settings.ui.addBinding.selectWithNone", {
        gradeNames: ["gamepad.ui.select"],
        model: {
            noneOption: true,
            noneDescription: "Select an option"
        }
    });

    fluid.defaults("gamepad.settings.ui.addBinding", {
        gradeNames: ["gamepad.templateRenderer"],
        injectionType: "replaceWith",
        markup: {
            container: "<div class='gamepad-settings-add-binding-container'>\nWhen the <div class='gamepad-settings-add-binding-index-select'></div>\nis pressed,\n<div class='gamepad-settings-add-binding-action-select'></div>\n<button class='gamepad-settings-add-binding-addButton'>Add Binding</button>\n</div>"
        },
        model: {
            hidden: false,

            action: "none",
            actionChoices: {},

            index: "none",
            availableIndexChoices: {},

            missingParams: true
        },
        modelListeners: {
            hidden: {
                this: "{that}.container",
                method: "toggleClass",
                args: ["hidden", "{change}.value"]
            },
            availableIndexChoices: {
                funcName: "gamepad.settings.ui.addBinding.checkIndexChoices",
                args: ["{that}"]
            },
            action: {
                funcName: "gamepad.settings.ui.addBinding.checkForMissingParams",
                args: ["{that}"]
            },
            index: {
                funcName: "gamepad.settings.ui.addBinding.checkForMissingParams",
                args: ["{that}"]
            }
        },
        modelRelay: {
            source: "{that}.model.missingParams",
            target: "{that}.model.dom.addButton.attr.disabled"
        },
        selectors: {
            actionSelect: ".gamepad-settings-add-binding-action-select",
            indexSelect: ".gamepad-settings-add-binding-index-select",
            addButton: ".gamepad-settings-add-binding-addButton"
        },
        // TODO: These throw errors about length, whether here or in the subcomponent definition in the parent.  Fix.
        invokers: {
            handleClick: {
                funcName: "gamepad.settings.ui.addBinding.notifyParent",
                args: ["{that}", "{arguments}.0", "{gamepad.settings.ui.bindingsPanel}"] // event, parentComponent
            }
        },
        listeners: {
            "onCreate.bindAddButton": {
                this: "{that}.dom.addButton",
                method: "click",
                args: ["{that}.handleClick"]
            }
        },
        components: {
            indexSelect: {
                container: "{that}.dom.indexSelect",
                type: "gamepad.settings.ui.addBinding.selectWithNone",
                options: {
                    model: {
                        noneDescription: "- select an input -",
                        selectedChoice: "{gamepad.settings.ui.addBinding}.model.index",
                        // Unlike the bindings, we can use availableIndexChoices directly.
                        choices: "{gamepad.settings.ui.bindingsPanel}.model.availableIndexChoices"
                    }
                }
            },
            actionSelect: {
                container: "{that}.dom.actionSelect",
                type: "gamepad.settings.ui.addBinding.selectWithNone",
                options: {
                    model: {
                        noneDescription: "- select an action -",
                        selectedChoice: "{gamepad.settings.ui.addBinding}.model.action",
                        choices: "{gamepad.settings.ui.addBinding}.model.actionChoices"
                    }
                }
            }
        }
    });

    gamepad.settings.ui.addBinding.checkForMissingParams = function (that) {
        var missingParams = !that.model.index || that.model.index === "none" || !that.model.action || that.model.action === "none";
        that.applier.change("missingParams", missingParams);
    };

    gamepad.settings.ui.addBinding.notifyParent = function (that, event, parentComponent) {
        event.preventDefault();

        parentComponent.addBinding(that.model);

        that.applier.change("action", false);
        that.applier.change("index", false);
    };

    gamepad.settings.ui.addBinding.checkIndexChoices = function (that) {
        var hasAvailableIndexChoices = typeof that.model.availableIndexChoices === "object" && Object.keys(that.model.availableIndexChoices).length > 0;
        that.applier.change("hidden", !hasAvailableIndexChoices);
    };
})(fluid);
