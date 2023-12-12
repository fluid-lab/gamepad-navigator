/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global chrome */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapper");


    fluid.defaults("gamepad.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base", "fluid.viewComponent"],
        model: {
            activeModal: false,
            shadowElement: false,
            textInputValue: "",
            textInputType: "",

            bindings: gamepad.bindings.defaults
        },
        modelListeners: {
            pageInView: {
                func: "gamepad.inputMapper.handlePageInViewChange",
                args: ["{that}"]
            },
            activeModal: {
                func: "{that}.updateTabbables"
            },
            textInputValue: {
                funcName: "gamepad.inputMapper.updateFormFieldText",
                args: ["{that}"]
            }
        },
        events: {
            onWindowFocus: null,
            onWindowBlur: null,
            onPageShow: null,
            onPageHide: null
        },

        listeners: {
            "onCreate.loadSettings": {
                funcName: "gamepad.inputMapper.loadSettings",
                args: ["{that}"]
            },

            // Wire up event listeners to window.
            "onCreate.handleWindowFocus": {
                funcName: "window.addEventListener",
                args: ["focus", "{that}.events.onWindowFocus.fire"]
            },
            "onCreate.handleWindowBlur": {
                funcName: "window.addEventListener",
                args: ["blur", "{that}.events.onWindowBlur.fire"]
            },
            "onCreate.handlePageShow": {
                funcName: "window.addEventListener",
                args: ["pageshow", "{that}.events.onPageShow.fire"]
            },
            "onCreate.handlePageHide": {
                funcName: "window.addEventListener",
                args: ["pagehide", "{that}.events.onPageHide.fire"]
            },

            // Handle window-related events
            "onWindowFocus": {
                funcName: "gamepad.inputMapper.handleFocused",
                args: ["{that}"]
            },
            "onPageShow": {
                funcName: "gamepad.inputMapper.handleFocused",
                args: ["{that}"]
            },
            "onWindowBlur": {
                funcName: "gamepad.inputMapper.handleBlurred",
                args: ["{that}"]
            },
            "onPageHide": {
                funcName: "gamepad.inputMapper.handleBlurred",
                args: ["{that}"]
            }
        },
        invokers: {
            // Actions, these are called with: actionOptions, inputType, index
            goToPreviousTab: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "goToPreviousTab" }]
            },
            goToNextTab: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "goToNextTab"}]
            },
            closeCurrentTab: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}",{ action: "closeCurrentTab"}]
            },
            openNewTab: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "openNewTab" }]
            },
            openNewWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "openNewWindow" }]
            },
            closeCurrentWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "closeCurrentWindow" }]
            },
            goToPreviousWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "goToPreviousWindow" }]
            },
            goToNextWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "goToNextWindow" }]
            },
            zoomIn: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "zoomIn" }]
            },
            zoomOut: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "zoomOut" }]
            },


            maximizeWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "maximizeWindow" }]
            },
            restoreWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "restoreWindowSize" }]
            },
            reopenTabOrWindow: {
                funcName: "gamepad.inputMapperUtils.background.postMessage",
                args: ["{that}", { action: "reopenTabOrWindow" }]
            },

            thumbstickZoom: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickZoom",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            thumbstickWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickWindowSize",
                args: ["{that}", "{arguments}.0", "{arguments}.2"] // value, actionOptions
            },

            openActionLauncher: {
                funcName: "gamepad.inputMapper.openActionLauncher",
                args: ["{that}"]
            },
            openSearchKeyboard: {
                funcName: "gamepad.inputMapper.openSearchKeyboard",
                args: ["{that}"]
            },
            openConfigPanel: {
                funcName: "gamepad.inputMapper.openConfigPanel",
                args: ["{that}"]
            }
        },
        components: {
            modalManager: {
                container: "{that}.container",
                type: "gamepad.modalManager",
                options: {
                    model: {
                        activeModal: "{gamepad.inputMapper}.model.activeModal",
                        lastExternalFocused: "{gamepad.inputMapper}.model.lastExternalFocused",
                        shadowElement: "{gamepad.inputMapper}.model.shadowElement",
                        textInputValue: "{gamepad.inputMapper}.model.textInputValue",
                        textInputType: "{gamepad.inputMapper}.model.textInputType",
                        selectElement: "{gamepad.inputMapper}.model.selectElement"
                    }
                }
            }
        }
    });

    gamepad.inputMapper.handleFocused = function (that) {
        that.applier.change("pageInView", true);
    };

    gamepad.inputMapper.handleBlurred = function (that) {
        that.applier.change("pageInView", false);
    };

    gamepad.inputMapper.updateFormFieldText = function (that) {
        if (that.model.lastExternalFocused && gamepad.inputMapperUtils.content.isTextInput(that.model.lastExternalFocused)) {
            that.model.lastExternalFocused.value = that.model.textInputValue;

            // TODO: Figure out a way to do this that doesn't require jQuery.
            $(that.model.lastExternalFocused).trigger("change");
        }
    };

    gamepad.inputMapper.generateModalOpenFunction = function (modalKey) {
        return function (that) {
            // In this case we don't want to fail over to a modal's activeElement.
            that.applier.change("lastExternalFocused", document.activeElement);

            that.applier.change("activeModal", modalKey);
        };
    };

    // We do this in a funky way because of our fixed method signature across actions.
    gamepad.inputMapper.openActionLauncher = gamepad.inputMapper.generateModalOpenFunction("actionLauncher");
    gamepad.inputMapper.openSearchKeyboard = gamepad.inputMapper.generateModalOpenFunction("searchKeyboard");

    gamepad.inputMapper.openConfigPanel = function (that) {
        gamepad.inputMapperUtils.background.postMessage(that, { action: "openOptionsPage"});
    };

    gamepad.inputMapper.handlePageInViewChange = function (that) {
        if (that.model.pageInView) {
            gamepad.inputMapper.loadSettings(that);
        }
        else {
            that.applier.change("activeModal", false);
        }
    };

    gamepad.inputMapper.loadSettings = async function (that) {
        gamepad.inputMapper.loadPrefs(that);

        gamepad.inputMapper.loadBindings(that);

        /*
            The two params for the onChanged listener callback are "changes" and "areaName".  In our case, "areaName" is
            always "local", so we ignore it. "changes" is an object with an entry for each changed key, as in:

            { "gamepad-prefs": newValue: {}}
        */

        chrome.storage.onChanged.addListener(function (changes) {
            if (changes["gamepad-prefs"]) {
                gamepad.inputMapper.loadPrefs(that);
            }

            if (changes["gamepad-bindings"]) {
                gamepad.inputMapper.loadBindings(that);
            }
        });
    };

    gamepad.inputMapper.loadPrefs = async function (that) {
        var storedPrefs = await gamepad.utils.getStoredKey("gamepad-prefs");
        var prefsToSave = storedPrefs || gamepad.prefs.defaults;

        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "prefs", type: "DELETE"});
        transaction.fireChangeRequest({ path: "prefs", value: prefsToSave });

        transaction.commit();
    };

    gamepad.inputMapper.loadBindings = async function (that) {
        var storedBindings = await gamepad.utils.getStoredKey("gamepad-bindings");
        var bindingsToSave = storedBindings || gamepad.bindings.defaults;

        var transaction = that.applier.initiate();

        transaction.fireChangeRequest({ path: "bindings", type: "DELETE"});
        transaction.fireChangeRequest({ path: "bindings", value: bindingsToSave });

        transaction.commit();
    };

    gamepad.inputMapperInstance = gamepad.inputMapper("body");
})(fluid, jQuery);
