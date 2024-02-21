/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
/* globals chrome */
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");
    fluid.defaults("gamepad.settings.ui.mainPanel", {
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
            },
            "onCreate.addSettingsChangeListener": {
                funcName: "gamepad.settings.ui.addSettingsChangeListener",
                args: ["{that}"]
            }
        },
        components: {
            prefsPanel: {
                container: "{that}.container",
                type: "gamepad.settings.ui.prefsPanel",
                options: {
                    model: {
                        prefs: "{gamepad.settings.ui.mainPanel}.model.prefs"
                    }
                }
            },
            buttonsPanel: {
                container: "{that}.container",
                type: "gamepad.settings.ui.buttonsPanel",
                options: {
                    model: {
                        label: "Buttons / Triggers",
                        bindings: "{gamepad.settings.ui.mainPanel}.model.bindings.buttons"
                    }
                }
            },
            axesPanel: {
                container: "{that}.container",
                type: "gamepad.settings.ui.axesPanel",
                options: {
                    model: {
                        label: "Axes (Thumb sticks)",
                        bindings: "{gamepad.settings.ui.mainPanel}.model.bindings.axes"
                    }
                }
            }
        }
    });

    gamepad.settings.ui.addSettingsChangeListener = function (that) {
        chrome.storage.onChanged.addListener(function (changes) {
            if (changes["gamepad-prefs"]) {
                gamepad.settings.loadPrefs(that);
            }

            if (changes["gamepad-bindings"]) {
                gamepad.settings.loadBindings(that);
            }
        });
    };

    window.component = gamepad.settings.ui.mainPanel(".gamepad-settings-body");
})(fluid);
