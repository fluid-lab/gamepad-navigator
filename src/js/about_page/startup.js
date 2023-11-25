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
