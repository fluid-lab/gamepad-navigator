/*
Copyright (c) 2020 The Gamepad Navigator Authors
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
            textInputType: ""
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
            "onCreate.updateControls": {
                funcName: "gamepad.inputMapper.updateControls",
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
            // Actions, these are called with: value, speedFactor, invert, background, oldValue, homepageURL
            goToPreviousTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToPreviousTab", "{arguments}.0", "{arguments}.4"]
            },
            goToNextTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToNextTab", "{arguments}.0", "{arguments}.4"]
            },
            closeCurrentTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "closeCurrentTab", "{arguments}.0", "{arguments}.4"]
            },
            openNewTab: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "openNewTab", "{arguments}.0", "{arguments}.4", "{arguments}.3", "{arguments}.5"]
            },
            openNewWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "openNewWindow", "{arguments}.0", "{arguments}.4", "{arguments}.3", "{arguments}.5"]
            },
            closeCurrentWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "closeCurrentWindow", "{arguments}.0", "{arguments}.4"]
            },
            goToPreviousWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToPreviousWindow", "{arguments}.0", "{arguments}.4"]
            },
            goToNextWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "goToNextWindow", "{arguments}.0", "{arguments}.4"]
            },
            zoomIn: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "zoomIn", "{arguments}.0", "{arguments}.4"]
            },
            zoomOut: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "zoomOut", "{arguments}.0", "{arguments}.4"]
            },
            thumbstickZoom: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickZoom",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            maximizeWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "maximizeWindow", "{arguments}.0", "{arguments}.4"]
            },
            restoreWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "restoreWindowSize", "{arguments}.0", "{arguments}.4"]
            },
            thumbstickWindowSize: {
                funcName: "gamepad.inputMapperUtils.background.thumbstickWindowSize",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            reopenTabOrWindow: {
                funcName: "gamepad.inputMapperUtils.background.sendMessage",
                args: ["{that}", "reopenTabOrWindow", "{arguments}.0", "{arguments}.4"]
            },
            openActionLauncher: {
                funcName: "gamepad.inputMapper.openActionLauncher",
                args: ["{that}", "{arguments}.0", "{arguments}.4"] // value, oldValue
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
                        textInputType: "{gamepad.inputMapper}.model.textInputType"
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
        }
    };

    gamepad.inputMapper.openActionLauncher = function (that, value, oldValue) {
        if (that.model.pageInView && value && !oldValue) {
            // In this case we don't want to fail over to a modal's activeElement.
            that.applier.change("lastExternalFocused", document.activeElement);

            that.applier.change("activeModal", "actionLauncher");
        }
    };

    gamepad.inputMapper.handlePageInViewChange = function (that) {
        if (that.model.pageInView) {
            gamepad.inputMapper.updateControls(that);
            // TODO: Restore focus.
        }
        else {
            that.applier.change("activeModal", false);
        }
    };

    /**
     *
     * (Re)load the gamepad configuration from local storage.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.updateControls = function (that) {
        if (that.model.pageInView) {
            chrome.storage.local.get(["gamepadConfiguration"], function (configWrapper) {
                var gamepadConfig = configWrapper.gamepadConfiguration;

                // Update the gamepad configuration only if it's available.
                if (gamepadConfig) {
                    that.applier.change("map", gamepadConfig);
                }
            });
        }
    };

    gamepad.inputMapperInstance = gamepad.inputMapper("body");
})(fluid, jQuery);
