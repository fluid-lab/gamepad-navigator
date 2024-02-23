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


    fluid.defaults("gamepad.shadowHolder", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-shadow-holder'></div>",
            styles: "<style>%styles</style>"
        },
        model: {
            shadowElement: false,

            // Inline all styles from JS-wrapped global namespaced variable.
            styles: gamepad.css
        },
        events: {
            onShadowReady: null
        },
        invokers: {
            "createShadow": {
                funcName: "gamepad.shadowHolder.createShadow",
                args: ["{that}"]
            }
        },
        listeners: {
            "onCreate.createShadow": {
                func: "{that}.createShadow",
                args: []
            }
        }
    });

    gamepad.shadowHolder.createShadow = function (that) {
        var host = that.container[0];
        var shadowElement = host.attachShadow({mode: "open"});

        // We inline all styles here so that all modals get the common styles,
        // and to avoid managing multiple shadow elements.
        var safeModel = fluid.filterKeys(that.model, ["shadowElement", "lastExternalFocused", "selectElement"], true);
        shadowElement.innerHTML = fluid.stringTemplate(that.options.markup.styles, safeModel);

        that.applier.change("shadowElement", shadowElement);
        that.events.onShadowReady.fire();
    };
})(fluid);
