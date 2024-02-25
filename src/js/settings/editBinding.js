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

    fluid.defaults("gamepad.ui.editBinding.base", {
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
                funcName: "gamepad.ui.editBinding.base.drawIcon",
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
                        action: "{gamepad.ui.editBinding.base}.model.action",
                        index: "{gamepad.ui.editBinding.base}.model.index"
                    }
                }
            }
        }
    });

    gamepad.ui.editBinding.base.drawIcon = function (that) {
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
    fluid.defaults("gamepad.ui.editBinding.hasParams", {
        gradeNames: ["gamepad.ui.editBinding.base"],
        model: {
            hideParams: true
        },
        markup: {
            container: "<div class='gamepad-settings-binding'><div class='gamepad-settings-binding-header'><div class='gamepad-settings-binding-description'></div><button tabindex=0 class='gamepad-settings-params-icon' aria-label='Configure options'></button><button class='gamepad-settings-binding-removeButton'>Remove Binding</button></div><div class='gamepad-settings-binding-params hidden'></div></div>"
        },
        invokers: {
            handleClick: {
                funcName: "gamepad.ui.editBinding.hasParams.handleClick",
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

    gamepad.ui.editBinding.hasParams.handleClick = function (that, event) {
        event.preventDefault();
        that.applier.change("hideParams", !that.model.hideParams);
    };

    // `background`: Whether to open a window/tab in the background.
    fluid.defaults("gamepad.ui.editBinding.supportsBackground", {
        model: {
            background: false
        },
        components: {
            background: {
                container: "{that}.dom.params",
                type: "gamepad.ui.bindingParam.toggle",
                options: {
                    model: {
                        label: "Background",
                        description: "Open the new window/tab in the background.",
                        value: "{gamepad.ui.editBinding.base}.model.background"
                    }
                }
            }
        }
    });

    // `repeatRate`: How often to repeat an action if the control is held down.  If set to zero, does not repeat.
    fluid.defaults("gamepad.ui.editBinding.supportsRepeatRate", {
        components: {
            repeatRate: {
                container: "{that}.dom.params",
                type: "gamepad.ui.bindingParam.rangeInput",
                options: {
                    model: {
                        label: "Repeat Rate",
                        description: "How often (in seconds) to repeat the action while the control is held down. Set to zero (0) to only respond once no matter how long the button is held.",
                        min: "0",
                        max: "1",
                        step: "0.05",
                        value: "{gamepad.ui.editBinding.base}.model.repeatRate"
                    },
                    components: {
                        input: {
                            options: {
                                templates: {
                                    summary: "Repeat every %value second(s)",
                                    noValue: "Do not repeat"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // `invert`: (For axes) whether to invert the direction of motion.
    fluid.defaults("gamepad.ui.editBinding.supportsInvert", {
        model: {
            invert: false
        },
        components: {
            invert: {
                container: "{that}.dom.params",
                type: "gamepad.ui.bindingParam.toggle",
                options: {
                    model: {
                        label: "Invert",
                        description: "Invert the axis input so that left is treated as right, et cetera.",
                        checked: "{gamepad.ui.editBinding.base}.model.invert"
                    }
                }
            }
        }
    });

    // `scrollFactor`: A multiplier for scroll operations.
    fluid.defaults("gamepad.ui.editBinding.supportsScrollFactor", {
        model: {
            scrollFactor: 0
        },
        components: {
            scrollFactor: {
                container: "{that}.dom.params",
                type: "gamepad.ui.bindingParam.rangeInput",
                options: {
                    model: {
                        label: "Scroll Factor",
                        description: "How far to scroll in one pass.",
                        min: "1",
                        max: "50",
                        step: "1",
                        value: "{gamepad.ui.editBinding.base}.model.scrollFactor"
                    }
                }
            }
        }
    });

    fluid.defaults("gamepad.ui.editBinding.supportsKey", {
        components: {
            key: {
                container: "{that}.dom.params",
                type: "gamepad.ui.bindingParam.selectInput",
                options: {
                    model: {
                        choices: {
                            "ArrowLeft": "left arrow",
                            "ArrowRight": "right arrow",
                            "ArrowUp": "up arrow",
                            "ArrowDown": "down arrow",
                            "Escape": "escape"
                        },
                        description: "The key to send.",
                        label: "Key",
                        selectedChoice: "{gamepad.ui.editBinding.base}.model.key"
                    }
                }
            }
        }
    });
    // Here are the individual grade names directly correlated with action names.

    // Actions with no additional parameters:
    fluid.defaults("gamepad.ui.editBinding.click", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.closeCurrentTab", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.closeCurrentWindow", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.duplicateTab", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.enterFullscreen", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.exitFullscreen", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.maximizeWindow", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.nextPageInHistory", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.openActionLauncher", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.openConfigPanel", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.openSearchKeyboard", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.previousPageInHistory", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.reloadTab", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.restoreWindowSize", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.editBinding.reopenTabOrWindow", { gradeNames: ["gamepad.ui.editBinding.base"] });
    fluid.defaults("gamepad.ui.bindingParam.toggleFocusFix", { gradeNames: ["gamepad.ui.editBinding.base"] });

    //Actions that only support the `background` parameter:
    fluid.defaults("gamepad.ui.editBinding.openNewTab", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsBackground"],
        model: gamepad.actions.button.openNewTab
    });

    fluid.defaults("gamepad.ui.editBinding.openNewWindow", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsBackground"],
        model: gamepad.actions.button.openNewWindow
    });

    //Actions that only support the `repeatRate` parameter:
    fluid.defaults("gamepad.ui.editBinding.tabForward", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.tabForward
    });

    fluid.defaults("gamepad.ui.editBinding.goToNextTab", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToNextTab
    });

    fluid.defaults("gamepad.ui.editBinding.goToNextWindow", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToNextWindow
    });

    fluid.defaults("gamepad.ui.editBinding.goToPreviousTab", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToPreviousTab
    });

    fluid.defaults("gamepad.ui.editBinding.goToPreviousWindow", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.goToPreviousWindow
    });

    fluid.defaults("gamepad.ui.editBinding.tabBackward", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.tabBackward
    });

    fluid.defaults("gamepad.ui.editBinding.zoomIn", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.zoomIn
    });

    fluid.defaults("gamepad.ui.editBinding.zoomOut", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate"],
        model: gamepad.actions.button.zoomOut
    });


    // Actions that support `repeatRate` and `key`:
    fluid.defaults("gamepad.ui.editBinding.sendKey", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsKey"],
        model: gamepad.actions.button.sendKey
    });

    // Actions that support `repeatRate` and `invert`:
    fluid.defaults("gamepad.ui.editBinding.thumbstickHistoryNavigation", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickHistoryNavigation
    });

    fluid.defaults("gamepad.ui.editBinding.thumbstickHorizontalArrows", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickHorizontalArrows
    });

    fluid.defaults("gamepad.ui.editBinding.thumbstickTabbing", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickTabbing
    });

    fluid.defaults("gamepad.ui.editBinding.thumbstickVerticalArrows", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickVerticalArrows
    });

    fluid.defaults("gamepad.ui.editBinding.thumbstickWindowSize", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickWindowSize
    });

    fluid.defaults("gamepad.ui.editBinding.thumbstickZoom", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert"],
        model: gamepad.actions.axis.thumbstickZoom
    });

    // Actions that support `repeatRate` and `scrollFactor`:
    fluid.defaults("gamepad.ui.editBinding.scrollDown", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollDown
    });

    fluid.defaults("gamepad.ui.editBinding.scrollLeft", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollLeft
    });

    fluid.defaults("gamepad.ui.editBinding.scrollRight", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollRight
    });

    fluid.defaults("gamepad.ui.editBinding.scrollUp", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.button.scrollUp
    });

    // Actions that support `repeatRate`, `invert`, and `scrollFactor`:
    fluid.defaults("gamepad.ui.editBinding.scrollHorizontally", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.axis.scrollHorizontally
    });

    fluid.defaults("gamepad.ui.editBinding.scrollVertically", {
        gradeNames: ["gamepad.ui.editBinding.hasParams", "gamepad.ui.editBinding.supportsRepeatRate", "gamepad.ui.editBinding.supportsInvert", "gamepad.ui.editBinding.supportsScrollFactor"],
        model: gamepad.actions.axis.scrollVertically
    });
})(fluid);
