/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, ally, chrome */

(function (fluid, $) {
    "use strict";

    fluid.registerNamespace("gamepad.inputMapperUtils.content");

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
    gamepad.inputMapperUtils.content.scrollHorizontally = function (that, value, speedFactor, invert) {
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
    gamepad.inputMapperUtils.content.scrollLeft = function (that, value, speedFactor) {
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
                $(that.options.windowObject).scrollLeft(xOffset - value * that.options.scrollInputMultiplier * speedFactor);
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
    gamepad.inputMapperUtils.content.scrollRight = function (that, value, speedFactor) {
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
                $(that.options.windowObject).scrollLeft(xOffset + value * that.options.scrollInputMultiplier * speedFactor);
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
    gamepad.inputMapperUtils.content.scrollVertically = function (that, value, speedFactor, invert) {
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
    gamepad.inputMapperUtils.content.scrollUp = function (that, value, speedFactor) {
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
                $(that.options.windowObject).scrollTop(yOffset - value * that.options.scrollInputMultiplier * speedFactor);
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
    gamepad.inputMapperUtils.content.scrollDown = function (that, value, speedFactor) {
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
                $(that.options.windowObject).scrollTop(yOffset + value * that.options.scrollInputMultiplier * speedFactor);
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
    gamepad.inputMapperUtils.content.thumbstickTabbing = function (that, value, speedFactor, invert) {
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        clearInterval(that.intervalRecords.forwardTab);
        clearInterval(that.intervalRecords.reverseTab);
        if (value > 0) {
            that.intervalRecords.forwardTab = setInterval(
                that.forwardTab,
                that.options.frequency * speedFactor,
                value
            );
        }
        else if (value < 0) {
            that.intervalRecords.reverseTab = setInterval(
                that.reverseTab,
                that.options.frequency * speedFactor,
                -1 * value
            );
        }
    };

    /**
     *
     * Focus on the next tabbable element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.forwardTab = function (that, value) {
        if (value > that.options.cutoffValue) {
            // Obtain the tabbable DOM elements and sort them.
            var length = that.tabbableElements.length;

            // Tab only if at least one tabbable element is available.
            if (length) {
                /**
                 * If the body element of the page is focused or if no element is
                 * currently focused, shift the focus to the first element. Otherwise
                 * shift the focus to the next element.
                 */
                var activeElement = document.activeElement;
                if (activeElement.nodeName === "BODY" || !activeElement) {
                    that.tabbableElements[0].focus();
                }
                else {
                    var activeElementIndex = that.tabbableElements.indexOf(activeElement);

                    /**
                     * If the currently focused element is not found in the list, refer to
                     * the stored value of the index.
                     */
                    if (activeElementIndex === -1) {
                        activeElementIndex = that.currentTabIndex;
                    }
                    that.currentTabIndex = (activeElementIndex + 1) % length;
                    that.tabbableElements[that.currentTabIndex].focus();
                }
            }
        }
    };

    /**
     *
     * Focus on the next tabbable element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.reverseTab = function (that, value) {
        if (value > that.options.cutoffValue) {
            // Obtain the tabbable DOM elements and sort them.
            var length = that.tabbableElements.length;

            // Tab only if at least one tabbable element is available.
            if (length) {
                /**
                 * If the body element of the page is focused, shift the focus to the last
                 * element. Otherwise shift the focus to the previous element.
                 */
                var activeElement = document.activeElement;
                if (activeElement.nodeName === "BODY" || !activeElement) {
                    that.tabbableElements[length - 1].focus();
                }
                else {
                    var activeElementIndex = that.tabbableElements.indexOf(activeElement);

                    /**
                     * If the currently active element is not found in the list,
                     * refer to the stored value of the index.
                     */
                    if (activeElementIndex === -1) {
                        activeElementIndex = that.currentTabIndex;
                    }

                    /**
                     * Move to the first element if the last element on the webpage
                     * is focused.
                     */
                    if (activeElementIndex === 0) {
                        activeElementIndex = length;
                    }
                    that.currentTabIndex = activeElementIndex - 1;
                    that.tabbableElements[that.currentTabIndex].focus();
                }
            }
        }
    };

    /**
     *
     * Click on the currently focused element.
     *
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.click = function (value) {
        if (value > 0) {
            /**
             * If SELECT element is currently focused, toggle its state. Otherwise perform
             * the regular click operation.
             */
            if (document.activeElement.nodeName === "SELECT") {
                var optionsLength = 0;

                // Compute the number of options and store it.
                document.activeElement.childNodes.forEach(function (childNode) {
                    if (childNode.nodeName === "OPTION") {
                        optionsLength++;
                    }
                });

                // Toggle the SELECT dropdown.
                if (!document.activeElement.getAttribute("size") || document.activeElement.getAttribute("size") === "1") {
                    /**
                     * Store the initial size of the dropdown in a separate attribute
                     * (if specified already).
                     */
                    var initialSizeString = document.activeElement.getAttribute("size");
                    if (initialSizeString) {
                        document.activeElement.setAttribute("initialSize", parseInt(initialSizeString));
                    }

                    /**
                     * Allow limited expansion to avoid an overflowing list, considering the
                     * list could go as large as 100 or more (for example, a list of
                     * countries).
                     */
                    var length = Math.min(15, optionsLength);
                    document.activeElement.setAttribute("size", length);
                }
                else {
                    // Obtain the initial size of the dropdown.
                    var sizeString = document.activeElement.getAttribute("initialSize") || "1";

                    // Restore the size of the dropdown.
                    document.activeElement.setAttribute("size", parseInt(sizeString));
                }
            }
            else {
                // Click on the focused element.
                document.activeElement.click();
            }
        }
    };

    // TODO: Add tests for history navigation.

    /**
     *
     * Navigate to the previous/next page in history using thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Boolean} invert - Whether the history navigation should be in opposite
     *                           order.
     *
     */
    gamepad.inputMapperUtils.content.thumbstickHistoryNavigation = function (that, value, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            that.nextPageInHistory(value);
        }
        else if (value < 0) {
            that.previousPageInHistory(-1 * value);
        }
    };

    /**
     *
     * Navigate to the previous page in history.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.previousPageInHistory = function (that, value) {
        if (value > that.options.cutoffValue) {
            var activeElementIndex = null;

            // Get the index of the currently active element, if available.
            if (fluid.get(document, "activeElement")) {
                var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter);
                activeElementIndex = tabbableElements.indexOf(document.activeElement);
            }

            /**
             * Store the index of the active element in local storage object with its key
             * set to the URL of the webpage and navigate back in history.
             */
            var storageData = {},
                pageAddress = that.options.windowObject.location.href;
            if (activeElementIndex !== -1) {
                storageData[pageAddress] = activeElementIndex;
            }
            chrome.storage.local.set(storageData, function () {
                that.options.windowObject.history.back();
            });
        }
    };

    /**
     *
     * Navigate to the next page in history.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.nextPageInHistory = function (that, value) {
        if (value > that.options.cutoffValue) {
            var activeElementIndex = null;

            // Get the index of the currently active element, if available.
            if (fluid.get(document, "activeElement")) {
                var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(that.tabindexSortFilter);
                activeElementIndex = tabbableElements.indexOf(document.activeElement);
            }

            /**
             * Store the index of the active element in local storage object with its key
             * set to the URL of the webpage and navigate forward in history.
             */
            var storageData = {},
                pageAddress = that.options.windowObject.location.href;
            if (activeElementIndex !== -1) {
                storageData[pageAddress] = activeElementIndex;
            }
            chrome.storage.local.set(storageData, function () {
                that.options.windowObject.history.forward();
            });
        }
    };
})(fluid, jQuery);
