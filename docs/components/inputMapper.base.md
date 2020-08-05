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
[`configMaps`](configMaps.md) grade provides a configuration map for the gamepad inputs. The navigation features
available with this component are limited to the **intra-web page navigation** features. (Use the `inputMapper`
component for **inter-web page navigation** features)

## Using this grade

For the actions to work, you need to use the `gamepad.inputMapperUtils.content` namespace unless the `gamepad` namespace
is used. Otherwise, the component will throw errors. The configuration options can be changed by either extending the
component or by passing your own options. If no options are passed, the defaults are used.

``` javascript
fluid.registerNamespace("gamepad.inputMapper.base");
fluid.registerNamespace("gamepad.inputMapperUtils.content");

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
fluid.registerNamespace("gamepad.inputMapper.base");
fluid.registerNamespace("gamepad.inputMapperUtils.content");

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

You can also pass custom configuration map (in the form of model variables) to specify the action and other associated
parameters for the gamepad inputs as an argument. For information regarding the configuration map model variables, refer
to the [Component Options](configMaps.md#component-options) section in the [`configMaps`](configMaps.md) grade document.

``` javascript
fluid.registerNamespace("gamepad.inputMapper.base");
fluid.registerNamespace("gamepad.inputMapperUtils.content");

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

### `{inputMapper.base}.produceNavigation(that, change)`

- `that {Object}` The `inputMapper.base` component.
- `change {Object}` Recipt for the change in input values.
- Returns: Nothing.

Listens for the changes in gamepad's input values stored as `inputMapper.base` component's model data and calls the
**navigation-producing invokers** according to the configuration map. The navigation-producing invoker is triggered only
if the component provides it. Each of these invokers is passed with the following arguments:

- `inputValue`: Current value of the gamepad input.
- `speedFactor`: Times by which the speed of given (continuous) action should be increased.
- `invert`: Whether direction of the given action should be in the opposite order (for thumbsticks).
- `background`: Whether a new tab or window should open in background.
- `oldInputValue`: Previous value of the gamepad input before its state is changed.
- `homepageURL`: URL that a new tab or window should load when opened.

The invokers use only those arguments required to perform the navigation it's meant for. Apart from the `inputValue` and
`oldInputValue` arguments, the remaining arguments derive their value from the configuration map.

### `{inputMapper.base}.clearIntervalRecords(records)`

- `records {Object}` The `intervalRecords` member containing a list of interval loops.
- Returns: Nothing.

Clears all the running interval loops when the gamepad is disconnected or when the instance of the `inputMapper.base`
component is destroyed.

### `{inputMapper.base}.tabindexSortFilter(elementOne, elementTwo)`

- `elementOne {Object}` The DOM element to be compared and sorted.
- `elementTwo {Object}` The DOM element to be compared and sorted.
- Returns: `Integer` An integer determining the order of two elements.

Sorts all the tabbable elements in the order of their `tabindex` value. If none of the elements have a `tabindex`
attribute then the elements are placed in the given order.

### `{inputMapper.base}.trackDOM(that)`

- `that {Object}` The `inputMapper.base` component.
- Returns: Nothing.

