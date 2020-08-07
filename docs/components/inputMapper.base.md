<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# `gamepad.inputMapper.base`

<!-- TODO: Add links to the inputMapper component's documentation -->

This component transforms the gamepad inputs into actions. It is derived from the combination of two grades - the
[`navigator`](navigator.md) grade, which reads and stores the gamepad inputs in the form of model data, and the
[`configMaps`](configMaps.md) grade, which provides a configuration map for the gamepad inputs. The navigation features
available with this component are limited to **intra-web page navigation** features. (Use the `inputMapper` component
for **inter-web page navigation** features)

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

The following component configuration options are supported:

| Option | Type | Default Value | Description |
| :---: | :---: | :---: | :--- |
| `cutoffValue` | `{Number}` | 0.20 | The threshold for the gamepad input value to perform an action. |
| `scrollInputMultiplier` | `{Number}` | 50 | Multiplication factor for the gamepad input value to calculate the offset from the current scroll position (in pixels). |

These options can be provided to the component in the following ways:

``` javascript
// Either pass options inside the object as an argument while creating an instance of inputMapper.base component.
var inputMapperBaseInstanceOne = gamepad.inputMapper.base({
    cutoffValue: 0.15,
    scrollInputMultiplier: 35
});

// Otherwise pass it as default options in a custom component using the inputMapper.base grade.
fluid.defaults("my.inputMapperBase.grade", {
    gradeNames: ["gamepad.inputMapper.base"],
    cutoffValue: 0.10,
    scrollInputMultiplier: 25
});
var inputMapperBaseInstanceTwo = my.inputMapperBase.grade();
```

