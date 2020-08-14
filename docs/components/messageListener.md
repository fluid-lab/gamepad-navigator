<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# `gamepad.messageListener`

This component listens to the messages and signals sent by the [`inputMapper`](inputMapper.md) component in the content
scripts and then calls the action invokers according to the received message.

## Using this grade

The component can be used by creating its instance or by making a custom component using the grade.

``` javascript
// Either create an instance of the messageListener.
var messageListenerInstanceOne = gamepad.messageListener();

// Otherwise create a custom component using the messageListener grade.
fluid.defaults("my.messageListener.grade", {
    gradeNames: ["gamepad.messageListener", "my.CustomGrade"]
});
var messageListenerInstanceTwo = my.messageListener.grade();
```

## Component Options

This component does not provide any configuration options.

## Non-navigation Invokers

### `{messageListener}.addListener()`

- Returns: Nothing.

Listens to the messages received from the [`inputMapper`](inputMapper.md) component in the content scripts by using
[`chrome.runtime.onMessage.addListener`](https://developer.chrome.com/extensions/runtime#event-onMessage) and triggers
the [actionExecutor](#messagelisteneractionexecutoractiondata) invoker as a callback function.

### `{messageListener}.actionExecutor(actionData)`

- `actionData {Object}` The message object received from the [`inputMapper`](inputMapper.md) component in the content
  scripts. (see below)
- Returns: Nothing.

Identifies and triggers the **navigation-producing invokers** according to the `actionData`. The navigation-producing
invoker is triggered only if the component provides it. Each of these invokers accepts the following arguments:

- `tabId`: ID of the currently active tab.
- `invert`: Whether direction of the given action should be in the opposite order (for thumbsticks).
- `active`: Whether a new tab or window should be focused when opened.
- `homepageURL`: The URL that a new tab or window should load when opened.
- `left`: Position of the current browser window from the screen's left edge (in pixels).

The invokers use only those arguments required to perform their specific action. Some of these arguments are extracted
from the `actionData` object recieved from the content scripts. Below is an example of the `actionData` object.

``` snippet
{
  action: "openNewTab",
  active: true,
  homepageURL: "https://www.google.com/"
}
```

## Navigation Invokers

### `{messageListener}.openNewTab(active, homepageURL)`

- `active {Boolean}` Whether a new browser tab should be focused when opened.
- `homepageURL {String}` The URL that a new browser tab should load when opened.
- Returns: Nothing.

Opens a new tab in the current browser window using the
[`chrome.tabs.create`](https://developer.chrome.com/extensions/tabs#method-create) method.

### `{messageListener}.closeCurrentTab(tabId)`

- `tabId {Number}` ID of the currently active tab.
- Returns: Nothing.

Closes the current tab in the active browser window using the
[`chrome.tabs.remove`](https://developer.chrome.com/extensions/tabs#method-remove) method.

### `{messageListener}.goToPreviousTab()`

- Returns: Nothing.

Switches from the current tab to the previous tab in the active browser window. If the active tab is the first tab in
the list, then the focus will move to the last tab.

### `{messageListener}.goToNextTab()`

- Returns: Nothing.

Switches from the current tab to the next tab in the active browser window. If the active tab is the last tab in the
list, then the focus will move to the first tab.

### `{messageListener}.openNewWindow(active, homepageURL)`

- `active {Boolean}` Whether a new browser window should be focused when opened.
- `homepageURL {String}` The URL that a new browser window should load when opened.
- Returns: Nothing.

Opens a new browser window using the
[`chrome.windows.create`](https://developer.chrome.com/extensions/windows#method-create) method.

### `{messageListener}.closeCurrentWindow()`

- Returns: Nothing.

Closes the currently active browser window using the
[`chrome.windows.getCurrent`](https://developer.chrome.com/extensions/windows#method-getCurrent) and
[`chrome.windows.remove`](https://developer.chrome.com/extensions/windows#method-remove) methods.

### `{messageListener}.goToPreviousWindow()`

- Returns: Nothing.

Switches from the currently active browser window to the previous browser window. If the active window is the first
window in the list, then the focus will move to the last window.

### `{messageListener}.goToNextWindow()`

- Returns: Nothing.

Switches from the currently active browser window to the next browser window. If the active window is the last window in
the list, then the focus will move to the first window.

### `{messageListener}.zoomIn()`

- Returns: Nothing.

Zoom in on the current tab in the active browser window using the
[`chrome.tabs.query`](https://developer.chrome.com/extensions/tabs#method-query),
[`chrome.tabs.getZoom`](https://developer.chrome.com/extensions/tabs#method-getZoom), and
[`chrome.tabs.setZoom`](https://developer.chrome.com/extensions/tabs#method-setZoom) methods.

### `{messageListener}.zoomOut()`

- Returns: Nothing.

Zoom out on the current tab in the active browser window using the
[`chrome.tabs.query`](https://developer.chrome.com/extensions/tabs#method-query),
[`chrome.tabs.getZoom`](https://developer.chrome.com/extensions/tabs#method-getZoom), and
[`chrome.tabs.setZoom`](https://developer.chrome.com/extensions/tabs#method-setZoom) methods.

### `{messageListener}.maximizeWindow(left)`

- `left {Number}` Position of the current browser window from the screen's left edge (in pixels).
- Returns: Nothing.

Maximize the current browser window. Saves the browser window's position and dimensions inside the `windowProperties`
member variable before the window is maximized.

### `{messageListener}.restoreWindowSize(left)`

- `left {Number}` Position of the current browser window from the screen's left edge (in pixels).
- Returns: Nothing.

Restores the size of the currently active browser window. The previous dimensions and positions are taken from the
`windowProperties` member variable if stored previously. Otherwise, a set of default values are used for the window's
position and dimensions.

### `{messageListener}.reopenTabOrWindow()`

- Returns: Nothing.

Reopens the last closed browser tab or window using the
[`chrome.sessions.restore`](https://developer.chrome.com/extensions/sessions#method-restore) method.
