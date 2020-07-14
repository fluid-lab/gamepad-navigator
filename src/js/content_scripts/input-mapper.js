/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global chrome, ally */

(function (fluid, $) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.inputMapper");

    fluid.defaults("gamepad.inputMapper", {
        gradeNames: ["gamepad.inputMapper.base"],
        listeners: {
            "onCreate.restoreFocus": "{that}.restoreFocus"
        },
        invokers: {
            restoreFocus: {
                funcName: "gamepad.inputMapper.restoreFocus",
                args: ["{that}.options.windowObject", "{that}.tabindexSortFilter"]
            },
            closeCurrentTab: {
                funcName: "gamepad.inputMapperUtils.background.closeCurrentTab",
                args: ["{arguments}.0", "{arguments}.4"]
            },
            openNewTab: {
                funcName: "gamepad.inputMapperUtils.background.openNewTab",
                args: ["{arguments}.0", "{arguments}.3", "{arguments}.4", "{arguments}.5"]
            }
        }
    });

    /**
     *
     * Restore the previously focused element on the webpage after history navigation.
     *
     * @param {Object} windowObject - The inputMapper component's windowObject option.
     * @param {Function} tabindexSortFilter - The filter to be used for sorting elements
     *                                        based on their tabindex value.
     *
     */
    gamepad.inputMapper.restoreFocus = function (windowObject, tabindexSortFilter) {
        $(document).ready(function () {
            /**
             * Get the index of the previously focused element stored in the local
             * storage.
             */
            var pageAddress = windowObject.location.href;
            chrome.storage.local.get([pageAddress], function (resultObject) {
                // Focus only if some element was focused before the history navigation.
                var activeElementIndex = resultObject[pageAddress];
                if (activeElementIndex && activeElementIndex !== -1) {
                    var tabbableElements = ally.query.tabbable({ strategy: "strict" }).sort(tabindexSortFilter),
                        activeElement = tabbableElements[activeElementIndex];
                    if (activeElement) {
                        activeElement.focus();
                    }

                    // Clear the stored index of the active element after usage.
                    chrome.storage.local.remove([pageAddress]);
                }
            });
        });
    };

    // Create an instance of the component.
    gamepad.inputMapper();
})(fluid, jQuery);
