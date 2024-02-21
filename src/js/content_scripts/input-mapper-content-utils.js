/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global gamepad, ally */

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
            var activeElementIndex = that.tabbableElements.indexOf(activeElement);

            /**
             * If the currently focused element is not found in the list, refer to
             * the stored value of the index.
             */
            if (activeElementIndex === -1) {
                activeElementIndex = that.currentTabIndex;
            }

            if (activeElement) {
                activeElement.blur();
            }

            var actionPolarity = actionOptions.action === "tabForward" ? 1 : -1;

            var fullyWeightedValue = value * actionPolarity * inversionFactor;
            var increment = fullyWeightedValue > 0 ? 1 : -1;

            // 7 elements, at position 6, forward by one would be (7 + 6 + 1) % 7 or 0.
            // 7 elements, at position 0, add -1 would be (7 + 0 -1) % 7, or 6
            that.currentTabIndex = (that.tabbableElements.length + activeElementIndex + increment) % that.tabbableElements.length;
            var elementToFocus = that.tabbableElements[that.currentTabIndex];
            gamepad.inputMapperUtils.content.focus(that, elementToFocus);

            // If focus didn't succeed, make one more attempt, to attempt to avoid focus traps (See #118).
            if (!that.model.activeModal && elementToFocus !== document.activeElement) {
                that.currentTabIndex = (that.tabbableElements.length + activeElementIndex + increment) % that.tabbableElements.length;
                var failoverElementToFocus = that.tabbableElements[that.currentTabIndex];
                gamepad.inputMapperUtils.content.focus(that, failoverElementToFocus);
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
            var isNumberInput = gamepad.inputMapperUtils.content.isNumberInput(activeElement);
            var isContentEditable = gamepad.inputMapperUtils.content.isContentEditable(activeElement);

            // Open the onscreen keyboard to input text.
            if (isTextInput || isNumberInput) {
                var lastExternalFocused = activeElement;
                that.applier.change("lastExternalFocused", lastExternalFocused);
                that.applier.change("inputValue", lastExternalFocused.value);
                lastExternalFocused.blur();

                if (isNumberInput) {
                    that.applier.change("activeModal", "onscreenNumpad");
                }
                else if (isTextInput) {
                    that.applier.change("activeModal", "onscreenKeyboard");
                }
            }
            else if (isMediaElement) {
                if (activeElement.paused) {
                    activeElement.play();
                }
                else {
                    activeElement.pause();
                }
            }
            else if (isContentEditable) {
                that.applier.change("lastExternalFocused", activeElement);
                that.applier.change("inputValue", activeElement.innerHTML);
                activeElement.blur();

                that.applier.change("activeModal", "onscreenKeyboard");
            }
            // Open our "select operator".
            else if (activeElement.nodeName === "SELECT") {
                that.applier.change("lastExternalFocused", activeElement);
                that.applier.change("selectElement", activeElement);
                that.applier.change("activeModal", "selectOperator");
            }
            // Special handling for links.
            else if (activeElement.nodeName === "A") {
                var internalPageAnchor = gamepad.inputMapperUtils.content.getInternalPageAnchor(activeElement.getAttribute("href"));
                if (internalPageAnchor !== undefined && internalPageAnchor.length > 0) {
                    var linkedElement = document.querySelector(internalPageAnchor);
                    if (linkedElement) {
                        gamepad.inputMapperUtils.content.addTemporaryFocus(that, linkedElement);
                    }
                }
                else {
                    activeElement.click();
                }
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

    gamepad.inputMapperUtils.content.isSearchField = function (element) {
        if ((element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") && element.getAttribute("type") === "search") {
            return true;
        }

        return false;
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

    gamepad.inputMapperUtils.content.isContentEditable = function (element) {
        if (element.getAttribute("contenteditable") !== null) {
            return true;
        }

        return false;
    };

    gamepad.inputMapperUtils.content.isNumberInput = function (element) {
        return element.nodeName === "INPUT" && (element.getAttribute("type") === "number" || element.getAttribute("inputmode") === "decimal");
    };

    gamepad.inputMapperUtils.content.isRangeInput = function (element) {
        return element.nodeName === "INPUT" && element.getAttribute("type") === "range";
    };

    gamepad.inputMapperUtils.content.isRadioInput = function (element) {
        return element.nodeName === "INPUT" && element.getAttribute("type") === "radio";
    };

    gamepad.inputMapperUtils.content.changeRadioInput = function (that, currentRadioButton, increment) {
        var groupName = currentRadioButton.getAttribute("name");
        var allButtons = document.querySelectorAll("input[type='radio'][name='" + groupName + "']");

        var currentButtonIndex;

        for (var index = 0; index < allButtons.length; index++) {
            var buttonAtIndex = allButtons[index];
            if (buttonAtIndex === currentRadioButton) {
                currentButtonIndex = index;
                break;
            }
        }

        if (currentButtonIndex !== undefined) {
            // Ensure that we "wrap" in both directions.
            var buttonToFocusIndex = (allButtons.length + (currentButtonIndex + increment)) % allButtons.length;
            var buttonToFocus = allButtons[buttonToFocusIndex];
            gamepad.inputMapperUtils.content.focus(that, buttonToFocus);
            buttonToFocus.click();
        }
    };

    gamepad.inputMapperUtils.content.nextRadioInput = function (that, currentRadioButton) {
        gamepad.inputMapperUtils.content.changeRadioInput(that, currentRadioButton, 1);
    };

    gamepad.inputMapperUtils.content.previousRadioInput = function (that, currentRadioButton) {
        gamepad.inputMapperUtils.content.changeRadioInput(that, currentRadioButton, -1);
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
            gamepad.inputMapperUtils.background.nextPageInHistory(that);
        }
        else if (polarisedValue < 0) {
            gamepad.inputMapperUtils.background.previousPageInHistory(that);
        }
    };

    /**
     *
     * Navigate to the previous page in history.
     *
     * @param {Object} that - The inputMapper component.
     *
     */
    gamepad.inputMapperUtils.content.previousPageInHistory = async function (that) {
        if (window.history.length > 1) {
            that.options.windowObject.history.back();
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
    gamepad.inputMapperUtils.content.nextPageInHistory = async function (that) {
        if (window.history.length > 1) {
            that.options.windowObject.history.forward();
        }
        else {
            that.vibrate();
        }
    };

    // Needed to support older javascript that uses key codes, like jQuery UI: https://api.jqueryui.com/jQuery.ui.keyCode/
    gamepad.inputMapperUtils.content.keyCodesByKey = {
        "ArrowLeft": 37,
        "ArrowRight": 39,
        "ArrowUp": 38,
        "ArrowDown": 40,
        "Enter": 13,
        "Escape": 27
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
            var isNumberInput = gamepad.inputMapperUtils.content.isNumberInput(activeElement);
            var isRangeInput = gamepad.inputMapperUtils.content.isRangeInput(activeElement);
            if (isNumberInput || isRangeInput) {
                switch (key) {
                    case "ArrowLeft":
                    case "ArrowDown":
                        activeElement.stepDown();
                        activeElement.dispatchEvent(new Event("change"));
                        break;
                    case "ArrowRight":
                    case "ArrowUp":
                        activeElement.stepUp();
                        activeElement.dispatchEvent(new Event("change"));
                        break;
                }
            }
            else if (gamepad.inputMapperUtils.content.isRadioInput(activeElement)) {
                switch (key) {
                    case "ArrowLeft":
                    case "ArrowUp":
                        gamepad.inputMapperUtils.content.previousRadioInput(that, activeElement);
                        activeElement.dispatchEvent(new Event("change"));
                        break;
                    case "ArrowRight":
                    case "ArrowDown":
                        gamepad.inputMapperUtils.content.nextRadioInput(that, activeElement);
                        activeElement.dispatchEvent(new Event("change"));
                        break;
                }
            }
            else {
                var keyPayload = {
                    bubbles: true,
                    code: key,
                    key: key,
                    keyCode: gamepad.inputMapperUtils.content.keyCodesByKey[key]
                };

                var keyDownEvent = new KeyboardEvent("keydown", keyPayload);
                activeElement.dispatchEvent(keyDownEvent);

                var keyUpEvent = new KeyboardEvent("keyup", keyPayload);
                activeElement.dispatchEvent(keyUpEvent);
            }
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

    /**
     *
     * Update an element to ensure that it can temporarily receive focus. If an
     * element already is focusable, we do nothing.
     *
     * If an element is not already focusable, we set a `tabindex` and add a
     * listener to reset the `tabindex` on blur.  We also add our own class to
     * prevent the display of the default outline on focus.
     *
     * @param {Object} that - The input mapper component.
     * @param {HTMLElement} element - The DOM element to manipulate.
     */
    gamepad.inputMapperUtils.content.addTemporaryFocus = function (that, element) {
        if (!ally.is.focusable(element)) {
            var oldTabIndex = element.getAttribute("tabindex");

            element.setAttribute("tabindex", 0);

            element.classList.toggle("no-focus-indicator", true);

            element.addEventListener("blur", function () {
                if (oldTabIndex !== null) {
                    element.setAttribute("tabindex", oldTabIndex);
                }
                else {
                    element.removeAttribute("tabindex");
                }

                element.classList.toggle("no-focus-indicator", false);
            });

            gamepad.inputMapperUtils.content.focus(that, element);
        }
    };

    gamepad.inputMapperUtils.content.getInternalPageAnchor = function (checkURL) {
        var baseURLObject = new URL(document.URL);
        var checkURLObject = new URL(checkURL, document.URL);
        if (checkURLObject.origin === baseURLObject.origin && checkURLObject.path === baseURLObject.path && checkURLObject.hash && checkURLObject.hash.length) {
            return checkURLObject.hash;
        }
    };

    gamepad.inputMapperUtils.content.enterFullscreen = function (that) {
        if (document.fullscreen) {
            that.vibrate();
        }
        else {
            document.documentElement.requestFullscreen();
        }
    };

    gamepad.inputMapperUtils.content.exitFullscreen = function (that) {
        if (document.fullscreen) {
            document.exitFullscreen();
        }
        else {
            that.vibrate();
        }
    };

    /**
     *
     * Simulate focus on an element, including triggering visible focus.
     *
     * @param {Object} that - The input mapper component itself.
     * @param {HTMLElement} element - The element to simulate focus on.
     *
     */
    gamepad.inputMapperUtils.content.focus = function (that, element) {
        if (that.model.prefs.fixFocus) {
            that.applier.change("focusOverlayElement", element);

            element.addEventListener("blur", function () {
                that.applier.change("focusOverlayElement", false);
            });
        }

        element.focus();
    };
})(fluid, jQuery);
