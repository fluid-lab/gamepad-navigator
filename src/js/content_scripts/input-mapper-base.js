/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global ally */

(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.configMaps");
    fluid.registerNamespace("gamepad.inputMapper.base");
    fluid.registerNamespace("gamepad.inputMapperUtils.content");

    fluid.defaults("gamepad.inputMapper.base", {
        gradeNames: ["gamepad.configMaps", "gamepad.navigator"],
        modelListeners: {
            "axes.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            },
            "buttons.*": {
                funcName: "{that}.produceNavigation",
                args: "{change}"
            }
        },
        listeners: {
            "onDestroy.clearIntervalRecords": "{that}.clearIntervalRecords",
            "onCreate.trackDOM": "{that}.trackDOM",
            "onDestroy.stopTrackingDOM": "{that}.stopTrackingDOM",
            /**
             * TODO: Adjust the gamepaddisconnected event so that the other gamepad's
             * navigation doesn't break.
             */
            "onGamepadDisconnected.clearIntervalRecords": "{that}.clearIntervalRecords"
        },
        members: {
            intervalRecords: {
                upwardScroll: null,
                downwardScroll: null,
                leftScroll: null,
                rightScroll: null,
                forwardTab: null,
                reverseTab: null,
                zoomIn: null,
                zoomOut: null
            },
            currentTabIndex: 0,
            tabbableElements: null,
            mutationObserverInstance: null
        },
        cutoffValue: 0.20,
        scrollInputMultiplier: 50,
        invokers: {
            produceNavigation: {
                funcName: "gamepad.inputMapper.base.produceNavigation",
                args: ["{that}", "{arguments}.0"]
            },
            clearIntervalRecords: {
                funcName: "gamepad.inputMapper.base.clearIntervalRecords",
                args: ["{that}.intervalRecords"]
            },
            trackDOM: {
                funcName: "gamepad.inputMapper.base.trackDOM",
                args: ["{that}"]
            },
            stopTrackingDOM: {
                "this": "{that}.mutationObserverInstance",
                method: "disconnect"
            },
            // TODO: Investigate, identify, and fix tab navigation issues.
            tabindexSortFilter: {
                funcName: "gamepad.inputMapper.base.tabindexSortFilter",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            /**
             * TODO: Add tests for links and other elements that involve navigation
             * between pages.
             */
            click: {
                funcName: "gamepad.inputMapperUtils.content.click",
                args: ["{arguments}.0"]
            },
            previousPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.previousPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            nextPageInHistory: {
                funcName: "gamepad.inputMapperUtils.content.nextPageInHistory",
                args: ["{that}", "{arguments}.0"]
            },
            reverseTab: {
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "reverseTab"]
            },
            forwardTab: {
                funcName: "gamepad.inputMapperUtils.content.buttonTabNavigation",
                args: ["{that}", "{arguments}.0", "forwardTab"]
            },
            scrollLeft: {
                funcName: "gamepad.inputMapperUtils.content.scrollLeft",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollRight: {
                funcName: "gamepad.inputMapperUtils.content.scrollRight",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollUp: {
                funcName: "gamepad.inputMapperUtils.content.scrollUp",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollDown: {
                funcName: "gamepad.inputMapperUtils.content.scrollDown",
                args: ["{that}", "{arguments}.0", "{arguments}.1"]
            },
            scrollHorizontally: {
                funcName: "gamepad.inputMapperUtils.content.scrollHorizontally",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            scrollVertically: {
                funcName: "gamepad.inputMapperUtils.content.scrollVertically",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            },
            thumbstickHistoryNavigation: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickHistoryNavigation",
                args: ["{that}", "{arguments}.0", "{arguments}.2"]
            },
            // TODO: Add tests for when the number of tabbable elements changes.
            thumbstickTabbing: {
                funcName: "gamepad.inputMapperUtils.content.thumbstickTabbing",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
            }
        }
    });

    /**
     *
     * Calls the invoker methods when axes/button is disturbed according to the
     * configured action map to produce a navigation effect.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} change - The recipt for the change in input values.
     *
     */
    gamepad.inputMapper.base.produceNavigation = function (that, change) {
        /**
         * Check if input is generated by axis or button and which button/axes was
         * disturbed.
         */
        var inputType = change.path[0],
            index = change.path[1],
            inputValue = change.value,
            oldInputValue = change.oldValue || 0;

        var inputProperties = that.model.map[inputType][index],
            actionLabel = fluid.get(inputProperties, "currentAction") || fluid.get(inputProperties, "defaultAction"),
            homepageURL = that.model.commonConfiguration.homepageURL;

        /**
         * TODO: Modify the action call in such a manner that the action gets triggered
         * when the inputs are released.
         * (To gain shortpress and longpress actions)
         *
         * Refer:
         * https://github.com/fluid-lab/gamepad-navigator/pull/21#discussion_r453507050
         */

        // Execute the actions only if the action label is available.
        if (actionLabel) {
            var action = fluid.get(that, actionLabel);

            // Trigger the action only if a valid function is found.
            if (action) {
                action(
                    inputValue,
                    inputProperties.speedFactor,
                    inputProperties.invert,
                    inputProperties.background,
                    oldInputValue,
                    homepageURL
                );
            }
        }
    };

    /**
     *
     * A listener for the input mapper component to clear the connectivity interval when
     * the instance of the component is destroyed.
     *
     * @param {Object} records - The interval records object.
     *
     */
    gamepad.inputMapper.base.clearIntervalRecords = function (records) {
        fluid.each(records, function (record) {
            clearInterval(record);
        });
    };

    /**
     *
     * A listener to track DOM elements and update the list when the DOM is updated.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapper.base.trackDOM = function (that) {
        var body = document.querySelector("body"),
            MutationObserver = that.options.windowObject.MutationObserver;

        // Record the tabbable elements when the component is created.
        that.tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter);

        // Create an instance of the mutation observer.
        that.mutationObserverInstance = new MutationObserver(function () {
            // Record the tabbable elements when the DOM mutates.
            that.tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter);
        });

        // Specify the mutations to be observed.
        var observerConfiguration = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        };

        // Start observing the DOM mutations.
        that.mutationObserverInstance.observe(body, observerConfiguration);
    };

    /**
     *
     * Filter for sorting the elements; to be used inside JavaScript's sort() method.
     *
     * @param {Object} elementOne - The DOM element.
     * @param {Object} elementTwo - The DOM element.
     * @return {Integer} - The value which will decide the order of the two elements.
     *
     */
    gamepad.inputMapper.base.tabindexSortFilter = function (elementOne, elementTwo) {
        var tabindexOne = parseInt(elementOne.getAttribute("tabindex")),
            tabindexTwo = parseInt(elementTwo.getAttribute("tabindex"));

        /**
         * If both elements have tabindex greater than 0, arrange them in ascending order
         * of the tabindex. Otherwise if only one of the elements have tabindex greater
         * than 0, place it before the other element. And in case, no element has a
         * tabindex attribute or both of them posses tabindex value equal to 0, keep them
         * in the same order.
         */
        if (tabindexOne > 0 && tabindexTwo > 0) {
            return tabindexOne - tabindexTwo;
        }
        else if (tabindexOne > 0) {
            return -1;
        }
        else if (tabindexTwo > 0) {
            return 1;
        }
        else {
            return 0;
        }
    };
})(fluid);
