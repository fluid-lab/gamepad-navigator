/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global gamepad, ally, chrome */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.inputMapperUtils.content");

    /**
     *
     * Scroll horizontally across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Boolean} invert - Whether to invert the direction of scroll.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollHorizontally = function (that, actionOptions, inputType, index) {
        var value = fluid.get(that.model, [inputType, index]);
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;
        var polarisedValue = value * inversionFactor;
        if (polarisedValue > 0) {
            that.scrollRight(actionOptions, inputType, index);
        }
        else if (polarisedValue < 0) {
            that.scrollLeft(actionOptions, inputType, index);
        }
    };

    /**
     *
     * Scroll the webpage in left direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options (ex: scrollFactor).
     * @property {Number} scrollFactor - How far to scroll in a single pass (from 1 to 50).
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollLeft = function (that, actionOptions, inputType, index) {
        var value = Math.abs(fluid.get(that.model, [inputType, index]) || 0);
        var scrollFactor = fluid.get(actionOptions, "scrollFactor") || 1;

        // Scroll to the left according to the new input value.
        if (window.scrollX > 0) {
            window.scroll(window.scrollX - value * scrollFactor, window.scrollY);
        }
        else {
            var intervalKey = gamepad.inputMapper.base.getIntervalKey(actionOptions, inputType, index);
            gamepad.inputMapper.base.clearInterval(that, intervalKey);
            that.vibrate();
        }
    };

    /**
     *
     * Scroll the webpage towards the right direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Number} scrollFactor - How far to scroll in a single pass (from 1 to 50).
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollRight = function (that, actionOptions, inputType, index) {
        var value = Math.abs(fluid.get(that.model, [inputType, index]) || 0);
        var scrollFactor = fluid.get(actionOptions, "scrollFactor") || 1;

        // Scroll to the right according to the new input value.
        window.scroll(window.scrollX + value * scrollFactor, window.scrollY);

        var documentWidth = document.body.scrollWidth;
        var currentScrollX = window.scrollX + window.innerWidth;
        if (currentScrollX >= documentWidth) {
            var intervalKey = gamepad.inputMapper.base.getIntervalKey(actionOptions, inputType, index);
            gamepad.inputMapper.base.clearInterval(that, intervalKey);
            that.vibrate();
        }
    };

    /**
     *
     * Scroll vertically across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollVertically = function (that, actionOptions, inputType, index) {
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;
        var value = fluid.get(that.model, [inputType, index]);

        var polarisedValue = value * inversionFactor;
        if (polarisedValue > 0) {
            that.scrollDown(actionOptions, inputType, index);
        }
        else if (polarisedValue < 0) {
            that.scrollUp(actionOptions, inputType, index);
        }
    };

    /**
     *
     * Scroll the webpage in upward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Number} scrollFactor - The amount (from 1 to 50) to scroll in a single pass.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollUp = function (that, actionOptions, inputType, index) {
        var scrollFactor = fluid.get(actionOptions, "scrollFactor") || 1;

        var value = Math.abs(fluid.get(that.model, [inputType, index]));

        if (window.scrollY > 0) {
            window.scroll(window.scrollX, window.scrollY - (value * scrollFactor));
        }
        else {
            var intervalKey = gamepad.inputMapper.base.getIntervalKey(actionOptions, inputType, index);
            gamepad.inputMapper.base.clearInterval(that, intervalKey);

            that.vibrate();
        }
    };

    /**
     *
     * Scroll the webpage in downward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Number} scrollFactor - The amount (from 1 to 50) to scroll in a single pass.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.scrollDown = function (that, actionOptions, inputType, index) {
        var scrollFactor = fluid.get(actionOptions, "scrollFactor") || 1;

        var value = Math.abs(fluid.get(that.model, [inputType, index]));

        // Scroll upward according to the new input value.
        window.scroll(window.scrollX, window.scrollY + (value * scrollFactor));

        // Adapted from:
        // https://fjolt.com/article/javascript-check-if-user-scrolled-to-bottom
        var documentHeight = document.body.scrollHeight;
        // We add a little wiggle here, as window.innerHeight is a float that is a bit short of the total height.
        var currentScroll = (window.scrollY + window.innerHeight + 1);
        if (currentScroll >= documentHeight) {
            var intervalKey = gamepad.inputMapper.base.getIntervalKey(actionOptions, inputType, index);
            gamepad.inputMapper.base.clearInterval(that, intervalKey);
            that.vibrate();
        };
    };

    /**
     *
     * Tab through the webpage using thumbsticks.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.thumbstickTabbing = function (that, actionOptions, inputType, index) {
        var value = fluid.get(that.model, [inputType, index]);
        var delegatedActionOptions = fluid.copy(actionOptions);
        delegatedActionOptions.action = value > 0 ? "tabForward" : "tabBackward";
        gamepad.inputMapperUtils.content.buttonTabNavigation(that, delegatedActionOptions, inputType, index);
    };

    /**
     *
     * Change the focus from one tabbable element to another.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Boolean} invert - Whether to invert the direction in which we navigate.
     * @property {Number} repeatRate - How often (in seconds) to repeat the action.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.buttonTabNavigation = function (that, actionOptions, inputType, index) {
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;
        var value = Math.abs(fluid.get(that.model, [inputType, index]));

        var length = that.tabbableElements.length;

        // Tab only if at least one tabbable element is available.
        if (length) {
            /**
             * If the body element of the page is focused or if no element is
             * currently focused, shift the focus to the first element. Otherwise
             * shift the focus to the next element.
             */
            var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;
            if (!activeElement || activeElement.nodeName === "BODY") {
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

                activeElement.blur();

                var actionPolarity = actionOptions.action === "tabForward" ? 1 : -1;

                var fullyWeightedValue = value * actionPolarity * inversionFactor;
                var increment = fullyWeightedValue > 0 ? 1 : -1;

                // 7 elements, at position 6, forward by one would be (7 + 6 + 1) % 7 or 0.
                // 7 elements, at position 0, add -1 would be (7 + 0 -1) % 7, or 6
                that.currentTabIndex = (that.tabbableElements.length + activeElementIndex + increment) % that.tabbableElements.length;
                var elementToFocus = that.tabbableElements[that.currentTabIndex];
                elementToFocus.focus();

                // If focus didn't succeed, make one more attempt, to attempt to avoid focus traps (See #118).
                if (!that.model.activeModal && elementToFocus !== document.activeElement) {
                    that.currentTabIndex = (that.tabbableElements.length + activeElementIndex + increment) % that.tabbableElements.length;
                    var failoverElementToFocus = that.tabbableElements[that.currentTabIndex];
                    failoverElementToFocus.focus();
                }
            }
        }
    };

    /**
     *
     * Click on the currently focused element.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapperUtils.content.click = function (that) {
        var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;

        if (activeElement) {
            var isTextInput = gamepad.inputMapperUtils.content.isTextInput(activeElement);
            var isMediaElement = gamepad.inputMapperUtils.content.isMediaElement(activeElement);

            // Open the onscreen keyboard to input text.
            if (isTextInput) {
                var lastExternalFocused = activeElement;
                that.applier.change("lastExternalFocused", lastExternalFocused);
                that.applier.change("textInputValue", lastExternalFocused.value);
                lastExternalFocused.blur();

                that.applier.change("activeModal", "onscreenKeyboard");
            }
            else if (isMediaElement) {
                if (activeElement.paused) {
                    activeElement.play();
                }
                else {
                    activeElement.pause();
                }
            }
            // Open our "select operator".
            else if (activeElement.nodeName === "SELECT") {
                that.applier.change("lastExternalFocused", activeElement);
                that.applier.change("selectElement", activeElement);
                that.applier.change("activeModal", "selectOperator");
            }
            // Click on the focused element.
            else {
                activeElement.click();
            }
        }
    };

    gamepad.inputMapperUtils.content.isMediaElement = function (element) {
        return element.nodeName === "AUDIO" || element.nodeName === "VIDEO";
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
     * @param {Object} actionOptions - The action options (ex: invert).
     * @property {Boolean} invert - Whether to invert the direction of motion.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     *
     */
    gamepad.inputMapperUtils.content.thumbstickHistoryNavigation = function (that, actionOptions, inputType, index) {
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;
        var value = fluid.get(that.model, [inputType, index]);
        var polarisedValue = value * inversionFactor;
        if (polarisedValue > 0) {
            that.nextPageInHistory();
        }
        else if (polarisedValue < 0) {
            that.previousPageInHistory();
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
     *
     */
    gamepad.inputMapperUtils.content.previousPageInHistory = function (that) {
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
    };

    /**
     *
     * Navigate to the next page in history.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapperUtils.content.nextPageInHistory = function (that) {
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
    };

    /**
     *
     * Simulate a key press (down and up) on the current focused element.
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The options for this action.
     * @property {String} key - The key (ex: `ArrowLeft`) to simulate.
     *
     */
    gamepad.inputMapperUtils.content.sendKey = function (that, actionOptions) {
        var key = fluid.get(actionOptions, "key");
        var activeElement = that.model.activeModal ? fluid.get(that, "model.shadowElement.activeElement") : document.activeElement;

        if (activeElement) {
            var keyDownEvent = new KeyboardEvent("keydown", { key: key, code: key, bubbles: true });
            activeElement.dispatchEvent(keyDownEvent);

            // TODO: Test with text inputs and textarea fields to see if
            // beforeinput and input are needed.

            var keyUpEvent = new KeyboardEvent("keyup", { key: key, code: key, bubbles: true });
            activeElement.dispatchEvent(keyUpEvent);
        }
    };

    /**
     *
     * Move through the webpage by sending arrow keys to the focused element.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Object} actionOptions - The action options.
     * @property {Boolean} invert - Whether to invert the direction of motion.
     * @param {String} inputType - The input type ("buttons" or "axes").
     * @param {String|Number} index - Which button number or axis we're responding to.
     * @param {String} forwardKey - The key/code for the forward arrow (right or down).
     * @param {String} backwardKey - The key/code for the backward arrow (left or up).
     *
     */
    gamepad.inputMapperUtils.content.thumbstickArrows = function (that, actionOptions, inputType, index, forwardKey, backwardKey) {
        var inversionFactor = fluid.get(actionOptions, "invert") ? -1 : 1;

        var value = fluid.get(that.model, [inputType, index]);
        var directionalValue = value * inversionFactor;

        if (directionalValue > 0) {
            gamepad.inputMapperUtils.content.sendKey(that, { key: forwardKey });
        }
        else {
            gamepad.inputMapperUtils.content.sendKey(that, { key: backwardKey });
        }
    };
})(fluid, jQuery);
