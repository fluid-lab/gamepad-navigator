<!--
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
-->

# `gamepad.inputMapper.base`

This component transforms the gamepad inputs into actions. It is derived from the combination of two grades - the
[`navigator`](navigator.md) grade, which reads and stores the gamepad inputs in the form of model data. The navigation
features available with this component are limited to **intra-web page navigation** features. (Use the
[`inputMapper`](inputMapper.md) component for **inter-web page navigation** features)

## Using this grade

The configuration options can be changed by either extending the component or by passing your own options. If no
options are passed, the defaults are used.

``` javascript
// Either create an instance of the inputMapper.base component.
var inputMapperBaseInstanceOne = gamepad.inputMapper.base();

// Otherwise create a custom component using the inputMapper.base grade.
fluid.defaults("my.inputMapperBase.grade", {
    gradeNames: ["gamepad.inputMapper.base", "my.CustomGrade"]
});
var inputMapperBaseInstanceTwo = my.inputMapperBase.grade();
```

## Component Options

All options used by this component are part of its `model`:

- `model.prefs` represents the [user preferences](preferences.md)
- `model.bindings` represents the [actions bound to gamepad inputs](bindings.md)

## Non-action Invokers

### `{inputMapper.base}.produceNavigation(change)`

- `change {Object}` Receipt for the change in input values.
- Returns: Nothing.

Listens for the changes in gamepad input values stored in the `inputMapper.base` component's model data, and calls any
[action](./actions.md) that is bound to the input (see [bindings](./bindings.md)).

### `{inputMapper.base}.clearIntervalRecords()`

- Returns: Nothing.

Clears all running interval loops when the last gamepad is disconnected or when the instance of the `inputMapper.base`
component is destroyed.

### `{inputMapper.base}.trackDOM()`

- Returns: Nothing.

Listens for changes to the DOM using `MutationObserver`. When the DOM has loaded or is changed, it updates the list of
tabbable elements used by the `tabForward` and `tabBackward` actions.

### `{inputMapper.base}.stopTrackingDOM()`

- Returns: Nothing.

Stops the `MutationObserver` started by the [`{inputMapper.base}.trackDOM`](#inputmapperbasetrackdom) from listening to
changes to the DOM. Called by the `inputMapper.base` component when it is destroyed.

## Actions

The remaining invokers are [actions](actions.md).

### `{inputMapper.base}.click`

Performs a click on the focused element when the gamepad button or trigger is pressed. However, a click on a `select`
form element is simulated by changing its size.

### `{inputMapper.base}.previousPageInHistory`

Navigates to the previous page in history when the gamepad button or trigger is pressed. Uses the
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The focused
element of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. The saved element is used to restore focus when the user navigates back to the same page.
Vibrates the gamepad if there are no other pages in the history.

### `{inputMapper.base}.nextPageInHistory`

Navigates to the next page in history when the gamepad button or trigger is pressed. Uses the
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The focused
element of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. The saved element is used to restore focus when the user navigates back to the same page.
Vibrates the gamepad if there are no other pages in the history.

### `{inputMapper.base}.thumbstickHistoryNavigation`

This action supports the following options:

- `invert {Boolean}` Whether the thumbstick history navigation should be in opposite order (see below).

Calls the [`{inputMapper.base}.previousPageInHistory`](#inputmapperbasepreviouspageinhistory) and
[`{inputMapper.base}.nextPageInHistory`](#inputmapperbasenextpageinhistory) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick
navigates to the previous page in history. Pressing the thumbstick in opposite direction navigates to the next page in
history.

### `{inputMapper.base}.tabBackward`

Changes the focus from the currently focused element to the previous tabbable element using gamepad buttons and
triggers. The previous tabbable element is the element before the currently focused element in the array stored as
`tabbableElements` member variable.

### `{inputMapper.base}.tabForward`

Changes the focus from the currently focused element to the next tabbable element using gamepad buttons and triggers.
The next tabbable element is the element next to the currently focused element in the array stored as `tabbableElements`
member variable.

### `{inputMapper.base}.thumbstickTabbing`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `invert {Boolean}` Whether the thumbstick tab navigation should be in opposite order (see below).

Changes the focus from the currently focused element to the previous or next tabbable element using gamepad thumbsticks.
Works only in **continuous** mode. Calls the [`{inputMapper.base}.reverseTab`](#inputmapperbasereversetab) and
[`{inputMapper.base}.forwardTab`](#inputmapperbaseforwardtab) invokers according to the direction the thumbstick is
pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick shifts the focus to
previous DOM element. Pressing the thumbstick in opposite direction shifts the focus to the next DOM element.

### `{inputMapper.base}.scrollLeft`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.

Scrolls the web page left. Vibrates the gamepad if the page is already scrolled all the way left.

### `{inputMapper.base}.scrollRight`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.

Scrolls the web page right. Vibrates the gamepad if the page is already scrolled all the way right.

### `{inputMapper.base}.scrollUp`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.

Scrolls the web page upward. Vibrates the gamepad if the page is already scrolled all the way up.

### `{inputMapper.base}.scrollDown`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.

Scrolls the web page downward. Vibrates the gamepad if the page is already scrolled all the way down.

### `{inputMapper.base}.scrollHorizontally`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.
- `invert {Boolean}` Whether the horizontal scrolling should be in opposite order (see below).

Scrolls the web page left and right using gamepad thumbsticks. Calls the
[`{inputMapper.base}.scrollLeft`](#inputmapperbasescrollleft) and
[`{inputMapper.base}.scrollRight`](#inputmapperbasescrollright) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick scrolls
the web page left. Pressing the thumbstick in opposite direction scrolls the web page right.

### `{inputMapper.base}.scrollVertically`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `scrollFactor {Number}` How far to scroll each time the action is repeated.
- `invert {Boolean}` Whether the horizontal scrolling should be in opposite order (see below).

Scrolls the web page upward and downward using gamepad thumbsticks. Calls the
[`{inputMapper.base}.scrollUp`](#inputmapperbasescrollup) and
[`{inputMapper.base}.scrollDown`](#inputmapperbasescrolldown) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick scrolls
the web page upward. Pressing the thumbstick in opposite direction scrolls the web page downward.

### `{inputMapper.base}.sendKey`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.
- `key {String}` The key ("Escape", "ArrowLeft", et cetera) to send.

Sends a key to the focused element.

### `{inputMapper.base}.thumbstickHorizontalArrows`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Send left or right arrow keys depending on which way the thumb stick is depressed.

### `{inputMapper.base}.thumbstickVerticalArrows`

This action supports the following options:

- `repeatRate {Number}` How often (in seconds) to repeat the action while the input is held down.

Send up or down arrow keys depending on which way the thumb stick is depressed.