You can also pass a custom configuration map (in the form of model variables) to specify the action and other associated
parameters for the gamepad inputs as an argument. For information regarding the configuration map model variables, refer
to the [Component Options](configMaps.md#component-options) section in the [`configMaps`](configMaps.md) grade
documentation.

``` javascript
var inputMapperBaseInstance = gamepad.inputMapper.base({
    cutoffValue: 0.35,
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

### `{inputMapper.base}.produceNavigation(change)`

- `change {Object}` Recipt for the change in input values.
- Returns: Nothing.

Listens for the changes in gamepad's input values stored as `inputMapper.base` component's model data and calls the
**navigation-producing invokers** according to the configuration map. The navigation-producing invoker is triggered only
if the component provides it. Each of these invokers accepts the following arguments:

- `inputValue`: Current value of the gamepad input.
- `speedFactor`: A scaling factor for the polling frequency, which affects the given (continuous) action's speed.
- `invert`: Whether direction of the given action should be in the opposite order (for thumbsticks).
- `background`: Whether a new tab or window should open in background.
- `oldInputValue`: Previous value of the gamepad input before its state is changed.
- `homepageURL`: URL that a new tab or window should load when opened.

The invokers use only those arguments required to perform their specific action. Apart from the `inputValue` and
`oldInputValue` arguments, the remaining arguments derive their value from the configuration map.

### `{inputMapper.base}.clearIntervalRecords()`

- Returns: Nothing.

Clears all running interval loops when the gamepad is disconnected or when the instance of the `inputMapper.base`
component is destroyed.

### `{inputMapper.base}.tabindexSortFilter(elementOne, elementTwo)`

- `elementOne {Object}` A DOM element to be compared and sorted.
- `elementTwo {Object}` Another DOM element to be compared and sorted.
- Returns: `Integer` An integer determining the order of two elements. Refer to the
  [sort method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Description)
  documentation for possible values.

Sorts all the tabbable elements in the order of their `tabindex` value. If none of the elements have a `tabindex`
attribute then the elements are placed in the order the elements appear in the DOM.

### `{inputMapper.base}.trackDOM()`

- Returns: Nothing.

Listens for changes to the DOM using `MutationObserver`. When the DOM has loaded or is changed, it creates a list of
tabbable elements, sorts them using
[`{inputMapper.base}.tabindexSortFilter`](#inputmapperbasetabindexsortfilterelementone-elementtwo), and then stores them
in the `tabbableElements` member variable for use during tab navigation.

### `{inputMapper.base}.stopTrackingDOM()`

- Returns: Nothing.

Stops the `MutationObserver` started by the [`{inputMapper.base}.trackDOM`](#inputmapperbasetrackdom) from listening to
changes to the DOM. Called by the `inputMapper.base` component when it is destroyed.

## Navigation Invokers

### `{inputMapper.base}.click(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Performs a click on the focused element when the gamepad button or trigger is pressed. However, a click on a `select`
form element is simulated by changing its size.

### `{inputMapper.base}.previousPageInHistory(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Navigates to the previous page in history when the gamepad button or trigger is pressed. Uses the
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The focused
element of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. The saved element is used to restore focus when the user navigates back to the same page.

### `{inputMapper.base}.nextPageInHistory(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Navigates to the next page in history when the gamepad button or trigger is pressed. Uses the
[History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The focused
element of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. The saved element is used to restore focus when the user navigates back to the same page.

### `{inputMapper.base}.thumbstickHistoryNavigation(value, invert)`

- `value {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick history navigation should be in opposite order (see below).
- Returns: Nothing.

Calls the [`{inputMapper.base}.previousPageInHistory`](#inputmapperbasepreviouspageinhistoryvalue) and
[`{inputMapper.base}.nextPageInHistory`](#inputmapperbasenextpageinhistoryvalue) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick
navigates to the previous page in history. Pressing the thumbstick in opposite direction navigates to the next page in
history.

### `{inputMapper.base}.reverseTab(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Changes the focus from the currently focused element to the previous tabbable element using gamepad buttons and
triggers. The previous tabbable element is the element before the currently focused element in the array stored as
`tabbableElements` member variable.

### `{inputMapper.base}.forwardTab(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Changes the focus from the currently focused element to the next tabbable element using gamepad buttons and triggers.
The next tabbable element is the element next to the currently focused element in the array stored as `tabbableElements`
member variable.

### `{inputMapper.base}.thumbstickTabbing(value, speedFactor, invert)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the tab navigation speed (see below).
- `invert {Boolean}` Whether the thumbstick tab navigation should be in opposite order (see below).
- Returns: Nothing.

Changes the focus from the currently focused element to the previous or next tabbable element using gamepad thumbsticks.
Works only in **continuous** mode. Calls the [`{inputMapper.base}.reverseTab`](#inputmapperbasereversetabvalue) and
[`{inputMapper.base}.forwardTab`](#inputmapperbaseforwardtabvalue) invokers according to the direction the thumbstick is
pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick shifts the focus to
previous DOM element. Pressing the thumbstick in opposite direction shifts the focus to the next DOM element. The
default polling frequency is 50 ms. Setting the `speedFactor` to less than 1 will slow down the tab navigation, setting
it to more than 1 will speed up the tab navigation.

### `{inputMapper.base}.scrollLeft(value, speedFactor)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- Returns: Nothing.

Scrolls the web page left using gamepad buttons and triggers. The default polling frequency is 50 ms. Setting the
`speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1 will speed up the scrolling.

### `{inputMapper.base}.scrollRight(value, speedFactor)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- Returns: Nothing.

Scrolls the web page right using gamepad buttons and triggers. The default polling frequency is 50 ms. Setting the
`speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1 will speed up the scrolling.

### `{inputMapper.base}.scrollUp(value, speedFactor)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- Returns: Nothing.

Scrolls the web page upward using gamepad buttons and triggers. The default polling frequency is 50 ms. Setting the
`speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1 will speed up the scrolling.

### `{inputMapper.base}.scrollDown(value, speedFactor)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- Returns: Nothing.

Scrolls the web page downward using gamepad buttons and triggers. The default polling frequency is 50 ms. Setting the
`speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1 will speed up the scrolling.

### `{inputMapper.base}.scrollHorizontally(value, speedFactor, invert)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- `invert {Boolean}` Whether the horizontal scrolling should be in opposite order (see below).
- Returns: Nothing.

Scrolls the web page left and right using gamepad thumbsticks. Calls the
[`{inputMapper.base}.scrollLeft`](#inputmapperbasescrollleftvalue-speedfactor) and
[`{inputMapper.base}.scrollRight`](#inputmapperbasescrollrightvalue-speedfactor) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick scrolls
the web page left. Pressing the thumbstick in opposite direction scrolls the web page right. The default polling
frequency is 50 ms. Setting the `speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1
will speed up the scrolling.

### `{inputMapper.base}.scrollVertically(value, speedFactor, invert)`

- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` A scaling factor for the polling frequency, which affects the scrolling speed (see below).
- `invert {Boolean}` Whether the vertical scrolling should be in opposite order (see below).
- Returns: Nothing.

Scrolls the web page upward and downward using gamepad thumbsticks. Calls the
[`{inputMapper.base}.scrollUp`](#inputmapperbasescrollupvalue-speedfactor) and
[`{inputMapper.base}.scrollDown`](#inputmapperbasescrolldownvalue-speedfactor) invokers according to the direction the
thumbstick is pressed. For example, left on the horizontal axis and upward on the vertical axis of a thumbstick scrolls
the web page upward. Pressing the thumbstick in opposite direction scrolls the web page downward. The default polling
frequency is 50 ms. Setting the `speedFactor` to less than 1 will slow down the scrolling, setting it to more than 1
will speed up the scrolling.
