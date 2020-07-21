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

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.configurationDashboard");
    fluid.registerNamespace("gamepad.progressTracker");
    fluid.registerNamespace("gamepad.progressTrackerUtils");

    fluid.defaults("gamepad.progressTracker", {
        gradeNames: ["gamepad.configurationDashboard", "fluid.viewComponent"],
        selectors: {
            configurationMenu: ".configuration-menu",
            progressIndicator: ".progress-indicator"
        },
        events: {
            onScroll: null
        },
        listeners: {
            "onCreate.attachScrollListener": "{that}.attachScrollListener",
            onScroll: "{that}.scrollProgress"
        },
        invokers: {
            attachScrollListener: {
                funcName: "gamepad.progressTracker.attachScrollListener",
                args: ["{that}", "{that}.dom.configurationMenu"]
            },
            scrollProgress: {
                funcName: "gamepad.progressTrackerUtils.scrollProgress",
                args: ["{that}.dom.configurationMenu", "{that}.dom.progressIndicator"]
            }
        }
    });

    /**
     *
     * Attach progressTracker component's event firer to the gamepad input configuration
     * menu's scroll event.
     *
     * @param {Object} that - The progressTracker component.
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     *
     */
    gamepad.progressTracker.attachScrollListener = function (that, configurationMenu) {
        var scrollTimer = null;
        configurationMenu.scroll(function () {
            that.events.onScroll.fire();

            // Scroll the panel horizontally by its full width.
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(function () {
                var width = 600,
                    scrolledBy = configurationMenu[0].scrollLeft;
                configurationMenu[0].scrollBy((width - (scrolledBy % width)) % width, 0);
            }, 25);
        });
    };

    /**
     *
     * Update the progress indicator according to the percentage of configuration menu
     * scrolled.
     *
     * @param {Array} configurationMenu - The jQuery selector of the configuration menu.
     * @param {Array} progressIndicator - The jQuery selector of the progress indicator.
     *
     */
    gamepad.progressTrackerUtils.scrollProgress = function (configurationMenu, progressIndicator) {
        configurationMenu = configurationMenu[0];
        progressIndicator = progressIndicator[0];

        var scrolledBy = configurationMenu.scrollLeft,
            width = configurationMenu.scrollWidth - configurationMenu.clientWidth;

        // Update the percentage of configuration menu scrolled.
        var scrolledPercentage = (scrolledBy / width) * 100;
        progressIndicator.style.width = scrolledPercentage + "%";
    };

    window.onload = function () {
        gamepad.progressTracker(".configuration-dashboard");
    };
})(fluid);
