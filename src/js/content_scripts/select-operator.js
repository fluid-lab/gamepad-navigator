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

    fluid.defaults("gamepad.selectOperator", {
        gradeNames: ["gamepad.modal"],
        model: {
            classNames: " selectOperator-modal",
            closeButtonLabel: "Cancel",
            label: "Gamepad Navigator: Select Option",
            selectElement: false,
            items: {}
        },

        modelListeners: {
            selectElement: {
                funcName: "gamepad.selectOperator.generateItemsFromSelect",
                args: ["{that}"]
            }
        },

        invokers: {
            handleItemClick: {
                funcName: "gamepad.selectOperator.handleItemClick",
                args: ["{that}", "{arguments}.0", "{arguments}.1"] // nodeIndex, event
            }
        },

        components: {
            listSelector: {
                type: "gamepad.ui.listSelector",
                container: "{that}.dom.modalBody",
                options: {
                    model: {
                        description: "Select an option from the list below or hit &quot;Cancel&quot; to close this modal.  Only selectable items are displayed.",
                        items: "{gamepad.selectOperator}.model.items"
                    },
                    invokers: {
                        handleItemClick: {
                            func: "{gamepad.selectOperator}.handleItemClick",
                            args: ["{arguments}.0", "{arguments}.1"] // nodeIndex, event
                        }
                    }
                }
            }
        }
    });

    gamepad.selectOperator.generateItemsFromSelect = function (that) {
        var selectElement = fluid.get(that.model, "selectElement");

        if (selectElement) {
            var generatedItems = {};

            for (var nodeIndex = 0; nodeIndex < selectElement.children.length; nodeIndex++) {
                var childNode = selectElement.children.item(nodeIndex);
                var isHidden = childNode.getAttribute("hidden") !== null ? true : false;
                var isDisabled = childNode.getAttribute("disabled") !== null ? true : false;
                var isSelected = childNode.getAttribute("selected") !== null ? true : false;

                if (childNode.nodeName === "OPTION" && !isHidden && !isDisabled) {
                    generatedItems[nodeIndex] = {
                        description: childNode.textContent,
                        selected: isSelected
                    };
                }
            }

            var transaction = that.applier.initiate();
            transaction.fireChangeRequest({ path: "items", type: "DELETE" });
            transaction.fireChangeRequest({ path: "items", value: generatedItems });
            transaction.commit();
        }
    };

    gamepad.selectOperator.handleItemClick = function (that, nodeIndexString, event) {
        var nodeIndex = parseInt(nodeIndexString);

        var selectElement = fluid.get(that, "model.selectElement");
        if (selectElement) {
            if (selectElement.multiple) {
                // Toggle the clicked option without affecting any other selected values.
                var clickedOptionElement = selectElement.children[nodeIndex];
                if (clickedOptionElement.selected) {
                    clickedOptionElement.removeAttribute("selected");
                }
                else {
                    clickedOptionElement.setAttribute("selected", "");
                }
            }
            else {
                for (var optionIndex = 0; optionIndex < selectElement.children.length; optionIndex++) {
                    var optionElement = selectElement.children[optionIndex];
                    // Only select the option that was clicked.
                    if (optionIndex === nodeIndex) {
                        var optionValue = optionElement.value;

                        // Just setting the value doesn't property trigger a change.
                        $(selectElement).val(optionValue);

                        optionElement.setAttribute("selected", "");
                    }
                    // Clear the selected attribute for the rest.
                    else {
                        optionElement.removeAttribute("selected");
                    }
                }
            }
            selectElement.dispatchEvent(new Event("change"));
        }

        var transaction = that.applier.initiate();
        transaction.fireChangeRequest({ path: "items", type: "DELETE" });
        transaction.fireChangeRequest({ path: "items", value: {} });
        transaction.fireChangeRequest({ path: "selectElement", value: false });
        transaction.commit();

        that.closeModal(event);
        selectElement.focus();
    };
})(fluid);
