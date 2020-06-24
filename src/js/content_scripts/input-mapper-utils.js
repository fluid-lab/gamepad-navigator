/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad */

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
     * @param {Boolean} invert - Determine if the scroll should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.scrollHorizontally = function (that, value, speedFactor, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            clearInterval(that.options.members.intervalRecords.leftScroll);
            that.scrollRight(value, speedFactor);
        }
        else if (value < 0) {
            clearInterval(that.options.members.intervalRecords.rightScroll);
            that.scrollLeft(-1 * value, speedFactor);
        }
        else {
            clearInterval(that.options.members.intervalRecords.leftScroll);
            clearInterval(that.options.members.intervalRecords.rightScroll);
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
        clearInterval(that.options.members.intervalRecords.leftScroll);

        /**
         * Scroll the webpage towards the left only if the input value is more than the
         * cutoff value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll to the left according to the new input value.
            that.options.members.intervalRecords.leftScroll = setInterval(function () {
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
        clearInterval(that.options.members.intervalRecords.rightScroll);

        /**
         * Scroll the webpage towards the right only if the input value is more than the
         * cutoff value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll to the right according to the new input value.
            that.options.members.intervalRecords.rightScroll = setInterval(function () {
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
     * @param {Boolean} invert - Determine if the scroll should be in opposite order.
     *
     */
    gamepad.inputMapperUtils.scrollVertically = function (that, value, speedFactor, invert) {
        // Get the updated input value according to the configuration.
        var inversionFactor = invert ? -1 : 1;
        value = value * inversionFactor;
        if (value > 0) {
            clearInterval(that.options.members.intervalRecords.upwardScroll);
            that.scrollDown(value, speedFactor);
        }
        else if (value < 0) {
            clearInterval(that.options.members.intervalRecords.downwardScroll);
            that.scrollUp(-1 * value, speedFactor);
        }
        else {
            clearInterval(that.options.members.intervalRecords.upwardScroll);
            clearInterval(that.options.members.intervalRecords.downwardScroll);
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
        clearInterval(that.options.members.intervalRecords.upwardScroll);

        /**
         * Scroll the webpage upward only if the input value is more than the cutoff
         * value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll upward according to the new input value.
            that.options.members.intervalRecords.upwardScroll = setInterval(function () {
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
        clearInterval(that.options.members.intervalRecords.downwardScroll);

        /**
         * Scroll the webpage downward only if the input value is more than the cutoff
         * value.
         */
        if (value > that.options.cutoffValue) {
            // Scroll upward according to the new input value.
            that.options.members.intervalRecords.downwardScroll = setInterval(function () {
                var yOffset = $(that.options.windowObject).scrollTop();
                $(that.options.windowObject).scrollTop(yOffset + value * 50 * speedFactor);
            }, that.options.frequency);
        }
    };
})(fluid, jQuery);
