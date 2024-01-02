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

    fluid.defaults("gamepad.settings.ui.editBinding.base", {
        gradeNames: ["gamepad.templateRenderer"],
        icon: gamepad.svg["options-icon"],
        markup: {
            container: "<div class='gamepad-settings-binding'><div class='gamepad-settings-binding-header'><div class='gamepad-settings-binding-description'></div><button tabindex=0 class='gamepad-settings-params-icon' aria-label='No configurable options' disabled></button><button class='gamepad-settings-binding-removeButton'>Remove Binding</button></div></div>"
        },
        selectors: {
            description: ".gamepad-settings-binding-description",
            toggleParams: ".gamepad-settings-params-icon",
            removeButton: ".gamepad-settings-binding-removeButton",
            params: ".gamepad-settings-binding-params"
        },
        model: {
            hideParams: true
        },
        modelListeners: {
            hideParams: [
                {
                    this: "{that}.dom.params",
                    method: "toggleClass",
                    args: ["hidden", "{change}.value"]
                }
            ]
        },
        invokers: {
            removeBinding: {
                func: "{gamepad.settings.ui.bindingsPanel}.removeBinding",
                args: ["{that}.model"] // bindingComponentModel
            }
        },
        listeners: {
            "onCreate.bindRemoveButton": {
                this: "{that}.dom.removeButton",
                method: "click",
                args: ["{that}.removeBinding"]
            },
            "onCreate.drawIcon": {
                funcName: "gamepad.settings.ui.editBinding.base.drawIcon",
                args: ["{that}"]
            }
        },
        components: {
            description: {
                container: "{that}.dom.description",
                type: "gamepad.settings.ui.bindingDescription",
                options: {
                    actionChoices: "{gamepad.settings.ui.bindingsPanel}.options.actionChoices",
                    indexChoices: "{gamepad.settings.ui.bindingsPanel}.options.indexChoices",

                    model: {
                        action: "{gamepad.settings.ui.editBinding.base}.model.action",
                        index: "{gamepad.settings.ui.editBinding.base}.model.index"
                    }
                }
            }
        }
    });

    gamepad.settings.ui.editBinding.base.drawIcon = function (that) {
        var iconElement = that.locate("toggleParams");
        iconElement.html(that.options.icon);
    };

    // Our unique UI components (custom select, etc.)

    fluid.defaults("gamepad.settings.ui.bindingDescription", {
        gradeNames: ["gamepad.templateRenderer"],
        actionChoices: {},
        indexChoices: {},
        markup: {
            container: "<span>When the <span class='index-description'>%indexDescription</span> is pressed, <span class='action-description'>%actionDescription</span>.</span>"
        },
        selectors: {
            actionDescription: ".action-description",
            indexDescription: ".index-description"
        },
        model: {
            action: false,
            actionDescription: "",
            index: false,
            indexDescription: ""
        },
        modelListeners: {
            action: {
                funcName: "gamepad.settings.ui.bindingDescription.choiceToDescription",
                args: ["{that}", "{that}.options.actionChoices", "{that}.model.action", "actionDescription"] // choices, choiceIndex, descriptionKey
            },
            index: {
                funcName: "gamepad.settings.ui.bindingDescription.choiceToDescription",
                args: ["{that}", "{that}.options.indexChoices", "{that}.model.index", "indexDescription"] // choices, choiceIndex, descriptionKey
            }
        },
        modelRelay: [
            {
                source: "indexDescription",
                target: "dom.indexDescription.text"
            },
            {
                source: "actionDescription",
                target: "dom.actionDescription.text"
            }
        ]
    });

    gamepad.settings.ui.bindingDescription.choiceToDescription = function (that, choices, choiceIndex, descriptionKey) {
        var choiceDescription = (choices && choices[choiceIndex]) || "???";
        that.applier.change(descriptionKey, choiceDescription);
    };

    fluid.defaults("gamepad.settings.ui.params.select", {
        gradeNames: ["gamepad.ui.select"],
        model: {
            availableChoices: {}
        },
        markup: {
            container: "<div class='gamepad-settings-params-select-input-container'><div class='gamepad-settings-params-select-header'><div class='gamepad-select-input-label'></div></div><div class='gamepad-settings-params-select-body'><div class='gamepad-select-input-description'></div><select class='gamepad-select-input-input'></div></div></div>"
        },
        modelListeners: {
            choices: {
                funcName: "gamepad.settings.ui.params.select.renderFilteredOptions",
                args: ["{that}.dom.select", "{that}.options.markup.option", "{that}.model.choices", "{that}.model.availableChoices", "{that}.model.selectedChoice"] // selectInputElement, optionTemplate, allChoices, availableChoices, selectedChoice
            }
        }
    });

    gamepad.settings.ui.params.select.renderFilteredOptions = function (selectInputElement, optionTemplate, allChoices, availableChoices, selectedChoice) {
        var renderedText = "";

        fluid.each(allChoices, function (description, value) {
            var selected = (value === selectedChoice) ? " selected" : "";
            var isAvailable = availableChoices[value] !== undefined;
            if (selected || isAvailable) {
                var singleOptionText = fluid.stringTemplate(optionTemplate, { selected, description, value});
                renderedText += singleOptionText;
            }
        });

        $(selectInputElement).html(renderedText);
    };

    // Mix-in grades for each supported parameter.
    fluid.defaults("gamepad.settings.ui.editBinding.hasParams", {
        gradeNames: ["gamepad.settings.ui.editBinding.base"],
        model: {
            hideParams: true
        },
        markup: {
            container: "<div class='gamepad-settings-binding'><div class='gamepad-settings-binding-header'><div class='gamepad-settings-binding-description'></div><button tabindex=0 class='gamepad-settings-params-icon' aria-label='Configure options'></button><button class='gamepad-settings-binding-removeButton'>Remove Binding</button></div><div class='gamepad-settings-binding-params hidden'></div></div>"
        },
        invokers: {
            handleClick: {
                funcName: "gamepad.settings.ui.editBinding.hasParams.handleClick",
                args: ["{that}", "{arguments}.0"] // event
            }
        },
        listeners: {
            "onCreate.bindParamsToggle": {
                this: "{that}.dom.toggleParams",
                method: "click",
                args: ["{that}.handleClick"]
            }
        }
    });

    gamepad.settings.ui.editBinding.hasParams.handleClick = function (that, event) {
        event.preventDefault();
        that.applier.change("hideParams", !that.model.hideParams);
    };

    // `background`: Whether to open a window/tab in the background.
    fluid.defaults("gamepad.settings.ui.editBinding.supportsBackground", {
        model: {
            background: false
        },
        components: {
            background: {
                container: "{that}.dom.params",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        label: "Background",
                        description: "Open the new window/tab in the background.",
                        value: "{gamepad.settings.ui.editBinding.base}.model.background"
                    }
                }
            }
        }
    });

    // `repeatRate`: How often to repeat an action if the control is held down.  If set to zero, does not repeat.
    fluid.defaults("gamepad.settings.ui.editBinding.supportsRepeatRate", {
        components: {
            repeatRate: {
                container: "{that}.dom.params",
                type: "gamepad.ui.rangeInput",
                options: {
                    templates: {
                        summary: "Repeat every %value second(s)",
                        noValue: "Do not repeat"
                    },
                    model: {
                        label: "Repeat Rate",
                        description: "How often (in seconds) to repeat the action while the control is held down. Set to zero (0) to only respond once no matter how long the button is held.",
                        min: "0",
                        max: "1",
                        step: "0.05",
                        value: "{gamepad.settings.ui.editBinding.base}.model.repeatRate"
                    }
                }
            }
        }
    });

    // `invert`: (For axes) whether to invert the direction of motion.
    fluid.defaults("gamepad.settings.ui.editBinding.supportsInvert", {
        model: {
            invert: false
        },
        components: {
            invert: {
                container: "{that}.dom.params",
                type: "gamepad.ui.toggle",
                options: {
                    model: {
                        label: "Invert",
                        description: "Invert the axis input so that left is treated as right, et cetera.",
                        checked: "{gamepad.settings.ui.editBinding.base}.model.invert"
                    }
                }
            }
        }
    });

    // `scrollFactor`: A multiplier for scroll operations.
    fluid.defaults("gamepad.settings.ui.editBinding.supportsScrollFactor", {
        model: {
            scrollFactor: 0
        },
        components: {
            scrollFactor: {
                container: "{that}.dom.params",
                type: "gamepad.ui.rangeInput",
                options: {
                    model: {
                        label: "Scroll Factor",
                        description: "How far to scroll in one pass.",
                        min: "1",
                        max: "50",
                        step: "1",
                        value: "{gamepad.settings.ui.editBinding.base}.model.scrollFactor"
                    }
                }
            }
        }
    });

    fluid.defaults("gamepad.settings.ui.editBinding.supportsKey", {
        keyChoices:  {
            "ArrowLeft": "left arrow",
            "ArrowRight": "right arrow",
            "ArrowUp": "up arrow",
            "ArrowDown": "down arrow",
            "Escape": "escape"
        },
        components: {
            key: {
                container: "{that}.dom.params",
                type: "gamepad.settings.ui.params.select",
                options: {
                    markup: {
                        container: "<div class='gamepad-select-input-container'>\n<div>Simulate pressing and releasing the following key:</div><select class='gamepad-select-input-input'></select>\n</div>"
                    },
                    model: {
                        label: "Key",
                        description: "The key to send.",
                        selectedChoice: "{gamepad.settings.ui.editBinding.base}.model.key",
                        choices: "{gamepad.settings.ui.editBinding.supportsKey}.options.keyChoices",
                        availableChoices: "{gamepad.settings.ui.editBinding.supportsKey}.options.keyChoices"
                    }
                }
            }
        }
    });
    // Here are the individual grade names directly correlated with action names.

    // Actions with no additional parameters:
    fluid.defaults("gamepad.settings.ui.editBinding.click", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.closeCurrentTab", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.closeCurrentWindow", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.enterFullscreen", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.exitFullscreen", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.maximizeWindow", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.nextPageInHistory", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.openActionLauncher", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.openConfigPanel", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.openSearchKeyboard", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.previousPageInHistory", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.reloadTab", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.restoreWindowSize", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });
    fluid.defaults("gamepad.settings.ui.editBinding.reopenTabOrWindow", { gradeNames: ["gamepad.settings.ui.editBinding.base"] });

    //Actions that only support the `background` parameter:
    fluid.defaults("gamepad.settings.ui.editBinding.openNewTab", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsBackground"],
        model: gamepad.actions.button.openNewTab
    });

    fluid.defaults("gamepad.settings.ui.editBinding.openNewWindow", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsBackground"],
        model: gamepad.actions.button.openNewWindow
    });

    //Actions that only support the `repeatRate` parameter:
    fluid.defaults("gamepad.settings.ui.editBinding.tabForward", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.tabForward
    });

    fluid.defaults("gamepad.settings.ui.editBinding.goToNextTab", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToNextTab
    });

    fluid.defaults("gamepad.settings.ui.editBinding.goToNextWindow", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToNextWindow
    });

    fluid.defaults("gamepad.settings.ui.editBinding.goToPreviousTab", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToPreviousTab
    });

    fluid.defaults("gamepad.settings.ui.editBinding.goToPreviousWindow", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToPreviousWindow
    });

    fluid.defaults("gamepad.settings.ui.editBinding.tabBackward", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.tabBackward
    });

    fluid.defaults("gamepad.settings.ui.editBinding.zoomIn", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.zoomIn
    });

    fluid.defaults("gamepad.settings.ui.editBinding.zoomOut", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.zoomOut
    });


    // Actions that support `repeatRate` and `key`:
    fluid.defaults("gamepad.settings.ui.editBinding.sendKey", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsKey"],
        model: gamepad.actions.button.sendKey
    });

    // Actions that support `repeatRate` and `invert`:
    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickHistoryNavigation", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickHistoryNavigation
    });

    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickHorizontalArrows", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickHorizontalArrows
    });

    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickTabbing", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickTabbing
    });

    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickVerticalArrows", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickVerticalArrows
    });

    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickWindowSize", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickWindowSize
    });

    fluid.defaults("gamepad.settings.ui.editBinding.thumbstickZoom", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickZoom
    });

    // Actions that support `repeatRate` and `scrollFactor`:
    fluid.defaults("gamepad.settings.ui.editBinding.scrollDown", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollDown
    });

    fluid.defaults("gamepad.settings.ui.editBinding.scrollLeft", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollLeft
    });

    fluid.defaults("gamepad.settings.ui.editBinding.scrollRight", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollRight
    });

    fluid.defaults("gamepad.settings.ui.editBinding.scrollUp", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollUp
    });

    // Actions that support `repeatRate`, `invert`, and `scrollFactor`:
    fluid.defaults("gamepad.settings.ui.editBinding.scrollHorizontally", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.axis.scrollHorizontally
    });

    fluid.defaults("gamepad.settings.ui.editBinding.scrollVertically", {
        gradeNames: ["gamepad.settings.ui.editBinding.hasParams", "gamepad.settings.ui.editBinding.supportsRepeatRate", "gamepad.settings.ui.editBinding.supportsInvert", "gamepad.settings.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.axis.scrollVertically
    });
})(fluid);
