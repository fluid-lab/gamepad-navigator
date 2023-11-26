/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
*/

/* globals chrome */
(function () {
    "use strict";
    window.addEventListener("load", function () {
        // Attempt to close this window, the background script will only close it if there other controllable windows available.
        var port = chrome.runtime.connect();
        port.postMessage({
            actionName: "closeCurrentTab"
        });
    });
})();
