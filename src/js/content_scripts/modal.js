/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global ally */
// TODO: Convert to using new-style modelListeners and model relays for
// "close" button.
// https://github.com/fluid-project/infusion/blob/main/tests/framework-tests/core/js/FluidIoCViewTests.js#L320-L423

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.modal", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            classNames: "",
            hidden: true
        },
        modelListeners: {
            hidden: [
                {
                    this: "{that}.container",
                    method: "toggleClass",
                    args: ["hidden", "{change}.value"]
                },
                {
                    funcName: "gamepad.modal.wrapFocusOnOpen",
                    args: ["{that}", "{change}.value"]
                }
            ]
        },
        selectors: {
            icon: ".modal-icon",
            innerContainer: ".modal-inner-container",
            modalBody: ".modal-body",
            modalCloseButton: ".modal-close-button",
            leadingFocusTrap: ".modal-focus-trap-leading",
            trailingFocusTrap: ".modal-focus-trap-trailing"
        },
        markup: {
            // TODO: Add the ability to retrieve our icon URL and display the icon onscreen.
            container: "<div class='modal-outer-container%classNames'><div class='modal-focus-trap modal-focus-trap-leading' tabindex=0></div>\n<div class='modal-inner-container'>\n\t<div class='modal-header'><h3>%label</h3></div>\n<div class='modal-body'></div>\n<div class='modal-footer'><button class='modal-close-button'>Close</button></div>\n</div><div class='modal-focus-trap modal-focus-trap-trailing' tabindex=0></div>\n</div>"
        },
        invokers: {
            closeModal: {
                funcName: "gamepad.modal.closeModal",
                args: ["{gamepad.modalManager}", "{arguments}.0"] // event
            },
            handleKeydown: {
                funcName: "gamepad.modal.handleKeydown",
                args: ["{that}", "{arguments}.0"] // event

            },
            handleOuterContainerClick: {
                funcName: "gamepad.modal.handleOuterContainerClick",
                args: ["{that}", "{arguments}.0"] // event
            },
            focusFirst: {
                funcName: "gamepad.modal.wrapFocus",
                args: ["{that}"]
            },
            focusLast: {
                funcName: "gamepad.modal.wrapFocus",
                args: ["{that}", true]
            }
        },
        listeners: {
            "onCreate.bindOuterContainerClick": {
                this: "{that}.container",
                method: "click",
                args: ["{that}.handleOuterContainerClick"]

            },
            "onCreate.bindKeydownFocusTrap": {
                this: "{that}.container",
                method: "keydown",
                args: ["{that}.handleKeydown"]
            },
            "onCreate.bindFocusTrapForwardWrap": {
                this: "{that}.dom.trailingFocusTrap",
                method: "focus",
                args: ["{that}.focusFirst"]
            },
            "onCreate.bindFocusTrapBackwardWrap": {
                this: "{that}.dom.leadingFocusTrap",
                method: "focus",
                args: ["{that}.focusLast"]
            },
            "onCreate.bindCloseButtonClick": {
                this: "{that}.dom.modalCloseButton",
                method: "click",
                args: "{that}.closeModal"
            }
        }
    });

    gamepad.modal.handleOuterContainerClick = function (that, event) {
        var innerContainer = that.locate("innerContainer");
        var targetInsideContainer = innerContainer[0].contains(event.target);

        if (!targetInsideContainer) {
            that.closeModal(event);
        }
    };

    gamepad.modal.handleKeydown = function (that, event) {
        if (event.key === "Escape") {
            that.closeModal(event);
        }
        else {
            var innerContainer = that.locate("innerContainer");
            var targetInsideContainer = innerContainer[0].contains(event.target);
            if (!targetInsideContainer) {
                event.preventDefault();
            }
        }
    };

    /**
     *
     * @param {Object} modalManager - The modal manager component.
     * @param {Event} event - The event to which we are responding.
     */
    gamepad.modal.closeModal = function (modalManager, event) {
        event.preventDefault();
        modalManager.applier.change("activeModal", false);
        if (modalManager.model.lastExternalFocused && modalManager.model.lastExternalFocused.focus) {
            modalManager.model.lastExternalFocused.focus();
        }
    };

    /**
     *
     * While our modal is open, tab navigation is limited to elements within
     * the modal. This function is used to wrap around when we hit the end of
     * "our" elements.
     *
     * @param {Object} that - The modal component.
     * @param {Boolean} reverse - Whether to navigate backwards.
     *
     */
    gamepad.modal.wrapFocus = function (that, reverse) {
        var innerContainer = that.locate("innerContainer");

        // Search for tabbables, focus on first or last element depending.
        var tabbableElements = ally.query.tabsequence({ context: innerContainer, strategy: "strict" });
        if (tabbableElements.length) {
            var elementIndex = reverse ? tabbableElements.length - 1 : 0;
            var elementToFocus = tabbableElements[elementIndex];
            elementToFocus.focus();
        }
    };

    // Focus on the first element on initial open.
    gamepad.modal.wrapFocusOnOpen = function (that, hidden) {
        if (!hidden) {
            that.focusFirst();
        }
    };

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
                        hidden: "{gamepad.modalManager}.model.hideActionLauncher"
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
                        textInputValue: "{gamepad.modalManager}.model.textInputValue",
                        textInputType: "{gamepad.modalManager}.model.textInputType"
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

        transaction.commit();
    };
})(fluid);
