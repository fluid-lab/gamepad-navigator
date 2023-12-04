/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/
/* globals chrome */
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");
    fluid.defaults("gamepad.settings", {
        gradeNames: ["gamepad.templateRenderer"],
        injectionType: "replaceWith",
        markup: {
            container: "<div class='gamepad-settings-body'></div>"
        },
        model: {
            prefs: gamepad.prefs.defaults,
            bindings: gamepad.bindings.defaults
        },
        modelListeners: {
            prefs: {
                excludeSource: "init",
                funcName: "gamepad.settings.savePrefs",
                args: ["{that}.model.prefs"]
            },
            bindings: {
                excludeSource: "init",
                funcName: "gamepad.settings.saveBindings",
                args: ["{that}.model.bindings"]
            }
        },
        listeners: {
            "onCreate.loadSettings": {
                funcName: "gamepad.settings.loadSettings",
                args: ["{that}"]
            }
        },
        components: {
            prefs: {
                container: "{that}.container",
                type: "gamepad.config.prefs",
                options: {
                    model: {
                        prefs: "{gamepad.settings}.model.prefs"
                    }
                }
            }
            // buttonBindings: {
            //     container: "{that}.dom.body",
            //     type: "gamepad.config.bindings",
            //     options: {
            //         model: {
            //             label: "Buttons / Triggers",
            //             bindings: "{gamepad.settings}.model.bindings.buttons"
            //         }
            //     }
            // },
            // axisBindings: {
            //     container: "{that}.dom.body",
            //     type: "gamepad.config.bindings",
            //     options: {
            //         model: {
            //             label: "Axes (Thumb sticks)",
            //             bindings: "{gamepad.settings}.model.bindings.axes"
            //         }
            //     }
            // }
        }
    });

    gamepad.settings.loadSettings = async function (that) {
        gamepad.settings.loadPrefs(that);

        gamepad.settings.loadBindings(that);

        // In the similar function in input mapper, we add a listener for changes to values in local storage.  As we
        // have code to ensure that there is only open settings panel, and since only the settings panel can update
        // stored values, we should safely be able to avoid listening for local storage changes here.
    };

    gamepad.settings.loadPrefs = async function (that) {
        var storedPrefs = await gamepad.utils.getStoredKey("gamepad-prefs");
        var prefsToSave = storedPrefs || gamepad.prefs.defaults;

        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "prefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "prefs", value: prefsToSave });

        transaction.commit();
    };

    gamepad.settings.loadBindings = async function (that) {
        var storedBindings = await gamepad.utils.getStoredKey("gamepad-bindings");
        var bindingsToSave = storedBindings || gamepad.bindings.defaults;

        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "bindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "bindings", value: bindingsToSave });

        transaction.commit();
    };

    gamepad.settings.savePrefs = function (prefs) {
        var prefsEqualDefaults = gamepad.utils.isDeeplyEqual(gamepad.prefs.defaults, prefs);
        if (prefsEqualDefaults) {
            chrome.storage.local.remove("gamepad-prefs");
        }
        else {
            chrome.storage.local.set({ "gamepad-prefs": prefs });
        }
    };

    gamepad.settings.saveBindings = async function (bindings) {
        var bindingsEqualDefaults = gamepad.utils.isDeeplyEqual(gamepad.bindings.defaults, bindings);
        if (bindingsEqualDefaults) {
            chrome.storage.local.remove("gamepad-bindings");
        }
        else {
            chrome.storage.local.set({ "gamepad-bindings": bindings });
        }
    };

    fluid.defaults("gamepad.config.draftHandlingButton", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<button class='gamepad-settings-draft-button'>%label</button>"
        },
        model: {
            label: "Draft Button",
            disabled: true
        },
        modelRelay: {
            source: "{that}.model.disabled",
            target: "{that}.model.dom.container.attr.disabled"
        }
    });

    fluid.defaults("gamepad.config.draftHandlingButton.discard", {
        gradeNames: ["gamepad.config.draftHandlingButton"],
        model: {
            label: "Discard Changes"
        }
    });

    fluid.defaults("gamepad.config.draftHandlingButton.save", {
        gradeNames: ["gamepad.config.draftHandlingButton"],
        model: {
            label: "Save Changes"
        }
    });


    fluid.defaults("gamepad.config.editableSection", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-config-editable-section'><h3>%label</h3><div class='gamepad-config-editable-section-body'></div><div class='gamepad-config-editable-section-footer'></div></div>"
        },
        selectors: {
            body: ".gamepad-config-editable-section-body",
            footer: ".gamepad-config-editable-section-footer"
        },
        model: {
            label: "Editable Section",
            draftClean: true
        },
        components: {
            discardButton: {
                container: "{that}.dom.footer",
                type: "gamepad.config.draftHandlingButton.discard",
                options: {
                    model: {
                        disabled: "{gamepad.config.editableSection}.model.draftClean"
                    },
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{gamepad.config.draftHandlingButton}.container",
                            method: "click",
                            args: ["{gamepad.config.editableSection}.resetDraft"]
                        }
                    }
                }
            },
            saveButton: {
                container: "{that}.dom.footer",
                type: "gamepad.config.draftHandlingButton.save",
                options: {
                    model: {
                        disabled: "{gamepad.config.editableSection}.model.draftClean"
                    },
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{gamepad.config.draftHandlingButton}.container",
                            method: "click",
                            args: ["{gamepad.config.editableSection}.saveDraft"]
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

    /*
        analogCutoff: 0.25, // was 0.4

        newTabOrWindowURL: "https://www.google.com/",

        openWindowOnStartup: true,
        vibrate: true
    */

    fluid.defaults("gamepad.config.prefs", {
        gradeNames: ["gamepad.config.editableSection"],
        model: {
            label: "Preferences",
            prefs: {},
            draftPrefs: {}
        },
        modelRelay: {
            source: "prefs",
            target: "draftPrefs",
            backward: {
                excludeSource: "*"
            }
        },
        modelListeners: {
            prefs: {
                excludeSource: "init",
                funcName: "gamepad.config.prefs.resetDraft",
                args: ["{that}"]

            },
            draftPrefs: {
                excludeSource: "local",
                funcName: "gamepad.config.prefs.flagDraftChanged",
                args: ["{that}"]
            }
        },
        invokers: {
            saveDraft: {
                funcName: "gamepad.config.prefs.saveDraft",
                args: ["{that}"]
            },
            resetDraft: {
                funcName: "gamepad.config.prefs.resetDraft",
                args: ["{that}"]
            }
        },
        components: {
            vibrate: {
                container: "{that}.dom.body",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        label: "Vibrate",
                        checked: "{gamepad.config.prefs}.model.draftPrefs.vibrate"
                    }
                }
            },
            openWindowOnStartup: {
                container: "{that}.dom.body",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        label: "Open Settings on Startup",
                        checked: "{gamepad.config.prefs}.model.draftPrefs.openWindowOnStartup"
                    }
                }
            }
        }
    });

    gamepad.config.prefs.resetDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "draftPrefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "draftPrefs", value: that.model.prefs });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    gamepad.config.prefs.flagDraftChanged = function (that) {
        var draftClean = gamepad.utils.isDeeplyEqual(that.model.draftPrefs, that.model.prefs);
        that.applier.change("draftClean", draftClean);
    };

    gamepad.config.prefs.saveDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "prefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "prefs", value: that.model.draftPrefs });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    /*
        Existing options we need to display/edit (and actions that use them`)
            speedFactorOption: [
                "reverseTab",
                "forwardTab",
                "scrollLeft",
                "scrollRight",
                "scrollUp",
                "scrollDown",
                "scrollHorizontally",
                "scrollVertically",
                "thumbstickTabbing",
                "thumbstickHorizontalArrows",
                "thumbstickVerticalArrows"
            ],
            backgroundOption: ["openNewTab", "openNewWindow"],
            invertOption: [
                "scrollHorizontally",
                "scrollVertically",
                "thumbstickHistoryNavigation",
                "thumbstickTabbing",
                "thumbstickZoom",
                "thumbstickWindowSize",
                "thumbstickHorizontalArrows",
                "thumbstickVerticalArrows"
            ]

            In addition, we need to make the existing hard-coded "frequency" option configurable for everything except:

                key: "click",
                key: "openConfigPanel",
                key: "openSearchKeyboard",
                key: "openNewWindow",
                key: "openNewTab",
                key: "maximizeWindow",
                key: "restoreWindowSize",

                // On the fence, but on balance I'd rather they not be repeatable.
                key: "closeCurrentTab",
                key: "closeCurrentWindow",
                key: "reopenTabOrWindow",
                key: "previousPageInHistory",
                key: "nextPageInHistory",

            These should be repeatable:

                key: "goToPreviousWindow",
                key: "goToNextWindow",
                key: "goToPreviousTab",
                key: "goToNextTab",

                key: "reverseTab",
                key: "forwardTab",
                key: "scrollLeft",
                key: "scrollRight",
                key: "scrollUp",
                key: "scrollDown",
                key: "zoomIn",
                key: "zoomOut",
                key: "sendArrowLeft",
                key: "sendArrowRight",
                key: "sendArrowUp",
                key: "sendArrowDown",

        */

    // Component to edit a section of the bindings, i.e. only axes or buttons.
    fluid.defaults("gamepad.config.bindings", {
        gradeNames: ["gamepad.config.editableSection"],
        model: {
            label: "Bindings",
            bindings: {},
            draftBindings: "{that}.model.bindings"
        },
        modelListeners: {
            bindings: {
                excludeSource: "init",
                funcName: "gamepad.config.prefs.resetDraft",
                args: ["{that}"]

            },
            draftBindings: {
                excludeSource: "local",
                funcName: "gamepad.config.prefs.flagDraftChanged",
                args: ["{that}"]
            }
        },
        invokers: {
            saveDraft: {
                funcName: "gamepad.config.prefs.saveDraft",
                args: ["{that}"]
            },
            resetDraft: {
                funcName: "gamepad.config.prefs.resetDraft",
                args: ["{that}"]
            }
        }
    });

    gamepad.config.bindings.resetDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "draftBindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "draftBindings", value: that.model.bindings });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    gamepad.config.bindings.flagDraftChanged = function (that) {
        var draftClean = gamepad.utils.isDeeplyEqual(that.model.draftBindings, that.model.bindings);
        that.applier.change("draftClean", draftClean);
    };

    gamepad.config.bindings.saveDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "bindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "bindings", value: that.model.draftBindings });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    // TODO: As long as there are unbound buttons/axes, present an "add binding"
    // form at the bottom of each list.

    gamepad.settings(".gamepad-settings-body");
})(fluid);
