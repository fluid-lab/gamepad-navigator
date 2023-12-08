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

    fluid.defaults("gamepad.settings.ui.prefsPanel", {
        gradeNames: ["gamepad.settings.ui.editableSection"],
        model: {
            label: "General Preferences",
            classNames: " gamepad-settings-prefs-panel",
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
                funcName: "gamepad.settings.ui.prefsPanel.resetDraft",
                args: ["{that}"]

            },
            draftPrefs: {
                excludeSource: "local",
                funcName: "gamepad.settings.ui.prefsPanel.flagDraftChanged",
                args: ["{that}"]
            }
        },
        invokers: {
            saveDraft: {
                funcName: "gamepad.settings.ui.prefsPanel.saveDraft",
                args: ["{that}"]
            },
            resetDraft: {
                funcName: "gamepad.settings.ui.prefsPanel.resetDraft",
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
                        description: "Vibrate when an action cannot be completed.",
                        checked: "{gamepad.settings.ui.prefsPanel}.model.draftPrefs.vibrate"
                    }
                }
            },
            openWindowOnStartup: {
                container: "{that}.dom.body",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        label: "Open Settings on Startup",
                        description: "Open this configuration panel on startup if no other controllable windows are open.",
                        checked: "{gamepad.settings.ui.prefsPanel}.model.draftPrefs.openWindowOnStartup"
                    }
                }
            },
            analogCutoff: {
                container: "{that}.dom.body",
                type: "gamepad.ui.rangeInput",
                options: {
                    model: {
                        label: "Analog Cutoff",
                        description: "Analog inputs below this value will be ignored.  Useful to avoid problems with &quot;jitter&quot; on thumb sticks, or to avoid accidentally triggering inputs.",

                        min: 0,
                        step: 0.05,
                        max: 0.95,
                        value: "{gamepad.settings.ui.prefsPanel}.model.draftPrefs.analogCutoff"
                    }
                }
            },
            newTabOrWindowURL: {
                container: "{that}.dom.body",
                type: "gamepad.ui.textInput",
                options: {
                    model: {
                        label: "New Page/Tab URL",
                        description: "This URL will be used when opening new tabs or windows.",
                        value: "{gamepad.settings.ui.prefsPanel}.model.draftPrefs.newTabOrWindowURL"
                    }
                }
            },
            pollingFrequency: {
                container: "{that}.dom.body",
                type: "gamepad.ui.rangeInput",
                options: {
                    model: {
                        label: "Polling Frequency",
                        description: "How often (in milliseconds) to check gamepads for input changes.",

                        min: 10,
                        step: 10,
                        max: 250,
                        value: "{gamepad.settings.ui.prefsPanel}.model.draftPrefs.pollingFrequency"
                    }
                }
            }
        }
    });

    gamepad.settings.ui.prefsPanel.resetDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "draftPrefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "draftPrefs", value: that.model.prefs });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };

    gamepad.settings.ui.prefsPanel.flagDraftChanged = function (that) {
        var draftClean = gamepad.utils.isDeeplyEqual(that.model.draftPrefs, that.model.prefs);
        that.applier.change("draftClean", draftClean);
    };

    gamepad.settings.ui.prefsPanel.saveDraft = function (that) {
        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "prefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "prefs", value: that.model.draftPrefs });
        transaction.fireChangeRequest({ path: "draftClean", value: true});

        transaction.commit();
    };
})(fluid);
