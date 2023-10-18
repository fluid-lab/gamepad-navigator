<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# `gamepad.inputMapper`

<!-- TODO: Add links to the messageListener component's documentation -->

This component extends the [`inputMapper.base`](inputMapper.base.md) grade to provide **inter-web page navigation**
features. It should be used with the `messageListener` component as the navigation-producing invokers rely on background
scripts to work correctly.

## Using this grade

The component can be used by creating its instance. However, you might face issues as multiple tabs will read gamepad
inputs at the same time. To avoid those issues, you should use `gamepad.visibilityChangeTracker` in combination with
`gamepad.inputMapperManager`.

``` javascript
gamepad.visibilityChangeTracker(gamepad.inputMapperManager);
```

`gamepad.visibilityChangeTracker` determines whether a browser tab is **visible** or **hidden**. It then passes the
state of the tab as an argument to the `gamepad.inputMapperManager`, which creates and destroys the instance of
`gamepad.inputMapper` accordingly.

## Component Options

This component supports the same [configuration options](inputMapper.base.md#component-options) provided by the
[`inputMapper.base`](inputMapper.base.md) component. You can provide custom configuration options to the component as
shown in the following example.

``` javascript
gamepad.visibilityChangeTracker(gamepad.inputMapperManager, {
    cutoffValue: 0.50,
    scrollInputMultiplier: 60,
    model: {
        map: {
            buttons: {
                "0": {
                    currentAction: "scrollDown",
                    speedFactor: 2.2
                }
            }
        }
    }
});
```

## Non-navigation Invokers

### `{inputMapper}.restoreFocus()`

- Returns: Nothing.

Restores the focus on the last focused element after the state of browser tab is changed from **hidden** to **visible**
or after the web page is reloaded due to refreshing or history navigation.

### `{inputMapper}.updateControls()`

- Returns: Nothing.

Listens to the `onCreate` event of the `inputMapper` component and updates the `map` model variable with the custom
gamepad configuration data (saved using the configuration panel).

## Navigation Invokers

### `{inputMapper}.goToPreviousTab(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to switch to the previous browser
tab using buttons and triggers. If the active tab is the first tab in the list, it will switch to the last tab.

### `{inputMapper}.goToNextTab(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to switch to the next browser tab
using buttons and triggers. If the active tab is the last tab in the list, it will switch to the first tab.

### `{inputMapper}.closeCurrentTab(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to close the current browser tab
using buttons and triggers.

### `{inputMapper}.openNewTab(value, oldValue, background, homepageURL)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- `background {Boolean}` Whether a new browser tab should open in background.
- `homepageURL {String}` URL that a new browser tab should load when opened.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to open a new browser tab
using buttons and triggers.

### `{inputMapper}.openNewWindow(value, oldValue, background, homepageURL)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- `background {Boolean}` Whether a new browser window should open in background.
- `homepageURL {String}` URL that a new browser window should load when opened.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to open a new browser window
using buttons and triggers.

### `{inputMapper}.closeCurrentWindow(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to close the current browser window
using buttons and triggers.

### `{inputMapper}.goToPreviousWindow(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to switch to the previous browser
window using buttons and triggers.

### `{inputMapper}.goToNextWindow(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to switch to the next browser
window using buttons and triggers.

### `{inputMapper}.zoomIn(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to zoom in on the current web page
using buttons and triggers.

### `{inputMapper}.zoomOut(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to zoom out on the current web page
using buttons and triggers.

### `{inputMapper}.thumbstickZoom(value, invert)`

- `value {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick direction for zoom should be in opposite order (see below).
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to change the zoom on the current
web page according to the direction the thumbstick is pressed. For example, left on the horizontal axis and upward on
the vertical axis of a thumbstick should zoom in on the current web page. Pressing the thumbstick in opposite direction
should zoom out on the current web page.

### `{inputMapper}.maximizeWindow(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to maximize the current browser
window using buttons and triggers.

### `{inputMapper}.restoreWindowSize(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to restore the size of current
browser window using buttons and triggers.

### `{inputMapper}.thumbstickWindowSize(value, invert)`

- `value {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick direction for zoom should be in opposite order (see below).
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to change the size of the current
browser window according to the direction the thumbstick is pressed. For example, left on the horizontal axis and upward
on the vertical axis of a thumbstick should restore the current browser window size. Pressing the thumbstick in opposite
direction should maximize the current browser window.

### `{inputMapper}.reopenTabOrWindow(value, oldValue)`

- `value {Number}` Current value of the gamepad input.
- `oldValue {Number}` Previous value of the gamepad input.
- Returns: Nothing.

Sends a message to the `messageListener` component present in the background script to reopen the last closed browser
session using buttons and triggers. The closed session could be a tab or a window.

### `{inputMapper}.sendArrowLeft(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Send a left arrow to the current focused element when a button is pressed.

### `{inputMapper}.sendArrowRight(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Send a right arrow to the current focused element when a button is pressed.

### `{inputMapper}.sendArrowUp(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Send an up arrow to the current focused element when a button is pressed.

### `{inputMapper}.sendArrowDown(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Send a down arrow to the current focused element when a button is pressed.

### `{inputMapper}.thumbstickHorizontalArrows(value, speedFactor, invert)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick direction for zoom should be in opposite order.
- Returns: Nothing.

Send left/right arrows to the current focused element to simulate arrow navigation.

### `{inputMapper}.thumbstickVerticalArrows(value, speedFactor, invert)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick direction for zoom should be in opposite order.
- Returns: Nothing.

Send up/down arrows to the current focused element to simulate arrow navigation.
