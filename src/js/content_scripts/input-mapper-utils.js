/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, ally */

(function (fluid, $) {
    "use strict";

    fluid.registerNamespace("gamepad.inputMapperUtils");

    /**
     *
     * Scroll horizontally across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     * @param {Boolean} invert - Whether the scroll should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.scrollHorizontally = function (that, value, speedFactor, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            clearInterval(that.intervalRecords.leftScroll);
            that.scrollRight(value, speedFactor);
        }
        else if (value < 0) {
            clearInterval(that.intervalRecords.rightScroll);
            that.scrollLeft(-1 * value, speedFactor);
        }
        else {
            clearInterval(that.intervalRecords.leftScroll);
            clearInterval(that.intervalRecords.rightScroll);
        }
    };

    /**
     *
     * Scroll the webpage in left direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     *
     */
    gamepad.inputMapperUtils.scrollLeft = function (that, value, speedFactor) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.leftScroll);

        /**
         * Scroll the webpage towards the left only if the input value is more than the
         * cutoff value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll to the left according to the new input value.
            that.intervalRecords.leftScroll = setInterval(function () {
                var xOffset = $(that.options.windowObject).scrollLeft();
                $(that.options.windowObject).scrollLeft(xOffset - value * 50 * speedFactor);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage towards the right direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     *
     */
    gamepad.inputMapperUtils.scrollRight = function (that, value, speedFactor) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.rightScroll);

        /**
         * Scroll the webpage towards the right only if the input value is more than the
         * cutoff value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll to the right according to the new input value.
            that.intervalRecords.rightScroll = setInterval(function () {
                var xOffset = $(that.options.windowObject).scrollLeft();
                $(that.options.windowObject).scrollLeft(xOffset + value * 50 * speedFactor);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll vertically across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     * @param {Boolean} invert - Whether the scroll should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.scrollVertically = function (that, value, speedFactor, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            clearInterval(that.intervalRecords.upwardScroll);
            that.scrollDown(value, speedFactor);
        }
        else if (value < 0) {
            clearInterval(that.intervalRecords.downwardScroll);
            that.scrollUp(-1 * value, speedFactor);
        }
        else {
            clearInterval(that.intervalRecords.upwardScroll);
            clearInterval(that.intervalRecords.downwardScroll);
        }
    };

    /**
     *
     * Scroll the webpage in upward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     *
     */
    gamepad.inputMapperUtils.scrollUp = function (that, value, speedFactor) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.upwardScroll);

        /**
         * Scroll the webpage upward only if the input value is more than the cutoff
         * value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll upward according to the new input value.
            that.intervalRecords.upwardScroll = setInterval(function () {
                var yOffset = $(that.options.windowObject).scrollTop();
                $(that.options.windowObject).scrollTop(yOffset - value * 50 * speedFactor);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage in downward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input (in pixels).
     * @param {Integer} speedFactor - Times by which the scroll speed should be increased.
     *
     */
    gamepad.inputMapperUtils.scrollDown = function (that, value, speedFactor) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.downwardScroll);

        /**
         * Scroll the webpage downward only if the input value is more than the cutoff
         * value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll upward according to the new input value.
            that.intervalRecords.downwardScroll = setInterval(function () {
                var yOffset = $(that.options.windowObject).scrollTop();
                $(that.options.windowObject).scrollTop(yOffset + value * 50 * speedFactor);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Tab through the webpage using thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} speedFactor - Times by which the tabbing speed should be increased.
     * @param {Boolean} invert - Whether the tabbing should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.thumbstickTabbing = function (that, value, speedFactor, invert) {
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            clearInterval(that.intervalRecords.reverseTab);
            that.forwardTab(value, speedFactor);
        }
        else if (value < 0) {
            clearInterval(that.intervalRecords.forwardTab);
            that.reverseTab(-1 * value, speedFactor);
        }
        else {
            clearInterval(that.intervalRecords.forwardTab);
            clearInterval(that.intervalRecords.reverseTab);
        }
    };

    /**
     *
     * Focus on the next tabbable element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} speedFactor - Times by which the tabbing speed should be increased.
     *
     */
    gamepad.inputMapperUtils.forwardTab = function (that, value, speedFactor) {
        // Stop tabbing for the previous input value.
        clearInterval(that.intervalRecords.forwardTab);

        if (value > that.options.cutoffValue) {
            that.intervalRecords.forwardTab = setInterval(function () {
                // Obtain the tabbable DOM elements and sort them.
                var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter),
                    length = tabbableElements.length;

                // Tab only if at least one tabbable element is available.
                if (length) {
                    /**
                     * If the body element of the page is focused or if no element is
                     * currently focused, shift the focus to the first element. Otherwise
                     * shift the focus to the next element.
                     */
                    if (document.activeElement === document.querySelector("body") || !document.activeElement) {
                        tabbableElements[0].focus();
                    }
                    else {
                        var activeElementIndex = tabbableElements.indexOf(document.activeElement);

                        /**
                         * If the currently focused element is not found in the list, refer to
                         * the stored value of the index.
                         */
                        if (activeElementIndex === -1) {
                            activeElementIndex = that.currentTabIndex;
                        }
                        tabbableElements[(activeElementIndex + 1) % length].focus();

                        // Store the index of the currently focused element.
                        that.currentTabIndex = (activeElementIndex + 1) % length;
                    }
                }
            }, that.options.frequency * speedFactor);
        }
    };

    /**
     *
     * Focus on the next tabbable element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Integer} speedFactor - Times by which the tabbing speed should be increased.
     *
     */
    gamepad.inputMapperUtils.reverseTab = function (that, value, speedFactor) {
        // Stop tabbing for the previous input value.
        clearInterval(that.intervalRecords.reverseTab);

        if (value > that.options.cutoffValue) {
            that.intervalRecords.reverseTab = setInterval(function () {
                // Obtain the tabbable DOM elements and sort them.
                var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter),
                    length = tabbableElements.length;

                // Tab only if at least one tabbable element is available.
                if (length) {
                    /**
                     * If the body element of the page is focused, shift the focus to the last
                     * element. Otherwise shift the focus to the previous element.
                     */
                    if (document.activeElement === document.querySelector("body") || !document.activeElement) {
                        tabbableElements[length - 1].focus();
                    }
                    else {
                        var activeElementIndex = tabbableElements.indexOf(document.activeElement);

                        /**
                         * If the currently active element is not found in the list,
                         * refer to the stored value of the index.
                         */
                        if (activeElementIndex === -1) {
                            activeElementIndex = that.currentTabIndex;
                        }
                        else if (activeElementIndex === 0) {
                            activeElementIndex = length;
                        }
                        tabbableElements[activeElementIndex - 1].focus();

                        // Store the index of the currently focused element.
                        that.currentTabIndex = activeElementIndex - 1;
                    }
                }
            }, that.options.frequency * speedFactor);
        }
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
    gamepad.inputMapperUtils.tabindexSortFilter = function (elementOne, elementTwo) {
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
})(fluid, jQuery);
