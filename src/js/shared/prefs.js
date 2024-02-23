/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
(function (fluid) {
    "use strict";
    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.prefs");
    gamepad.prefs.defaults = {
        analogCutoff: 0.25,
        arrowModals: true,
        controlsOnAllMedia: true,
        fixFocus: false,
        newTabOrWindowURL: "https://www.google.com/",
        openWindowOnStartup: true,
        pollingFrequency: 50,
        vibrate: true
    };
})(fluid);
