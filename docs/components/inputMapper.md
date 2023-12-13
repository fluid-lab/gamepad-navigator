<!--
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
-->

# `gamepad.inputMapper`

This component extends the [`inputMapper.base`](inputMapper.base.md) grade to provide **inter-web page navigation**
features. It should be used with the `messageListener` background script as the navigation-producing invokers rely on
the background script to work correctly.

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

This component supports the same key model variables as [the base grade](inputMapper.base.md).

## Non-navigation Invokers

### `{inputMapper}.restoreFocus()`

- Returns: Nothing.

Restores the focus on the last focused element after the state of browser tab is changed from **hidden** to **visible**
or after the web page is reloaded due to refreshing or history navigation.

## Actions

### `{inputMapper}.goToPreviousTab`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Sends a message to the background script to switch to the previous browser
tab using buttons and triggers. If the active tab is the first tab in the list, it will switch to the last tab. Vibrates
the gamepad if there are no other controllable tabs open.

### `{inputMapper}.goToNextTab`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Sends a message to the background script to switch to the next browser tab
using buttons and triggers. If the active tab is the last tab in the list, it will switch to the first tab. Vibrates the
gamepad if there are no other controllable tabs open.

### `{inputMapper}.closeCurrentTab`

Sends a message to the background script to close the current browser tab
using buttons and triggers.

### `{inputMapper}.openNewTab`

This action supports the following options:

- `background {Boolean}` Whether to open the new tab in the background.

Sends a message to the background script to open a new browser tab
using buttons and triggers.

### `{inputMapper}.openNewWindow`

This action supports the following options:

- `background {Boolean}` Whether to open the new tab in the background.

Sends a message to the background script to open a new browser window
using buttons and triggers.

### `{inputMapper}.closeCurrentWindow`

Sends a message to the background script to close the current browser window
using buttons and triggers.

### `{inputMapper}.goToPreviousWindow`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Sends a message to the background script to switch to the previous browser
window using buttons and triggers. Vibrates the gamepad if there are no other controllable windows open.

### `{inputMapper}.goToNextWindow`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Sends a message to the background script to switch to the next browser
window using buttons and triggers. Vibrates the gamepad if there are no other controllable windows open.

### `{inputMapper}.zoomIn`

Sends a message to the background script to zoom in on the current web page
using buttons and triggers. Vibrates the gamepad if the page is already zoomed in as far as possible.

### `{inputMapper}.zoomOut`

Sends a message to the background script to zoom out on the current web page
using buttons and triggers. Vibrates the gamepad if the page is already zoomed out as far as possible.

### `{inputMapper}.thumbstickZoom`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `invert {Boolean}` Whether the thumbstick tab navigation should be in opposite order (see below).

Sends a message to the background script to change the zoom on the current
web page according to the direction the thumbstick is pressed. For example, left on the horizontal axis and upward on
the vertical axis of a thumbstick should zoom in on the current web page. Pressing the thumbstick in opposite direction
should zoom out on the current web page.  Vibrates when the user has zoomed as far in or out as possible.

### `{inputMapper}.maximizeWindow`

Sends a message to the background script to maximize the current browser window.  Vibrates the gamepad if the browser
window has already been maximized.

### `{inputMapper}.restoreWindowSize`

Sends a message to the background script to restore the size of current browser window. Vibrates the gamepad if the
browser window has already been restored to its previous size.

### `{inputMapper}.thumbstickWindowSize`

This action supports the following options:

- `invert {Boolean}` Whether the thumbstick direction should be inverted.

Sends a message to the background script to change the size of the current
browser window according to the direction the thumbstick is pressed. For example, left on the horizontal axis and upward
on the vertical axis of a thumbstick should restore the current browser window size. Pressing the thumbstick in opposite
direction should maximize the current browser window.  Vibrates if the browser window is already at the desired size.

### `{inputMapper}.reopenTabOrWindow`

Sends a message to the background script to reopen the last closed browser
session using buttons and triggers. The closed session could be a tab or a window.
