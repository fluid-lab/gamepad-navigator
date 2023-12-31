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

    fluid.defaults("gamepad.searchKeyboard.searchButton", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<button class='gamepad-navigator-searchKeyboard-search-button'>Search</button>"
        }
    });

    fluid.defaults("gamepad.searchKeyboard.modal", {
        gradeNames: ["gamepad.osk.modal.base"],
        model: {
            label: "Gamepad Navigator: Search",
            classNames: " gamepad-navigator-searchKeyboard"
        },

        invokers: {
            handleSearchButtonClick: {
                funcName: "gamepad.searchKeyboard.modal.handleSearchButtonClick",
                args: ["{that}", "{inputMapper}", "{arguments}.0"]
            }
        },

        components: {
            input: {
                options: {
                    model: {
                        composition: "{gamepad.searchKeyboard.modal}.model.inputValue"
                    }
                }
            },
            searchButton: {
                container: "{that}.dom.modalFooter",
                type: "gamepad.searchKeyboard.searchButton",
                options: {
                    listeners: {
                        "onCreate.bindClick": {
                            this: "{searchButton}.container",
                            method: "click",
                            args: ["{gamepad.searchKeyboard.modal}.handleSearchButtonClick"]
                        }
                    }
                }
            }
        }
    });

    gamepad.searchKeyboard.modal.handleSearchButtonClick = function (that, inputMapper, event) {
        that.applier.change("activeModal", false);
        event.preventDefault();

        if (that.model.inputValue && that.model.inputValue.trim().length) {
            var actionOptions = {
                action: "search",
                // See: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/search/query
                disposition: "NEW_TAB",
                text: that.model.inputValue.trim()
            };

            gamepad.inputMapperUtils.background.postMessage(inputMapper, actionOptions);
        }
    };
})(fluid);
