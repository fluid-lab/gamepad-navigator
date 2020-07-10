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
     * Open a new tab.
     *
     * @param {Boolean} active - Whether the new tab should be focused when created.
     *
     */
    gamepad.messageListenerUtils.openNewTab = function (active) {
        chrome.tabs.create({ active: active });
    };
})(fluid);
