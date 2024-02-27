(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.focusOverlay.pointer", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-navigator-focus-overlay-pointer'></div>"
        },
        listeners: {
            "onCreate.listenForWindowFocusEvents": {
                funcName: "gamepad.focusOverlay.pointer.listenForWindowFocusEvents",
                args: ["{that}"]
            }
        },
        invokers: {
            handleFocusin: {
                funcName: "gamepad.focusOverlay.pointer.handleFocusin",
                args: ["{that}", "{arguments}.0"] // event
            }
        },
        modelListeners: {
            modalManagerShadowElement: {
                funcName: "gamepad.focusOverlay.pointer.listenForModalFocusEvents",
                args: ["{that}"]
            }
        }
    });

    gamepad.focusOverlay.pointer.listenForWindowFocusEvents = function (that) {
        window.addEventListener("focusin", that.handleFocusin);
    };

    gamepad.focusOverlay.pointer.listenForModalFocusEvents = function (that) {
        var modalManagerShadowElement = fluid.get(that, "model.modalManagerShadowElement");
        if (modalManagerShadowElement) {
            modalManagerShadowElement.addEventListener("focusin", that.handleFocusin);
        }
    };

    gamepad.focusOverlay.pointer.handleFocusin = function (that) {
        var containerDomElement = that.container[0];

        var activeElement = fluid.get(that.model, "modalManagerShadowElement.activeElement") || document.activeElement;

        var clientRect = activeElement.getBoundingClientRect();

        // Our outline is three pixels, so we adjust everything accordingly.
        containerDomElement.style.left   = (clientRect.x + window.scrollX - 3) + "px";
        containerDomElement.style.top    = (clientRect.y + window.scrollY - 3) + "px";
        containerDomElement.style.height = (clientRect.height) + "px";
        containerDomElement.style.width  = (clientRect.width) + "px";

        var elementStyles = getComputedStyle(activeElement);
        var borderRadiusValue = elementStyles.getPropertyValue("border-radius");
        if (borderRadiusValue.length) {
            containerDomElement.style.borderRadius = borderRadiusValue;
        }
        else {
            containerDomElement.style.borderRadius = 0;
        }
    };

    fluid.defaults("gamepad.focusOverlay", {
        gradeNames: ["gamepad.shadowHolder"],
        markup: {
            container: "<div class='gamepad-navigator-focus-overlay'></div>"
        },
        model: {
            shadowElement: false,

            modalManagerShadowElement: false,

            prefs: {},
            hideFocusOverlay: true
        },
        modelRelay: {
            hideFocusOverlay: {
                source: "{that}.model.hideFocusOverlay",
                target: "{that}.model.dom.container.attr.hidden"
            }
        },
        components: {
            pointer: {
                container: "{that}.model.shadowElement",
                type: "gamepad.focusOverlay.pointer",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        modalManagerShadowElement: "{gamepad.focusOverlay}.model.modalManagerShadowElement"
                    }
                }
            }
        },
        modelListeners: {
            prefs: {
                excludeSource: "init",
                funcName: "gamepad.focusOverlay.shouldDisplayOverlay",
                args: ["{that}"]
            },
            modalManagerShadowElement: {
                funcName: "gamepad.focusOverlay.listenForModalFocusEvents",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.listenForWindowFocusEvents": {
                funcName: "gamepad.focusOverlay.listenForWindowFocusEvents",
                args: ["{that}"]
            }
        },
        invokers: {
            shouldDisplayOverlay: {
                funcName: "gamepad.focusOverlay.shouldDisplayOverlay",
                args: ["{that}", "{arguments}.0"] // event
            }
        }
    });

    gamepad.focusOverlay.shouldDisplayOverlay = function (that) {
        var activeElement = fluid.get(that.model, "modalManagerShadowElement.activeElement") || document.activeElement;
        var fixFocus = fluid.get(that, "model.prefs.fixFocus") ? true : false;
        var hideFocusOverlay =  !fixFocus || !activeElement;
        that.applier.change("hideFocusOverlay", hideFocusOverlay);
    };

    gamepad.focusOverlay.listenForWindowFocusEvents = function (that) {
        window.addEventListener("focusin", that.shouldDisplayOverlay);
        window.addEventListener("focusout", that.shouldDisplayOverlay);
    };

    gamepad.focusOverlay.listenForModalFocusEvents = function (that) {
        var modalManagerShadowElement = fluid.get(that, "model.modalManagerShadowElement");
        if (modalManagerShadowElement) {
            modalManagerShadowElement.addEventListener("focusin", that.shouldDisplayOverlay);
            modalManagerShadowElement.addEventListener("focusout", that.shouldDisplayOverlay);
        }
    };
})(fluid);
