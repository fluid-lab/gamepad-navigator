/*
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* global gamepad, chrome */

(function (fluid) {
    "use strict";

    fluid.registerNamespace("gamepad.messageListenerUtils");

    /**
     *
     * Open a new tab in the current window.
     *
     * @param {Boolean} active - Whether the new tab should be focused when created.
     * @param {String} homepageURL - The URL for the new tab.
     *
     */
    gamepad.messageListenerUtils.openNewTab = function (active, homepageURL) {
        chrome.tabs.create({ active: active, url: homepageURL });
    };

    /**
     *
     * Switch to the next or the previous tab in the current window.
     *
     * @param {String} tabDirection - The direction in which the tab focus should change,
     *
     */
    gamepad.messageListenerUtils.switchTab = function (tabDirection) {
        chrome.tabs.query({ currentWindow: true }, function (tabsArray) {
            // Switch only if more than one tab is present.
            if (tabsArray.length > 1) {
                // Find index of the currently active tab.
                var activeTabIndex = null;
                tabsArray.forEach(function (tab, index) {
                    if (tab.active) {
                        activeTabIndex = index;
                    }
                });

                // Switch browser tab.
                if (tabDirection === "previousTab") {
                    /**
                     * If the first tab is focused then switch to the last tab.
                     * Otherwise, switch to the previous tab.
                     */
                    if (activeTabIndex === 0) {
                        activeTabIndex = tabsArray.length;
                    }
                    chrome.tabs.update(tabsArray[activeTabIndex - 1].id, { active: true });
                }
                else if (tabDirection === "nextTab") {
                    // Switch to the next tab.
                    chrome.tabs.update(tabsArray[(activeTabIndex + 1) % tabsArray.length].id, { active: true });
                }
            }
        });
    };

    /**
     *
     * Open a new window.
     *
     * @param {Boolean} active - Whether the new window should be focused when created.
     * @param {String} homepageURL - The URL for the new window.
     *
     */
    gamepad.messageListenerUtils.openNewWindow = function (active, homepageURL) {
        var windowConfig = {
            url: homepageURL,
            focused: active
        };
        if (active) {
            windowConfig.state = "maximized";
        }
        chrome.windows.create(windowConfig);
    };

    /**
     *
     * Close the currently opened window.
     *
     */
    gamepad.messageListenerUtils.closeCurrentWindow = function () {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.windows.remove(currentWindow.id);
        });
    };

    /**
     *
     * Switch to the next or the previous window in the current window.
     *
     * @param {String} windowDirection - The direction in which the window focus should change,
     *
     */
    gamepad.messageListenerUtils.switchWindow = function (windowDirection) {
        chrome.windows.getAll(function (windowsArray) {
            // Switch only if more than one window is present.
            if (windowsArray.length > 1) {
                // Find index of the currently active window.
                var focusedWindowIndex = null;
                fluid.find(windowsArray, function (window, index) {
                    if (window.focused) {
                        focusedWindowIndex = index;
                        return true;
                    }
                });

                // Switch browser window.
                if (windowDirection === "previousWindow") {
                    /**
                     * If the first window is focused then switch to the last window.
                     * Otherwise, switch to the previous window.
                     */
                    if (focusedWindowIndex === 0) {
                        focusedWindowIndex = windowsArray.length;
                    }
                    chrome.windows.update(windowsArray[focusedWindowIndex - 1].id, {
                        focused: true
                    });
                }
                else if (windowDirection === "nextWindow") {
                    // Switch to the next window.
                    chrome.windows.update(windowsArray[(focusedWindowIndex + 1) % windowsArray.length].id, {
                        focused: true
                    });
                }
            }
        });
    };

    /**
     *
     * Change the zoom value of the current browser tab.
     *
     * @param {String} zoomType - Determines if the page should be zoomed in or out.
     *
     */
    gamepad.messageListenerUtils.setZoom = function (zoomType) {
        chrome.tabs.query({ currentWindow: true, active: true }, function (currentTab) {
            // Obtain the zoom value of the current tab.
            chrome.tabs.getZoom(currentTab.id, function (currentZoomFactor) {
                // Compute the new zoom value according to the zoom type.
                var newZoomFactor = null;
                if (zoomType === "zoomIn") {
                    newZoomFactor = currentZoomFactor + 0.1;
                }
                else if (zoomType === "zoomOut") {
                    newZoomFactor = currentZoomFactor - 0.1;
                }

                // Set the new zoom value.
                chrome.tabs.setZoom(currentTab.id, newZoomFactor);
            });
        });
    };

    /**
     *
     * Change the size of the current browser window.
     *
     * @param {Object} that - The messageListener component.
     * @param {String} windowState - Value of the new state of the browser window.
     *                               For example, "maximized", "minimized", etc.
     *
     */
    gamepad.messageListenerUtils.changeWindowSize = function (that, windowState) {
        chrome.windows.getCurrent(function (currentWindow) {
            chrome.windows.update(currentWindow.id, { state: windowState }, function () {
                /**
                 * Set the dimensions of the window if the "maximized" state doesn't work
                 * (Fallback Method).
                 */
                chrome.windows.getCurrent(function (windowPostUpdate) {
                    that.windowProperties[windowPostUpdate.id] = that.windowProperties[windowPostUpdate.id] || { isMaximized: null };

                    // Value of "state" on OS X is "fullscreen" if window is maximized.
                    if (that.windowProperties[windowPostUpdate.id].isMaximized === null) {
                        that.windowProperties[windowPostUpdate.id].isMaximized = windowPostUpdate.state === "fullscreen";
                    }
                    var isMaximized = that.windowProperties[windowPostUpdate.id].isMaximized;

                    /**
                     * Second check is for cases when the window is not maximized during
                     * the first update.
                     */
                    if (windowState === "maximized" && windowPostUpdate.state !== "maximized" && !isMaximized) {
                        // Preserve configuration before maximizing.
                        that.windowProperties[windowPostUpdate.id] = {
                            width: windowPostUpdate.width,
                            height: windowPostUpdate.height,
                            left: windowPostUpdate.left,
                            top: windowPostUpdate.top
                        };

                        // Update window with the new properties.
                        chrome.windows.update(windowPostUpdate.id, {
                            width: screen.width,
                            height: screen.height,
                            left: 0,
                            top: 0
                        });

                        // Update the isMaximized member variable.
                        that.windowProperties[windowPostUpdate.id].isMaximized = true;
                    }
                    else if (windowPostUpdate.state === "normal" && windowState === "normal" && isMaximized) {
                        var previousProperties = that.windowProperties[windowPostUpdate.id];

                        // Update window with the new properties.
                        chrome.windows.update(windowPostUpdate.id, {
                            width: fluid.get(previousProperties, "width") || Math.round(3 * screen.width / 5),
                            height: fluid.get(previousProperties, "height") || Math.round(4 * screen.height / 5),
                            left: fluid.get(previousProperties, "left") || Math.round(screen.width / 15),
                            top: fluid.get(previousProperties, "top") || Math.round(screen.height / 15)
                        });

                        // Update the isMaximized member variable.
                        that.windowProperties[windowPostUpdate.id].isMaximized = false;
                    }
                });
            });
        });
    };
})(fluid);
