/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/* global chrome */

(function () {
    "use strict";

    var gamepad = { messageListener: {}, messageListenerUtils: {} };

    gamepad.messageListenerUtils.getCurrentTab = async function () {
        var currentTabs = await chrome.tabs.query({ currentWindow: true, active: true });
        if (currentTabs.length) {
            return currentTabs[0];
        }
    };

    /**
     *
     * Open a new tab in the current window.
     *
     * @param {Boolean} active - Whether the new tab should be focused when created.
     * @param {String} newTabOrWindowURL - The URL for the new tab.
     *
     */
    gamepad.messageListenerUtils.openNewTab = function (active, newTabOrWindowURL) {
        chrome.tabs.create({ active: active, url: newTabOrWindowURL });
    };

    /**
     *
     * Switch to the next or the previous tab in the current window.
     *
     * @param {String} tabDirection - The direction in which the tab focus should change.
     * @return {Promise} - A promise that will resolve with a response payload.
     *
     */
    gamepad.messageListenerUtils.switchTab = async function (tabDirection) {
        var tabsArray = await chrome.tabs.query({ currentWindow: true });
        // Filter to "controllable" tabs.
        var filteredTabs = tabsArray.filter(gamepad.messageListenerUtils.filterControllableTabs);

        // Switch only if more than one tab is present.
        if (filteredTabs.length > 1) {
            // Find index of the currently active tab.
            var activeTabIndex = null;
            filteredTabs.forEach(function (tab, index) {
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
                    activeTabIndex = filteredTabs.length;
                }
                await chrome.tabs.update(filteredTabs[activeTabIndex - 1].id, { active: true });
            }
            else if (tabDirection === "nextTab") {
                // Switch to the next tab.
                await chrome.tabs.update(filteredTabs[(activeTabIndex + 1) % filteredTabs.length].id, { active: true });
            }
        }
        else {
            return { vibrate: true };
        }
    };

    /**
     *
     * Open a new window.
     *
     * @param {Boolean} active - Whether the new window should be focused when created.
     * @param {String} newTabOrWindowURL - The URL for the new window.
     *
     */
    gamepad.messageListenerUtils.openNewWindow = function (active, newTabOrWindowURL) {
        var windowConfig = {
            url: newTabOrWindowURL,
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
     * @return {Promise} - A `Promise` that will complete with a response payload.
     *
     */
    gamepad.messageListenerUtils.closeCurrentWindow = async function () {
        var windowArray = await chrome.windows.getAll({ populate: true});
        var controllableWindows = windowArray.filter(gamepad.messageListenerUtils.filterControllableWindows);
        if (controllableWindows.length > 1) {
            var focusedWindow = false;
            var focusedWindowIndex = -1;

            controllableWindows.forEach(function (window, index) {
                if (window.focused) {
                    focusedWindow = window;
                    focusedWindowIndex = index;
                }
            });

            if (focusedWindow) {
                var newFocusIndex = (focusedWindowIndex + 1) % controllableWindows.length;
                var windowToFocus = controllableWindows[newFocusIndex];

                chrome.windows.remove(focusedWindow.id);

                chrome.windows.update(windowToFocus.id, {
                    focused: true
                });
            }
        }
        else {
            return { vibrate: true };
        }
    };

    // Exclude tabs which do not contain our scripts and cannot be controlled using a gamepad.
    gamepad.messageListenerUtils.filterControllableTabs = function (tabElement) {
        return tabElement.url && !tabElement.url.startsWith("chrome://") && !tabElement.url.startsWith("edge://");
    };

    // Exclude windows that do not contain controllable tabs (see above).
    gamepad.messageListenerUtils.filterControllableWindows = function (windowElement) {
        if (!windowElement.tabs) { return false; }

        var filteredTabs = windowElement.tabs.filter(gamepad.messageListenerUtils.filterControllableTabs);
        return filteredTabs.length > 0;
    };

    /**
     *
     * Switch to the next or the previous window in the current window.
     *
     * @param {String} windowDirection - The direction in which the window focus should change,
     * @return {Promise} - A `Promise` that will complete with a response payload.
     *
     */
    gamepad.messageListenerUtils.switchWindow = async function (windowDirection) {
        var focusedWindow = await chrome.windows.getLastFocused();
        if (focusedWindow) {
            var windowsArray = await chrome.windows.getAll({ populate: true});
            // Filter to controllable windows.
            var filteredWindows = windowsArray.filter(gamepad.messageListenerUtils.filterControllableWindows);

            // Switch only if more than one window is present.
            if (filteredWindows.length > 1) {
                // Find the index of the currently active window.
                var focusedWindowIndex = null;
                for (var index = 0; index < filteredWindows.length; index++) {
                    if (focusedWindowIndex === null) {
                        var window = filteredWindows[index];
                        if (window.id === focusedWindow.id) {
                            focusedWindowIndex = index;
                        }
                    }
                }

                if (focusedWindowIndex === null) {
                    throw new Error("Can't detect focused browser window.");
                }
                else {
                    var windowIndexToFocus = focusedWindowIndex;
                    // Switch browser window.
                    if (windowDirection === "previousWindow") {
                        if (focusedWindowIndex === 0) {
                            windowIndexToFocus = filteredWindows.length - 1;
                        }
                        else {
                            windowIndexToFocus = focusedWindowIndex - 1;
                        }
                    }
                    else if (windowDirection === "nextWindow") {
                        if (focusedWindowIndex >= filteredWindows.length - 1) {
                            windowIndexToFocus = 0;
                        }
                        else {
                            windowIndexToFocus = focusedWindowIndex + 1;
                        }
                    }

                    await chrome.windows.update(filteredWindows[windowIndexToFocus].id, {
                        focused: true
                    });
                }
            }
            else {
                return { vibrate: true };
            }
        }
    };

    /**
     *
     * Change the zoom value of the current browser tab.
     *
     * @param {String} zoomType - Determines if the page should be zoomed in or out.
     * @return {Object} - A response payload if there are custom instructions for the client to follow up on.
     */
    gamepad.messageListenerUtils.setZoom = async function (zoomType) {
        var currentTab = await gamepad.messageListenerUtils.getCurrentTab();

        if (currentTab) {
            // Obtain the zoom value of the current tab.
            var currentZoomFactor = await chrome.tabs.getZoom(currentTab.id);

            // Compute the new zoom value according to the zoom type.
            var newZoomFactor = null;
            if (zoomType === "zoomIn") {
                newZoomFactor = currentZoomFactor + 0.1;
            }
            else if (zoomType === "zoomOut") {
                newZoomFactor = currentZoomFactor - 0.1;
            }

            if (currentZoomFactor === newZoomFactor) {
                return { vibrate: true };
            }
            else {
                // Set the new zoom value.
                chrome.tabs.setZoom(currentTab.id, newZoomFactor);
            }
        }
    };

    /**
     *
     * Change the size of the current browser window.
     *
     * @param {Object} that - The messageListener component.
     * @param {String} windowState - Value of the new state of the browser window.
     *                               For example, "maximized", "minimized", etc.
     * @param {Number} left - The position of the left edge of the screen (in pixels).
     * @return {Promise} - A promise that will resolve with a response payload.
     *
     */
    gamepad.messageListenerUtils.changeWindowSize = async function (that, windowState, left) {
        var currentWindow = await chrome.windows.getCurrent();

        if (currentWindow.state === windowState) {
            return { vibrate: true };
        }

        await chrome.windows.update(currentWindow.id, { state: windowState });

        var windowPostUpdate = await chrome.windows.getCurrent();
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
            await chrome.windows.update(windowPostUpdate.id, {
                width: screen.width,
                height: screen.height,
                left: left,
                top: 0
            });

            // Update the isMaximized member variable.
            that.windowProperties[windowPostUpdate.id].isMaximized = true;
        }
        else if (windowPostUpdate.state === "normal" && windowState === "normal" && isMaximized) {
            var previousProperties = that.windowProperties[windowPostUpdate.id];

            // Update window with the new properties.
            await chrome.windows.update(windowPostUpdate.id, {
                width: previousProperties.width || Math.round(3 * screen.width / 5),
                height: previousProperties.height || Math.round(4 * screen.height / 5),
                left: previousProperties.left || (left + Math.round(screen.width / 15)),
                top: previousProperties.top || Math.round(screen.height / 15)
            });

            // Update the isMaximized member variable.
            that.windowProperties[windowPostUpdate.id].isMaximized = false;
        }
    };

    gamepad.messageListenerUtils.search = function (actionOptions) {
        chrome.search.query({
            disposition: actionOptions.disposition,
            text: actionOptions.text
        });
    };

    gamepad.messageListenerUtils.openOptionsPage = async function () {
        var windowsArray = await chrome.windows.getAll({ populate: true});
        var settingsWindowId = null;
        var settingsTabId = null;
        windowsArray.forEach(function (window) {
            if (!settingsTabId) {
                var settingsTab = window.tabs.find(function (tab) {
                    return tab.url.startsWith("chrome-extension://") && tab.url.endsWith("settings.html");
                });
                if (settingsTab) {
                    settingsWindowId = window.id;
                    settingsTabId = settingsTab.id;
                }
            }
        });

        // If there's already a settings tab, focus on it.
        if (settingsTabId) {
            await chrome.windows.update(settingsWindowId, { focused: true});
            await chrome.tabs.update(settingsTabId, { active: true });
        }
        // Otherwise, open a new one.
        else {
            return await chrome.runtime.openOptionsPage();
        }
    };

    var messageListener = {
        // previous "members"
        windowProperties: {},

        // previous "invokers", or "actions".
        // On the client side, we check the control state before triggering
        // these, so the method signature is simply `action(actionOptions)`.
        openNewTab: async function (actionOptions) {
            return await gamepad.messageListenerUtils.openNewTab(actionOptions.active, actionOptions.newTabOrWindowURL);
        },
        closeCurrentTab: async function () {
            var tabs = await chrome.tabs.query({ currentWindow: true });
            var activeTab = tabs.find(function (tab) { return tab.active === true; });

            if (activeTab) {
                var controllableTabs = tabs.filter(gamepad.messageListenerUtils.filterControllableTabs);
                // More than one controllable tab, just close the tab.
                if (controllableTabs.length > 1) {
                    await chrome.tabs.remove(activeTab.id);
                }
                // Fail over to the window close logic, which will check for controllable tabs in other windows.
                else {
                    return await gamepad.messageListenerUtils.closeCurrentWindow();
                }
            }
        },
        openNewWindow: async function (actionOptions) {
            return await gamepad.messageListenerUtils.openNewWindow(actionOptions.active, actionOptions.newTabOrWindowURL);
        },

        maximizeWindow: async function (actionOptions) {
            return await gamepad.messageListenerUtils.changeWindowSize(messageListener, "maximized", actionOptions.left);
        },
        restoreWindowSize: async function (actionOptions) {
            return await gamepad.messageListenerUtils.changeWindowSize(messageListener, "normal", actionOptions.left);
        },

        // Restored windows have focus, so there is still a danger of uncontrollable windows popping up.
        reopenTabOrWindow: async function () {
            await chrome.sessions.restore();
        },
        goToPreviousWindow: async function () {
            return await gamepad.messageListenerUtils.switchWindow("previousWindow");
        },
        goToNextWindow: async function () {
            return await gamepad.messageListenerUtils.switchWindow("nextWindow");
        },
        zoomIn: async function () {
            return await gamepad.messageListenerUtils.setZoom("zoomIn");
        },
        zoomOut: async function () {
            return await gamepad.messageListenerUtils.setZoom("zoomOut");
        },
        goToPreviousTab: async function () {
            return await gamepad.messageListenerUtils.switchTab("previousTab");
        },
        goToNextTab: async function () {
            return await gamepad.messageListenerUtils.switchTab("nextTab");
        },
        closeCurrentWindow: gamepad.messageListenerUtils.closeCurrentWindow,
        search: gamepad.messageListenerUtils.search,
        openOptionsPage: gamepad.messageListenerUtils.openOptionsPage,
        reloadTab: async function () {
            var currentTab = await gamepad.messageListenerUtils.getCurrentTab();

            if (currentTab) {
                await chrome.tabs.reload(currentTab.id);
            }
        },
        duplicateTab: async function () {
            var currentTab = await gamepad.messageListenerUtils.getCurrentTab();

            if (currentTab) {
                await chrome.tabs.duplicate(currentTab.id);
            }
        }
    };

    chrome.runtime.onConnect.addListener(function (port) {
        port.onMessage.addListener(async function (actionOptions) {
            // Execute the actions only if the action data is available.
            if (actionOptions.action) {
                var action = messageListener[actionOptions.action];

                // Trigger the action only if a valid action is found.
                if (action) {
                    var actionResult = await action(actionOptions);
                    port.postMessage(actionResult);
                    port.disconnect();
                }
            }
        });
    });

    var startupWindowCheckFn = async function () {
        var windowsArray = await chrome.windows.getAll({ populate: true});
        // Filter to controllable windows.
        var filteredWindows = windowsArray.filter(gamepad.messageListenerUtils.filterControllableWindows);

        if (filteredWindows.length === 0) {
            chrome.storage.local.get(["gamepad-prefs"], function (storedObject) {
                var storedPrefs = storedObject && storedObject["gamepad-prefs"];
                // If our prefs exactly match the defaults, nothing is stored.
                // In this case, the default behaviour is to open a window, so if
                // there are no stored settings, we do that.
                if (!storedPrefs || storedPrefs["openWindowOnStartup"]) {
                    chrome.runtime.openOptionsPage();
                }
            });
        }
    };

    // If the user's preferences allow us to, open the settings panel on startup or when the plugin is (re)installed.
    chrome.runtime.onStartup.addListener(startupWindowCheckFn);
    chrome.runtime.onInstalled.addListener(startupWindowCheckFn);

    // Open the settings panel when the icon is clicked.
    chrome.action.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage();
    });
})();
