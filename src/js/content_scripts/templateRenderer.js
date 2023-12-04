/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

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
    var gamepad = gamepad || fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.templateRenderer", {
        gradeNames: ["fluid.containerRenderingView"],
        markup: {
            container: "<div></div>"
        },
        model: {},
        invokers: {
            renderMarkup: {
                funcName: "gamepad.templateRenderer.render",
                args: ["{that}", "{that}.options.markup.container", "{that}.model"]
            }
        }
    });

    gamepad.templateRenderer.render = function (that, markupTemplate, model) {
        var renderedContent = fluid.stringTemplate(markupTemplate, model);
        return renderedContent;
    };
})(fluid);
