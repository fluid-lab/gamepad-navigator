/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* eslint-env browser */
/* global gamepad */

(function (fluid, $) {
    "use strict";

    fluid.registerNamespace("gamepad.inputMapperUtils");

    /**
     *
     * Scroll horizontally across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollHorizontally = function (that, value) {
        /**
         * Scroll the webpage horizontally only if the input's absolute value is more
         * than the specified value. Otherwise, stop scrolling across the webpage.
         */
        if (value > 0) {
            that.scrollRight(value);
        }
        else if (value < 0) {
            that.scrollLeft(-1 * value);
        }
        else {
            clearInterval(that.options.intervalRecord.leftScroll);
            clearInterval(that.options.intervalRecord.rightScroll);
        }
    };

    /**
     *
     * Scroll the webpage in left direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollLeft = function (that, value) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.options.intervalRecord.leftScroll);

        /**
         * Scroll the webpage towards the left only if the input value is more than the
         * specified value.
         */
        if (value > 0.20) {
            // Scroll to the left according to the new input value.
            that.options.intervalRecord.leftScroll = setInterval(function () {
                var xOffset = $(window).scrollLeft();
                $(window).scrollLeft(xOffset - value * 50);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage towards the right direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollRight = function (that, value) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.options.intervalRecord.rightScroll);

        /**
         * Scroll the webpage towards the right only if the input value is more than the
         * specified value.
         */
        if (value > 0.20) {
            // Scroll to the right according to the new input value.
            that.options.intervalRecord.rightScroll = setInterval(function () {
                var xOffset = $(window).scrollLeft();
                $(window).scrollLeft(xOffset + value * 50);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll vertically across the webpage.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollVertically = function (that, value) {
        /**
         * Scroll the webpage vertically only if the input's absolute value is more than
         * the specified value. Otherwise, stop scrolling across the webpage.
         */
        if (value > 0) {
            that.scrollDown(value);
        }
        else if (value < 0) {
            that.scrollUp(-1 * value);
        }
        else {
            clearInterval(that.options.intervalRecord.upwardScroll);
            clearInterval(that.options.intervalRecord.downwardScroll);
        }
    };

    /**
     *
     * Scroll the webpage in upward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollUp = function (that, value) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.options.intervalRecord.upwardScroll);

        /**
         * Scroll the webpage upward only if the input value is more than the specified
         * value.
         */
        if (value > 0.20) {
            // Scroll upward according to the new input value.
            that.options.intervalRecord.upwardScroll = setInterval(function () {
                var yOffset = $(window).scrollTop();
                $(window).scrollTop(yOffset - value * 50);
            }, that.options.frequency);
        }
    };

    /**
     *
     * Scroll the webpage in downward direction.
     *
     * @param {Object} that - The inputMapper component.
     * @param {Integer} value - The value of the gamepad input.
     *
     */
    gamepad.inputMapperUtils.scrollDown = function (that, value) {
        /**
         * Stop scrolling for the previous input value. Also stop scrolling if the input
         * source (analog/button) is at rest.
         */
        clearInterval(that.options.intervalRecord.downwardScroll);

        /**
         * Scroll the webpage downward only if the input value is more than the specified
         * value.
         */
        if (value > 0.20) {
            // Scroll upward according to the new input value.
            that.options.intervalRecord.downwardScroll = setInterval(function () {
                var yOffset = $(window).scrollTop();
                $(window).scrollTop(yOffset + value * 50);
            }, that.options.frequency);
        }
    };
})(fluid, jQuery);
