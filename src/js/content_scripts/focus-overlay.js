(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.focusOverlay.pointer", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-navigator-focus-overlay-pointer' hidden></div>"
        },
        model: {
            focusOverlayElement: false,
            hideFocusOverlay: true
        },
        modelListeners: {
            focusOverlayElement: {
                excludeSource: "init",
                funcName: "gamepad.focusOverlay.pointer.trackFocusOverlayElement",
                args: ["{that}"]
            }
        },
        modelRelay: {
            hideFocusOverlay: {
                source: "{that}.model.hideFocusOverlay",
                target: "{that}.model.dom.container.attr.hidden"
            }
        }
    });

    gamepad.focusOverlay.pointer.trackFocusOverlayElement = function (that) {
        var containerDomElement = that.container[0];
        if (that.model.focusOverlayElement) {
            var clientRect = that.model.focusOverlayElement.getBoundingClientRect();

            // Our outline is three pixels, so we adjust everything accordingly.
            containerDomElement.style.left   = (clientRect.x + window.scrollX - 3) + "px";
            containerDomElement.style.top    = (clientRect.y + window.scrollY - 3) + "px";
            containerDomElement.style.height = (clientRect.height) + "px";
            containerDomElement.style.width  = (clientRect.width) + "px";

            var elementStyles = getComputedStyle(that.model.focusOverlayElement);
            var borderRadiusValue = elementStyles.getPropertyValue("border-radius");
            if (borderRadiusValue.length) {
                containerDomElement.style.borderRadius = borderRadiusValue;
            }
            else {
                containerDomElement.style.borderRadius = 0;
            }
        }
        else {
            containerDomElement.style.height = 0;
            containerDomElement.style.width = 0;
            containerDomElement.style.borderRadius = 0;
        }
    };

    fluid.defaults("gamepad.focusOverlay", {
        gradeNames: ["gamepad.shadowHolder"],
        markup: {
            container: "<div class='gamepad-navigator-focus-overlay'></div>"
        },
        model: {
            activeModal: false,
            shadowElement: false,

            focusOverlayElement: "{gamepad.focusOverlay}.model.focusOverlayElement",
            prefs: {},
            hideFocusOverlay: true
        },
        components: {
            pointer: {
                container: "{that}.model.shadowElement",
                type: "gamepad.focusOverlay.pointer",
                createOnEvent: "onShadowReady",
                options: {
                    model: {
                        focusOverlayElement: "{gamepad.focusOverlay}.model.focusOverlayElement",
                        hideFocusOverlay: "{gamepad.focusOverlay}.model.hideFocusOverlay"
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
            focusOverlayElement: {
                excludeSource: "init",
                funcName: "gamepad.focusOverlay.shouldDisplayOverlay",
                args: ["{that}"]
            },
            activeModal: {
                excludeSource: "init",
                funcName: "gamepad.focusOverlay.shouldDisplayOverlay",
                args: ["{that}"]
            }
        }
    });

    gamepad.focusOverlay.shouldDisplayOverlay = function (that) {
        var fixFocus = fluid.get(that, "model.prefs.fixFocus") ? true : false;
        var hideFocusOverlay = !fixFocus || !that.model.focusOverlayElement;
        that.applier.change("hideFocusOverlay", hideFocusOverlay);
    };
})(fluid);
