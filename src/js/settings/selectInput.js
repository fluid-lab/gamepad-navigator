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

    fluid.defaults("gamepad.ui.select", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-select-input-container'>\n<select class='gamepad-select-input-input'></select>\n</div>",
            noneOption: "<option class='gamepad-select-option' value='none' selected disabled>%noneDescription</option>\n",
            option: "<option class='gamepad-select-option' value='%value'%selected>%description</option>\n"
        },
        selectors: {
            select: ".gamepad-select-input-input"
        },
        model: {
            noneOption: false,
            noneDescription: "Select an option",

            selectedChoice: false,
            // Should be a map of "value": "text description"
            choices: {
            }
        },
        modelRelay: [
            {
                source: "{that}.model.dom.select.value",
                target: "{that}.model.selectedChoice"
            }
        ],
        modelListeners: {
            choices: {
                funcName: "gamepad.ui.select.renderOptions",
                args: ["{that}.dom.select", "{that}.options.markup.option", "{that}.model.choices", "{that}.model.selectedChoice", "{that}.model.noneOption", "{that}.options.markup.noneOption", "{that}.model.noneDescription"] // selectInputElement, optionTemplate, choices, selectedChoice, hasNoneOption, noneOptionTemplate, noneDescription
            }
        }
    });

    gamepad.ui.select.renderOptions = function (selectInputElement, optionTemplate, choices, selectedChoice, hasNoneOption, noneOptionTemplate, noneDescription) {
        var renderedText = "";

        if (hasNoneOption) {
            var noneOptionText = fluid.stringTemplate(noneOptionTemplate, { noneDescription });
            renderedText += noneOptionText;
        }

        fluid.each(choices, function (description, value) {
            var selected = (value === selectedChoice) ? " selected" : "";
            var singleOptionText = fluid.stringTemplate(optionTemplate, { selected, description, value});
            renderedText += singleOptionText;
        });

        $(selectInputElement).html(renderedText);
    };

    fluid.defaults("gamepad.ui.bindingParam.selectInput", {
        gradeNames: ["gamepad.templateRenderer"],
        model: {
            label: "Select",
            description: ""
        },
        markup: {
            container:
                "<div class='gamepad-bindingParam-outer-container'>\n" +
                "\t<div class='gamepad-bindingParam-label'>%label</div>\n" +
                "\t<div class='gamepad-bindingParam-body'>\n" +
                "\t<div class='gamepad-bindingParam-description'>%description</div>\n" +
                "\t<div class='gamepad-select-input-container'>\n</div>\n" +
                "</div>\n"
        },
        selectors: {
            select: ".gamepad-select-input-container"
        },
        components: {
            select: {
                container: "{that}.dom.select",
                type: "gamepad.ui.select",
                options: {
                    model: {
                        choices: "{gamepad.ui.bindingParam.selectInput}.model.choices",
                        noneDescription: "{gamepad.ui.bindingParam.selectInput}.model.noneDescription",
                        noneOption: "{gamepad.ui.bindingParam.selectInput}.model.noneOption",
                        selectedChoice: "{gamepad.ui.bindingParam.selectInput}.model.selectedChoice"
                    }
                }
            }
        }
    });
})(fluid);
