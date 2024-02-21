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

    fluid.defaults("gamepad.settings.ui.bindingsPanel", {
        gradeNames: ["gamepad.settings.ui.editableSection"],
        markup: {
            container: "<div class='gamepad-settings-editable-section'><h3>%label</h3><div class='gamepad-settings-editable-section-body'><div class='gamepad-settings-add-binding-container'></div><div class='dynamic-binding-components'></div></div><div class='gamepad-settings-editable-section-footer'></div></div>"
        },
        selectors: {
            add: ".gamepad-settings-add-binding-container",
            dynamic: ".dynamic-binding-components",
            removeButton: ".gamepad-settings-binding-removeButton"
        },
        model: {
            label: "Bindings",
            // The original bindings, in the canonical format.
            bindings: {},
            // Our changes to all bindings, in the canonical format.
            draftBindings: {},
            // A structure derived from draftBindings that is used to instantiate dynamic components.
            bindingComponentSources: {},
            totalIndexes: 16,

            indexChoices: {},
            availableIndexChoices: {}
        },
        modelListeners: {
            bindings: [
                {
                    excludeSource: "init",
                    funcName: "gamepad.settings.ui.bindingsPanel.resetDraft",
                    args: ["{that}"]
                }
            ],
            draftBindings: [
                {
                    excludeSource: "init",
                    funcName: "gamepad.settings.ui.bindingsPanel.flagDraftChanged",
                    args: ["{that}"]
                },
                {
                    funcName: "gamepad.settings.ui.bindingsPanel.trackAvailableIndexChoices",
                    args: ["{that}"]
                }
            ],
            "bindingComponentSources": {
                excludeSource: ["init", "local"],
                funcName: "gamepad.settings.ui.bindingsPanel.reconcileChildComponentChanges",
                args: ["{that}", "{change}"]
            }
        },
        modelRelay: [
            {
                source: "bindings",
                target: "draftBindings",
                backward: {
                    excludeSource: "*"
                }
            },
            {
                source: "draftBindings",
                target: "bindingComponentSources",
                singleTransform: "gamepad.settings.ui.bindingsPanel.bindingsToComponentSources",
                backward: {
                    excludeSource: "*"
                }
            }
        ],
        invokers: {
            saveDraft: {
                funcName: "gamepad.settings.ui.bindingsPanel.saveDraft",
                args: ["{that}"]
            },
            resetDraft: {
                funcName: "gamepad.settings.ui.bindingsPanel.resetDraft",
                args: ["{that}"]
            },
            addBinding: {
                funcName: "gamepad.settings.ui.bindingsPanel.addBinding",
                args: ["{that}", "{arguments}.0"] // bindingComponentModel
            },
            removeBinding: {
                funcName: "gamepad.settings.ui.bindingsPanel.removeBinding",
                args: ["{that}", "{arguments}.0"] // bindingComponentModel
            }
        },
        dynamicComponents: {
            binding: {
                container: "{that}.dom.dynamic",
                sources: "{that}.model.bindingComponentSources",
                type: "{source}.type",
                options: {
                    model: {
                        index: "{source}.index",

                        action: "{source}.action",
                        invert: "{source}.invert",
                        repeatRate: "{source}.repeatRate",
                        scrollFactor: "{source}.scrollFactor",
                        background: "{source}.background",
                        key: "{source}.key",

                        actionChoices: "{gamepad.settings.ui.bindingsPanel}.options.actionChoices",
                        indexChoices: "{gamepad.settings.ui.bindingsPanel}.options.indexChoices",
                        availableIndexChoices: "{gamepad.settings.ui.bindingsPanel}.model.availableIndexChoices"
                    }
                }
            }
        },
        components: {
            addBindingPanel: {
                container: "{that}.dom.add",
                type: "gamepad.settings.ui.addBinding",
                options: {
                    model: {
                        actionChoices: "{gamepad.settings.ui.bindingsPanel}.options.actionChoices",

                        // indexChoices: "{gamepad.settings.ui.bindingsPanel}.options.indexChoices",
                        availableIndexChoices: "{gamepad.settings.ui.bindingsPanel}.model.availableIndexChoices"
                    }
                }
            }
        }
    });

    /**
     *
     * Transform that.model.draftBindings to a map that includes the key we require, and which is keyed in a way
     * that will support "lensing" UI components properly.
     *
     * @param {Object} originalBindings - The original bindings, keyed by axis/button index.
     * @return {Object} - A restructured object whose entries include the original index, keyed by index and action.
     *
     */
    gamepad.settings.ui.bindingsPanel.bindingsToComponentSources = function (originalBindings) {
        var componentSources = {};
        fluid.each(originalBindings, function (binding, index) {
            var consolidatedBinding = fluid.copy(binding);
            consolidatedBinding.index = index;
            consolidatedBinding.type = "gamepad.settings.ui.editBinding." + consolidatedBinding.action;

            var combinedKey = index + "-" + binding.action;
            componentSources[combinedKey] = consolidatedBinding;
        });
        return componentSources;
    };

    gamepad.settings.ui.bindingsPanel.resetDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "draftBindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "draftBindings", value: that.model.bindings });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();

        var addBindingPanel = that.locate("add");
        gamepad.inputMapperUtils.content.addTemporaryFocus(that, addBindingPanel[0]);
    };

    gamepad.settings.ui.bindingsPanel.flagDraftChanged = function (that) {
        var draftClean = gamepad.utils.isDeeplyEqual(that.model.draftBindings, that.model.bindings);
        that.applier.change("draftClean", draftClean);
    };

    gamepad.settings.ui.bindingsPanel.saveDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "bindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "bindings", value: that.model.draftBindings });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    // Keep track of which buttons/axes are already bound so that we can update the drop-down menus.
    gamepad.settings.ui.bindingsPanel.trackAvailableIndexChoices = function (that) {
        var transaction = that.applier.initiate();

        var availableIndexNumbers = [];
        for (var bindingIndex = 0; bindingIndex < that.model.totalIndexes; bindingIndex++) {
            if (that.model.draftBindings[bindingIndex] === undefined) {
                // `toString` is required because filterKeys doesn't work with numeric keys.
                availableIndexNumbers.push(bindingIndex.toString());
            }
        }

        var availableIndexChoices = fluid.filterKeys(that.options.indexChoices, availableIndexNumbers);

        transaction.fireChangeRequest({ path: "availableIndexChoices", type: "DELETE"});
        transaction.fireChangeRequest({ path: "availableIndexChoices", value: availableIndexChoices});
        transaction.commit();
    };

    /**
     *
     * The model from which this component was "sourced" has a totally different structure than the bindings we actually
     * want to preserve.  This function takes care of relaying changes back to the upstream structure, and in the
     * original format.
     *
     * @param {Object} that - The binding panel component.
     * @param {Object} change - See https://docs.fluidproject.org/infusion/development/changeapplierapi#the-special-context-change
     *
     */
    gamepad.settings.ui.bindingsPanel.reconcileChildComponentChanges = function (that, change) {
        fluid.each(change.value, function (singleBinding, compositeKey) {
            var transaction = that.applier.initiate();

            var draftBinding = fluid.get(that, ["model", "bindingComponentSources", compositeKey]);

            // We can't continue without an action, as it would result in an unusable component type.
            if (draftBinding.action) {
                var oldBinding = fluid.get(change, ["oldValue", compositeKey]);

                // Remove the material unique to component sources, i.e. the index and type.
                var filteredDraftBinding = fluid.filterKeys(draftBinding, ["action", "invert", "repeatRate", "scrollFactor", "background", "key"]);
                var filteredOldBinding = fluid.filterKeys(oldBinding, ["action", "invert", "repeatRate", "scrollFactor", "background", "key"]);

                if (!gamepad.utils.isDeeplyEqual(filteredDraftBinding, filteredOldBinding)) {
                    transaction.fireChangeRequest({ path: ["draftBindings", draftBinding.index], type: "DELETE"});
                    transaction.fireChangeRequest({ path: ["draftBindings", draftBinding.index], value: filteredDraftBinding });
                    transaction.commit();
                }
            }
        });
    };

    gamepad.settings.ui.bindingsPanel.addBinding = function (that, bindingComponentModel) {
        var bindingIndex = fluid.get(bindingComponentModel, "index");
        if (bindingIndex === undefined) {
            fluid.log(fluid.logLevel.ERROR, "Can't add binding because no index was provided.");
        }
        else if (that.model.draftBindings[bindingComponentModel.index]) {
            fluid.log(fluid.logLevel.ERROR, "Can't add binding because the requested index is already in use.");
        }
        else {
            var draftBindingContent = fluid.filterKeys(bindingComponentModel, ["action", "invert", "repeatRate", "scrollFactor", "background"]);
            that.applier.change(["draftBindings", bindingIndex], draftBindingContent);

            var addBindingPanel = that.locate("add");
            gamepad.inputMapperUtils.content.addTemporaryFocus(that, addBindingPanel[0]);
        }
    };

    gamepad.settings.ui.bindingsPanel.removeBinding = function (that, bindingComponentModel) {
        var focusIndexAfterRemove = 0;
        // bindingComponentSources is keyed by a constructed key rather than number, but we only care about the count.
        var sourceIndex = 0;
        fluid.each(that.model.bindingComponentSources, function (bindingComponentSource) {
            if (bindingComponentSource.index === bindingComponentModel.index) {
                focusIndexAfterRemove = sourceIndex > 1 ? sourceIndex - 1 : 0;
            }
            sourceIndex++;
        });

        var transaction = that.applier.initiate();
        var newDraftBindings = fluid.copy(that.model.draftBindings);
        delete newDraftBindings[bindingComponentModel.index];
        transaction.fireChangeRequest({ path: "draftBindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "draftBindings", value: newDraftBindings });
        transaction.commit();

        if (Object.keys(newDraftBindings).length > 0) {
            // Since the user was on the "remove" button of the component, move to the same button on the previous
            // binding (or the first binding if there is now only one).  Even if it takes too long for the model change to
            // result in the editBinding component and its markup being removed from the DOM, focus will not change again.
            var removeButtons = that.locate("removeButton");
            var removeButtonToFocus = fluid.get(removeButtons, focusIndexAfterRemove);
            if (removeButtonToFocus) {
                gamepad.inputMapperUtils.content.focus(removeButtonToFocus);
            }
        }
        else {
            var addBindingPanel = that.locate("add");
            gamepad.inputMapperUtils.content.addTemporaryFocus(that, addBindingPanel[0]);
        }
    };

    // Although there are joysticks with less buttons, the "standard" number of axes/buttons is described at:
    //
    // https://w3c.github.io/gamepad/#remapping
    //
    // Although this only describes 4 axes and 17 buttons, some controllers (Playstation, Switch) have an 18th button.

    // For future reference, on Windows there is a flag to enable support for the multitouch pad on PS4/5 controllers:
    //
    // chrome://flags/#enable-gamepad-multitouch
    //
    // We only support axes/buttons, but may add multitouch if this feature comes to other operating systems.

    fluid.defaults("gamepad.settings.ui.buttonsPanel", {
        gradeNames: ["gamepad.settings.ui.bindingsPanel"],
        actionChoices: gamepad.actions.choices.button,
        indexChoices: {
            "0": "A Button (Xbox), X Button (PS4/5), B Button (Switch)",
            "1": "B Button (Xbox), Circle Button (PS4/5), A Button (Switch)",
            "2": "X Button (Xbox), Square Button (PS4/5), Y (Switch)",
            "3": "Y Button (Xbox), Triangle Button (PS4/5)), X (Switch)",
            "4": "Left Bumper",
            "5": "Right Bumper",
            "6": "Left Trigger",
            "7": "Right Trigger",
            "8": "Back Button (Xbox), Share Button (PS4/5), Minus Button (Switch)",
            "9": "Start Button (Xbox), Options Button (PS4/5), Plus Button (Switch)",
            "10": "Left Thumbstick Button",
            "11": "Right Thumbstick Button",
            "12": "D-Pad, Up Button",
            "13": "D-Pad, Down Button",
            "14": "D-Pad, Left Button",
            "15": "D-Pad, Right Button",
            "16": "Badge Button (Xbox, PS4/5), Share Button (Switch)",
            "17": "Touchpad Click (PS4/5), Home Button (Switch)"
        },
        model: {
            totalIndexes: 18
        }
    });

    fluid.defaults("gamepad.settings.ui.axesPanel", {
        gradeNames: ["gamepad.settings.ui.bindingsPanel"],
        actionChoices: gamepad.actions.choices.axis,
        indexChoices: {
            "0": "Left Stick, Horizontal Axis",
            "1": "Left Stick, Vertical Axis",
            "2": "Right Stick, Horizontal Axis",
            "3": "Right Stick, Vertical Axis"
        },
        model: {
            totalIndexes: 4
        }
    });
})(fluid);
