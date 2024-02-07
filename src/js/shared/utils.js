/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/

/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
/* globals chrome */
(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");
    fluid.registerNamespace("gamepad.utils");

    gamepad.utils.isDeeplyEqual = function (firstThing, secondThing) {
        if (typeof firstThing !== typeof secondThing) {
            return false;
        }
        else if (Array.isArray(firstThing)) {
            if (firstThing.length === secondThing.length) {
                for (var arrayIndex = 0; arrayIndex < firstThing.length; arrayIndex++) {
                    var arrayItemsEqual = gamepad.utils.isDeeplyEqual(firstThing[arrayIndex], secondThing[arrayIndex]);
                    if (!arrayItemsEqual) { return false; }
                }
                return true;
            }
            else {
                return false;
            }
        }
        else if (typeof firstThing === "object") {
            var firstThingKeys = Object.keys(firstThing);
            var secondThingKeys = Object.keys(secondThing);

            if (firstThingKeys.length !== secondThingKeys.length) {
                return false;
            }

            for (var keyIndex = 0; keyIndex < firstThingKeys.length; keyIndex++) {
                var key = firstThingKeys[keyIndex];
                var objectPropertiesEqual = gamepad.utils.isDeeplyEqual(firstThing[key], secondThing[key]);
                if (!objectPropertiesEqual) { return false; }
            }

            return true;
        }
        else {
            return firstThing === secondThing;
        }
    };

    gamepad.utils.getStoredKey = function (key) {
        var storagePromise = new Promise(function (resolve) {
            // Apparently, we have to use a callback and can't use `await` unless we make our own wrapper.
            chrome.storage.local.get([key], function (storedObject) {
                if (storedObject[key]) {
                    resolve(storedObject[key]);
                }
                else {
                    resolve(false);
                }
            });
        });
        return storagePromise;
    };

})(fluid);