Listens for changes to the DOM using `MutationObserver`. When the DOM has loaded or is changed, it creates a list of
tabbable elements, sorts them using
[`{inputMapper.base}.tabindexSortFilter`](#inputmapperbasetabindexsortfilterelementone-elementtwo), and then stores them
the `tabbableElements` member variable for use during tab navigation.

### `{inputMapper.base}.stopTrackingDOM()`

- Returns: Nothing.

Stops the `MutationObserver` called by the [`{inputMapper.base}.trackDOM`](#inputmapperbasetrackdomthat) when the
instance of the `inputMapper.base` component is destroyed. It avoids listening changes to the DOM any further.

## Navigation Invokers

### `{inputMapper.base}.click(value)`

- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Performs **click** on the focused element when the gamepad `button` or `trigger` is pressed. However, the `select`
dropdown is toggled by changing its `size` attribute when clicked using the gamepad.

### `{inputMapper.base}.previousPageInHistory(that, value)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Navigates to the previous page in history when the gamepad `button` or `trigger` is pressed. It uses the
[`History API`](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The `focused
element` of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. It is used for restoring focus on the same element when the user navigates back to the same
page.

### `{inputMapper.base}.nextPageInHistory(that, value)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- Returns: Nothing.

Navigates to the next page in history when the gamepad `button` or `trigger` is pressed. It uses the
[`History API`](https://developer.mozilla.org/en-US/docs/Web/API/History_API) for the core functionality. The `focused
element` of current web page is saved using [`chrome.storage`](https://developer.chrome.com/extensions/storage) before
the operation is performed. It is used for restoring focus on the same element if the user navigates back to the same
page.

### `{inputMapper.base}.thumbstickHistoryNavigation(that, value, invert)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `invert {Boolean}` Whether the thumbstick history navigation should be in opposite order.
- Returns: Nothing.

Calls the [`{inputMapper.base}.previousPageInHistory`](#inputmapperbasepreviouspageinhistorythat-value) and
[`{inputMapper.base}.nextPageInHistory`](#inputmapperbasenextpageinhistorythat-value) invokers according to the
direction the `thumbstick` is pressed. The direction can be inverted by passing `true` as the `invert` argument.

### `{inputMapper.base}.reverseTab(that, value, direction)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `direction {String}` The direction for backward tab navigation, i.e. `reverseTab`.
- Returns: Nothing.

Changes the focus from the currently focused element to the previous tabbable element using gamepad `buttons` and
`triggers`. The previous tabbable element is the element before the currently focused element in the array stored as
`tabbableElements` member variable.

### `{inputMapper.base}.forwardTab(that, value, direction)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `direction {String}` The direction for forward tab navigation, i.e. `forwardTab`.
- Returns: Nothing.

Changes the focus from the currently focused element to the next tabbable element using gamepad `buttons` and
`triggers`. The next tabbable element is the element next to the currently focused element in the array stored as
`tabbableElements` member variable.

### `{inputMapper.base}.thumbstickTabbing(that, value, speedFactor, invert)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of tab navigation should be increased.
- `invert {Boolean}` Whether the thumbstick tab navigation should be in opposite order.
- Returns: Nothing.

Changes the focus from the currently focused element to the previous or next tabbable element using gamepad
`thumbsticks`. It calls the [`{inputMapper.base}.reverseTab`](#inputmapperbasereversetabthat-value-direction) and
[`{inputMapper.base}.forwardTab`](#inputmapperbaseforwardtabthat-value-direction) invokers according to the direction
the thumbstick is pressed and works only in **continuous** mode. The direction can be inverted by passing `true` as
the `invert` argument, and the speed of tab navigation can be changed by changing the value of `speedFactor` argument.

### `{inputMapper.base}.scrollLeft(that, value, speedFactor)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of left scrolling should be increased.
- Returns: Nothing.

Scrolls the web page in left direction using gamepad `buttons` and `triggers`. The speed of scrolling can be changed by
modifying the value of `speedFactor` argument.

### `{inputMapper.base}.scrollRight(that, value, speedFactor)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of right scrolling should be increased.
- Returns: Nothing.

Scrolls the web page in right direction using gamepad `buttons` and `triggers`. The speed of scrolling can be changed by
modifying the value of `speedFactor` argument.

### `{inputMapper.base}.scrollUp(that, value, speedFactor)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of upward scrolling should be increased.
- Returns: Nothing.

Scrolls the web page in upward direction using gamepad `buttons` and `triggers`. The speed of scrolling can be changed
by modifying the value of `speedFactor` argument.

### `{inputMapper.base}.scrollDown(that, value, speedFactor)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of downward scrolling should be increased.
- Returns: Nothing.

Scrolls the web page in downward direction using gamepad `buttons` and `triggers`. The speed of scrolling can be changed
by modifying the value of `speedFactor` argument.

### `{inputMapper.base}.scrollHorizontally(that, value, speedFactor, invert)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of horizontal scrolling should be increased.
- `invert {Boolean}` Whether the horizontal scrolling should be in opposite order.
- Returns: Nothing.

Scrolls the web page in left and right direction using gamepad `thumbsticks`. It calls the
[`{inputMapper.base}.scrollLeft`](#inputmapperbasescrollleftthat-value-speedfactor) and
[`{inputMapper.base}.scrollRight`](#inputmapperbasescrollrightthat-value-speedfactor) invokers according to the
direction the thumbstick is pressed. The speed of scrolling can be changed by modifying the value of `speedFactor`
argument, and the direction of scrolling can be inverted by passing `invert` argument as `true`.

### `{inputMapper.base}.scrollVertically(that, value, speedFactor, invert)`

- `that {Object}` The `inputMapper.base` component.
- `value {Number}` Current value of the gamepad input.
- `speedFactor {Number}` Times by which the speed of vertical scrolling should be increased.
- `invert {Boolean}` Whether the vertical scrolling should be in opposite order.
- Returns: Nothing.

Scrolls the web page in upward and downward direction using gamepad `thumbsticks`. It calls the
[`{inputMapper.base}.scrollUp`](#inputmapperbasescrollupthat-value-speedfactor) and
[`{inputMapper.base}.scrollDown`](#inputmapperbasescrolldownthat-value-speedfactor) invokers according to the direction
the thumbstick is pressed. The speed of scrolling can be changed by modifying the value of `speedFactor` argument, and
the direction of scrolling can be inverted by passing `invert` argument as `true`.
