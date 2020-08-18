<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# `gamepad.configurationPanel`

This [`fluid.viewComponent`](https://tinyurl.com/y4u8xwpd) creates the configuration options (Action Dropdown, Speed
Factor Input Box, et cetera) for each gamepad input. This component handles which configuration options should be
displayed and what list of actions should be available for a given gamepad input. At the same time, the component also
synchronizes the value of these configuration options with the configuration used by the gamepad and lets you change the
existing gamepad configuration either by creating a new gamepad configuration or by switching to the default
configuration. The new gamepad configuration is saved by the component using the
[`chrome.storage`](https://developer.chrome.com/extensions/storage) API.

## Using this grade

The component can be used by creating its instance or by making a custom component using the grade.

``` javascript
// Either create an instance of the configurationPanel component.
var configurationPanelInstanceOne = gamepad.messageListener(".configuration-dashboard");

// Otherwise create a custom component using the configurationPanel grade.
fluid.defaults("my.configurationPanel.grade", {
    gradeNames: ["my.CustomGrade", "gamepad.configurationPanel"]
});
var configurationPanelInstanceTwo = my.configurationPanel.grade(".configuration-dashboard");
```

## Component Options

The following component configuration options are supported:

| Option | Type | Description |
| :---: | :---: | :--- |
| `description` | `{Object}` | Contains a list of gamepad inputs for use in **Input Name** dropdown of the configuration panel. The input names are stored in two separate child objects, namely `buttons` and `axes`. |
| `message` | `{Object}` | Contains the list of actions supported by the selected gamepad in two separate child objects, namely `buttons` and `axes` input. The key name should match with the name of the navigation invoker in the [`inputMapper`](inputMapper.md) component. These actions are used in the **Action** dropdown of the configuration panel. |
| `actions` | `{Object}` | Specifies whether the selected action supports `speedFactor`, `invert`, or `background` configuration options. |

These options can be provided to the component in the following ways:

``` javascript
// Either pass options inside the object as an argument while creating an instance of configurationPanel component.
var configurationPanelInstanceOne = gamepad.configurationPanel({
    description: {
        buttons: { "16": "Button 16: Badge Icon Button" },
        axes: { "0": "Left Thumbstick Horizontal Direction" }
    },
    message: {
        buttons: {
            null: "None",
            scrollLeft: "Scroll left",
            scrollRight: "Scroll right"
        },
        axes: {
            null: "None",
            thumbstickTabbing: "Focus on the previous/next element"
        }
    },
    actions: {
        speedFactorOption: ["scrollLeft", "scrollRight", "thumbstickTabbing"],
        invertOption: ["thumbstickTabbing"]
    }
});

// Otherwise pass it as default options in a custom component using the configurationPanel grade.
fluid.defaults("my.configurationPanel.grade", {
    gradeNames: ["gamepad.configurationPanel"],
    cutoffValue: 0.10,
    scrollInputMultiplier: 25
});
var configurationPanelInstanceTwo = my.configurationPanel.grade({
    description: {
        buttons: { "16": "Button 16: Badge Icon Button" },
        axes: { "0": "Left Thumbstick Horizontal Direction" }
    },
    message: {
        buttons: {
            null: "None",
            scrollLeft: "Scroll left",
            scrollRight: "Scroll right"
        },
        axes: {
            null: "None",
            thumbstickTabbing: "Focus on the previous/next element"
        }
    },
    actions: {
        speedFactorOption: ["scrollLeft", "scrollRight", "thumbstickTabbing"],
        invertOption: ["thumbstickTabbing"]
    }
});
```

## Invokers

### `{configurationPanel}.createMenu()`

- Returns: Nothing.

Creates a separate configuration menu for each gamepad input, as mentioned in the `description` option and is triggered
when the component is created. This invoker calls other invokers to create the configuration options (Action dropdown,
Speed Factor input box, et cetera) and to listen to various interaction-based events and changes to the configuration
panel.

### `{configurationPanel}.createInputActionDropdown(inputIdentifier, configMenu, inputType, currentAction)`

- `inputIdentifier {String}` A description of the gamepad input type and its index. For example, "button-0".
- `configMenu {Object}` The DOM Object used for storing the configuration options for a given gamepad input. This will
  will be modified as we are storing the "Action" dropdown inside it.
- `inputType {Boolean}` The type of the gamepad input, i.e. "buttons" or "axes".
- `currentAction {Object}` The value of the currently selected action for the given gamepad input.
- Returns: Nothing.

Creates an "Action" label and dropdown for the given gamepad input and then injects these elements into the `configMenu`
object passed as an argument. The attributes and classnames of these elements are also configured before they are
injected, and the value of the "Action" dropdown is set equal to the currently selected action.

### `{configurationPanel}.createSpeedFactorOption(inputIdentifier, configMenu, currentValue)`

- `inputIdentifier {String}` A description of the gamepad input type and its index. For example, "button-0".
- `configMenu {Object}` The DOM Object used for storing the configuration options for a given gamepad input. This will
  will be modified as we are storing the "Speed Factor" input box inside it.
- `currentValue {Object}` The current "Speed Factor" value for the given gamepad input.
- Returns: Nothing.

Creates a "Speed Factor" label and input field for the given gamepad input and then injects these elements into the
`configMenu` object passed as an argument. The attributes and classnames of these elements are also configured before
they are injected and the value of the "Speed Factor" input field is set equal to the current `speedFactor` value.

### `{configurationPanel}.createCheckbox(inputIdentifier, configMenu, isAxes, currentValue)`

- `inputIdentifier {String}` A description of the gamepad input type and its index. For example, "button-0".
- `configMenu {Object}` The DOM Object used for storing the configuration options for a given gamepad input. This will
  will be modified as we are storing the checkbox inside it.
- `isAxes {Boolean}` Whether the type of gamepad input is "axes".
- `currentValue {Object}` The current "Speed Factor" value for the given gamepad input.
- Returns: Nothing.

Creates a checkbox for the given gamepad input with the label "Open a new tab/window in background" or "Invert Action"
depending upon whether the input is "button" or "axes". The checkbox is later injected into `configMenu` object passed
as an argument after its attributes and classnames are configured.

### `{configurationPanel}.attachListeners()`

- Returns: Nothing.

Attaches **input** and **click** listeners to the configuration options and buttons on the configuration panel and is
triggered by the [createMenu](#configurationpanelcreatemenu) invoker.

### `{configurationPanel}.handleSwitching()`

- Returns: Nothing.

Listens to the changes in the "Input Name" dropdown menu and switches to the configuration menu for the selected gamepad
input.

### `{configurationPanel}.modifyActionDropdownMenu()`

- Returns: Nothing.

Displays or hides the "Speed Factor" input field and "Open a new tab/window in background" or "Invert Action" checkbox
by calling the [changeConfigMenuOptions](#configurationpanelchangeconfigmenuoptionsdropdownmenu) invoker. The
[createMenu](#configurationpanelcreatemenu) invoker triggers this method after the configuration option DOM elements are
created.

### `{configurationPanel}.listenActionDropdownChanges()`

- Returns: Nothing.

Listens to the changes in the "Action" dropdown of all the gamepad inputs' configuration menu and triggers
[changeConfigMenuOptions](#configurationpanelchangeconfigmenuoptionsdropdownmenu) as a callback.

### `{configurationPanel}.changeConfigMenuOptions(dropdownMenu)`

- `dropdownMenu {Object}` The "Action" dropdown for a gamepad input.
- Returns: Nothing.

Displays or hides the "Speed Factor" input box and "Open a new tab/window in background" or "Invert Action" checkbox
according to the value of the selected action in the corresponding "Action" dropdown.

### `{configurationPanel}.setAllToNoneListener()`

- Returns: Nothing.

Listens to the click event on "Set All to None" button and sets the value of the "Action" dropdown for all the gamepad
inputs to **None**.

### `{configurationPanel}.setToDefaultListener()`

- Returns: Nothing.

Listens to the click event on "Restore Defaults" button and sets all the gamepad input configuration options to their
default values.

### `{configurationPanel}.discardChangesListener()`

- Returns: Nothing.

Listens to the click event on "Discard Changes" button and discards the unsaved changes to all the gamepad input
configuration options.

### `{configurationPanel}.saveChangesListener()`

- Returns: Nothing.

Listens to the click event on "Save Changes" button and saves the value of all the configuration options in Chrome's
storage to be used by the [inputMapper](inputMapper.md) component.

### `{configurationPanel}.toggleSaveAndDiscardButtons()`

- Returns: Nothing.

Toggles the state of "Discard Changes" and "Save Changes" button when the value of any configuration option on the panel
is changed. The new value of the configuration options are compared to the last saved values, and if those are
unchanged, then the buttons will be disabled. Otherwise, the buttons are enabled.

### `{configurationPanel}.storeUnsavedChanges()`

- Returns: Nothing.

Stores all the unsaved changes using [`chrome.storage`](https://developer.chrome.com/extensions/storage) API when the
value of any configuration option is changed. The unsaved changes are preserved to prevent losing them when the
configuration panel is closed. These values are restored when the panel is reopened.
