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

    fluid.defaults("gamepad.ui.listSelector", {
        gradeNames: ["gamepad.templateRenderer"],
        markup: {
            container: "<div class='gamepad-list-selector'><p class='gamepad-list-selector-description'>%description</p><div class='gamepad-list-selector-items'></div></div>",
            item: "<div class='gamepad-list-selector-item gamepad-list-selector-active-item' tabindex=0>%description</div>"
        },
        selectors: {
            items: ".gamepad-list-selector-items",
            activeItems: ".gamepad-list-selector-active-item"
        },
        model: {
            description: "",
            focusedItemIndex: 0,
            items: {}
        },
        invokers: {
            handleFocusChange: {
                funcName: "gamepad.ui.listSelector.handleFocusChange",
                args: ["{that}"]
            },
            // This will be added by grades that extend this one.
            handleItemClick: {
                funcName: "fluid.notImplemented"
            },
            handleKeydown: {
                funcName: "gamepad.ui.listSelector.handleKeydown",
                args: ["{that}", "{arguments}.0"] // event
            },
            renderItems: {
                funcName: "gamepad.ui.listSelector.renderItems",
                args: ["{that}", "{that}.dom.items", "{that}.model.items"] // itemContainer, items
            }
        },
        modelListeners: {
            items: {
                func: "{that}.renderItems"
            },
            focusedItemIndex: {
                func: "{that}.handleFocusChange"
            }
        },
        listeners: {
            "onCreate.bindKeydown": {
                this: "{that}.container",
                method: "keydown",
                args: ["{that}.handleKeydown"]
            },
            "onCreate.renderItems": {
                func: "{that}.renderItems"
            }
        }
    });

    /**
     *
     * Render a list of items as focusable/clickable/keyboard operable elements.
     * @param {Object} that - The listSelector component.
     * @param {selectElement} enclosingElement - The select element to populate.
     * @param {Object.<String,Object|String>} items - A hash of items.  Each property can either be a string (description) or an object with a description property.
     *
     */
    gamepad.ui.listSelector.renderItems = function (that, enclosingElement, items) {
        enclosingElement.empty();

        fluid.each(items, function (item, itemIndex) {
            var template = that.options.markup.item;

            var itemObject = typeof item === "string" ? { description: item } : item;
            var itemMarkup = fluid.stringTemplate(template, itemObject);
            var itemElement = $(itemMarkup);

            itemElement.on("click", function (event) {
                event.preventDefault();

                that.handleItemClick(itemIndex, event);
            });

            itemElement.on("keydown", function (event) {
                if (["Enter", "Space"].includes(event.code)) {
                    event.preventDefault();
                    that.handleItemClick(itemIndex, event);
                }
            });

            enclosingElement.append(itemElement);
        });
    };

    gamepad.ui.listSelector.handleFocusChange = function (that) {
        var activeItems = that.locate("activeItems");
        var toFocus = fluid.get(activeItems, that.model.focusedItemIndex);
        if (toFocus) {
            toFocus.focus();
        }
    };

    gamepad.ui.listSelector.handleKeydown = function (that, event) {
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)) {
            event.preventDefault();

            var lastItemIndex = (Object.keys(that.model.items).length - 1);

            switch (event.code) {
                case "ArrowLeft":
                case "ArrowUp":
                    var previousItemIndex = that.model.focusedItemIndex > 0 ? that.model.focusedItemIndex - 1 : lastItemIndex;
                    that.applier.change("focusedItemIndex", previousItemIndex);
                    break;
                case "ArrowRight":
                case "ArrowDown":
                    var nextItemIndex = that.model.focusedItemIndex < lastItemIndex ? that.model.focusedItemIndex + 1 : 0;
                    that.applier.change("focusedItemIndex", nextItemIndex);
                    break;
            }
        }
    };
})(fluid);
