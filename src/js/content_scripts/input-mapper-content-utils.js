/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, ally, chrome */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.inputMapperUtils.content");

    /**
     * TODO: Fix the "speedFactor" usage in invokers to reduce the given interval loop
     * frequency.
     */

    /**
     *
     * Scroll horizontally across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The current value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor, invert).
     *
     */
    gamepad.inputMapperUtils.content.scrollHorizontally = function (that, value, oldValue, actionOptions) {
        if (that.model.pageInView) {
            // Get the updated input value according to the configuration.
            var inversionFactor = actionOptions.invert ? -1 : 1;
            value = value * inversionFactor;
            if (value > 0) {
                clearInterval(that.intervalRecords.leftScroll);
                that.scrollRight(value, oldValue, actionOptions);
            }
            else if (value < 0) {
                clearInterval(that.intervalRecords.rightScroll);
                that.scrollLeft(-1 * value, oldValue, actionOptions);
            }
            else {
                clearInterval(that.intervalRecords.leftScroll);
                clearInterval(that.intervalRecords.rightScroll);
            }
        }
    };

    /**
     *
     * Scroll the webpage in left direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The current value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.scrollLeft = function (that, value, oldValue, actionOptions) {
        var speedFactor = actionOptions.speedFactor || 1;

        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.leftScroll);

        /**
         * Scroll the webpage towards the left only if the input value is more than the
         * cutoff value.
         */
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            // Scroll to the left according to the new input value.
            that.intervalRecords.leftScroll = setInterval(function () {
                if (window.scrollX > 0) {
                    window.scroll(window.scrollX - value * that.options.scrollInputMultiplier * speedFactor, window.scrollY);
                }
                else {
                    clearInterval(that.intervalRecords.leftScroll);
                    that.vibrate();
                }

            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage towards the right direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The current value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.scrollRight = function (that, value, oldValue, actionOptions) {
        var speedFactor = actionOptions.speedFactor || 1;

        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.rightScroll);

        /**
         * Scroll the webpage towards the right only if the input value is more than the
         * cutoff value.
         */
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            // Scroll to the right according to the new input value.
            that.intervalRecords.rightScroll = setInterval(function () {
                window.scroll(window.scrollX + value * that.options.scrollInputMultiplier * speedFactor, window.scrollY);

                var documentWidth = document.body.scrollWidth;
                var currentScrollX = window.scrollX + window.innerWidth;
                if (currentScrollX >= documentWidth) {
                    clearInterval(that.intervalRecords.rightScroll);
                    that.vibrate();
                }
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll vertically across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The currrent value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.scrollVertically = function (that, value, oldValue, actionOptions) {
        var speedFactor = actionOptions.speedFactor || 1;

        if (that.model.pageInView) {
            // Get the updated input value according to the configuration.
            var inversionFactor = actionOptions.invert ? -1 : 1;
            value = value * inversionFactor;
            if (value > 0) {
                clearInterval(that.intervalRecords.upwardScroll);
                that.scrollDown(value, oldValue, speedFactor);
            }
            else if (value < 0) {
                clearInterval(that.intervalRecords.downwardScroll);
                that.scrollUp(-1 * value, oldValue, speedFactor);
            }
            else {
                clearInterval(that.intervalRecords.upwardScroll);
                clearInterval(that.intervalRecords.downwardScroll);
            }
        }
    };

    /**
     *
     * Scroll the webpage in upward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The current value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.scrollUp = function (that, value, oldValue, actionOptions) {
        var speedFactor = actionOptions.speedFactor || 1;

        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.upwardScroll);

        /**
         * Scroll the webpage upward only if the input value is more than the cutoff
         * value.
         */
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            // Scroll upward according to the new input value.
            that.intervalRecords.upwardScroll = setInterval(function () {
                if (window.scrollY > 0) {
                    window.scroll(window.scrollX, window.scrollY - value * that.options.scrollInputMultiplier * speedFactor);
                }
                else {
                    clearInterval(that.intervalRecords.upwardScroll);
                    that.vibrate();
                }
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage in downward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The current value of the gamepad input.
     * @param {Integer} oldValue - The previous value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.scrollDown = function (that, value, oldValue, actionOptions) {
        var speedFactor = actionOptions.speedFactor || 1;

        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.intervalRecords.downwardScroll);

        /**
         * Scroll the webpage downward only if the input value is more than the cutoff
         * value.
         */
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            // Scroll upward according to the new input value.
            that.intervalRecords.downwardScroll = setInterval(function () {
                window.scroll(window.scrollX, window.scrollY + value * that.options.scrollInputMultiplier * speedFactor);

                // Adapted from:
                // https://fjolt.com/article/javascript-check-if-user-scrolled-to-bottom
                var documentHeight = document.body.scrollHeight;
                var currentScroll = window.scrollY + window.innerHeight;
                if (currentScroll >= documentHeight) {
                    clearInterval(that.intervalRecords.downwardScroll);
                    that.vibrate();
                };
            }, that.options.frequency);
        }
    };

    /**
     *
     * Tab through the webpage using thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     *
     */
    gamepad.inputMapperUtils.content.thumbstickTabbing = function (that, value, actionOptions) {
        if (that.model.pageInView) {
            var speedFactor = actionOptions.speedFactor || 1;
            var inversionFactor = actionOptions.invert ? -1 : 1;
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
        }
    };

    /**
     *
     * Change the focus from one tabbable element to another.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {String} direction - The direction in which the focus should change.
     *
     */
    gamepad.inputMapperUtils.content.buttonTabNavigation = function (that, value, direction) {
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            var length = that.tabbableElements.length;

            // Tab only if at least one tabbable element is available.
            if (length) {
                /**
                 * If the body element of the page is focused or if no element is
                 * currently focused, shift the focus to the first element. Otherwise
                 * shift the focus to the next element.
                 */
                var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;
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

                    var increment = 0;
                    if (direction === "forwardTab") {
                        increment = 1;
                    }
                    else if (direction === "reverseTab") {
                        increment = -1;
                    }

                    activeElement.blur();

                    that.currentTabIndex = (that.tabbableElements.length + (activeElementIndex + increment)) % that.tabbableElements.length;
                    var elementToFocus = that.tabbableElements[that.currentTabIndex];
                    elementToFocus.focus();

                    // If focus didn't succeed, make one more attempt, to attempt to avoid focus traps (See #118).
                    if (!that.model.activeModal && elementToFocus !== document.activeElement) {
                        that.currentTabIndex = (that.tabbableElements.length + (that.currentTabIndex + increment)) % that.tabbableElements.length;
                        var failoverElementToFocus = that.tabbableElements[that.currentTabIndex];
                        failoverElementToFocus.focus();
                    }
                }
            }
        }
    };

    /**
     *
     * Click on the currently focused element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.click = function (that, value) {
        if (that.model.pageInView && (value > 0)) {
            var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;

            if (activeElement) {
                var isTextInput = gamepad.inputMapperUtils.content.isTextInput(activeElement);

                // Open the new onscreen keyboard to input text.
                if (isTextInput) {
                    var lastExternalFocused = activeElement;
                    that.applier.change("lastExternalFocused", lastExternalFocused);
                    that.applier.change("textInputValue", lastExternalFocused.value);
                    lastExternalFocused.blur();

                    that.applier.change("activeModal", "onscreenKeyboard");
                }
                /**
                 * If SELECT element is currently focused, toggle its state. Otherwise perform
                 * the regular click operation.
                 */
                else if (activeElement.nodeName === "SELECT") {
                    var optionsLength = 0;

                    // Compute the number of options and store it.
                    activeElement.childNodes.forEach(function (childNode) {
                        if (childNode.nodeName === "OPTION") {
                            optionsLength++;
                        }
                    });

                    // Toggle the SELECT dropdown.
                    if (!activeElement.getAttribute("size") || activeElement.getAttribute("size") === "1") {
                        /**
                         * Store the initial size of the dropdown in a separate attribute
                         * (if specified already).
                         */
                        var initialSizeString = activeElement.getAttribute("size");
                        if (initialSizeString) {
                            activeElement.setAttribute("initialSize", parseInt(initialSizeString));
                        }

                        /**
                         * Allow limited expansion to avoid an overflowing list, considering the
                         * list could go as large as 100 or more (for example, a list of
                         * countries).
                         */
                        var length = Math.min(15, optionsLength);
                        activeElement.setAttribute("size", length);
                    }
                    else {
                        // Obtain the initial size of the dropdown.
                        var sizeString = activeElement.getAttribute("initialSize") || "1";

                        // Restore the size of the dropdown.
                        activeElement.setAttribute("size", parseInt(sizeString));
                    }
                }
                else {
                    // Click on the focused element.
                    activeElement.click();
                }
            }
        }
    };

    gamepad.inputMapperUtils.content.isTextInput = function (element) {
        if (element.nodeName === "INPUT") {
            var allowedTypes = ["text", "search", "email", "password", "tel", "text", "url"];
            var inputType = element.getAttribute("type");
            if (!inputType || allowedTypes.includes(inputType)) {
                return true;
            }
        }
        else if (element.nodeName === "TEXTAREA") {
            return true;
        }

        return false;
    };

    /**
     *
     * Navigate to the previous/next page in history using thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: invert).
     *
     */
    gamepad.inputMapperUtils.content.thumbstickHistoryNavigation = function (that, value, actionOptions) {
        if (that.model.pageInView) {
            // Get the updated input value according to the configuration.
            var inversionFactor = actionOptions.invert ? -1 : 1;
            value = value * inversionFactor;
            if (value > 0) {
                that.nextPageInHistory(value);
            }
            else if (value < 0) {
                that.previousPageInHistory(-1 * value);
            }
        }
    };

    /**
     * TODO: Use a common function definition for the "previousPageInHistory" and
     * "nextPageInHistory" methods.
     */

    /**
     *
     * Navigate to the previous page in history.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.content.previousPageInHistory = function (that, value) {
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            if (window.history.length > 1) {
                var activeElementIndex = null;

                // Get the index of the currently active element, if available.
                if (fluid.get(document, "activeElement")) {
                    var tabbableElements = ally.query.tabsequence({ strategy: "strict" });
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
            else {
                that.vibrate();
            }
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
        if (that.model.pageInView && (value > that.options.cutoffValue)) {
            if (window.history.length > 1) {
                var activeElementIndex = null;

                // Get the index of the currently active element, if available.
                if (fluid.get(document, "activeElement")) {
                    var tabbableElements = ally.query.tabsequence({ strategy: "strict" });
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
            else {
                that.vibrate();
            }
        }
    };

    /**
     *
     * Simulate a key press (down and up) on the current focused element.
     * @param {Object} that - The inputMapper component.
     * @param {Number} value - The current value of the input (from 0 to 1).
     * @param {Object} actionOptions - The options for this action.
     * @property {String} key - The key (ex: `ArrowLeft`) to simulate.
     *
     */
    gamepad.inputMapperUtils.content.sendKey = function (that, value, actionOptions) {
        var key = fluid.get(actionOptions, "key");

        // TODO: Make this use the "analogCutoff" preference.
        if (that.model.pageInView && (value > that.options.cutoffValue) && (key !== undefined)) {
            var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;

            if (activeElement) {
                var keyDownEvent = new KeyboardEvent("keydown", { key: key, code: key, bubbles: true });
                activeElement.dispatchEvent(keyDownEvent);

                // TODO: Test with text inputs and textarea fields to see if
                // beforeinput and input are needed.

                var keyUpEvent = new KeyboardEvent("keyup", { key: key, code: key, bubbles: true });
                activeElement.dispatchEvent(keyUpEvent);
            }
        }
    };

    /**
     *
     * Move through the webpage by sending arrow keys to the focused element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     * @param {Object} actionOptions - The action options (ex: speedFactor).
     * @param {String} forwardKey - The key/code for the forward arrow (right or down).
     * @param {String} backwardKey - The key/code for the backward arrow (left or up).
     *
     */
    gamepad.inputMapperUtils.content.thumbstickArrows = function (that, value, actionOptions, forwardKey, backwardKey) {
        var speedFactor = actionOptions.speedFactor || 1;
        var inversionFactor = actionOptions.invert ? -1 : 1;
        value = value * inversionFactor;
        clearInterval(that.intervalRecords[forwardKey]);
        clearInterval(that.intervalRecords[backwardKey]);
        if (value > that.options.cutoffValue) {
            that.intervalRecords[forwardKey] = setInterval(
                gamepad.inputMapperUtils.content.sendKey, // func
                that.options.frequency * speedFactor, // delay
                that, // arg 0
                value, //arg 1
                { key: forwardKey } // arg 2
            );
        }
        else if (value < (-1 * that.options.cutoffValue)) {
            that.intervalRecords[backwardKey] = setInterval(
                gamepad.inputMapperUtils.content.sendKey,
                that.options.frequency * speedFactor,
                that,
                -1 * value,
                { key: backwardKey }
            );
        }
    };
})(fluid, jQuery);
