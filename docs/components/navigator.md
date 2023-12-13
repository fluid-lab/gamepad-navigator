<!--
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
-->

# `gamepad.navigator`

This component listens to the `gamepadconnected` and `gamepaddisconnected` events in the browser. When at least one
gamepad is connected, it reads inputs from them at a particular frequency and stores those input values in the
component's model data. The component stops reading these inputs when the last gamepad is disconnected.

## Using this grade

You can change the configuration options by either extending the component or by passing your own options. If no
options are passed, the defaults are used.

``` javascript
// Either create an instance of the navigator.
var navigatorInstanceOne = gamepad.navigator();

// Otherwise create a custom component using the navigator grade.
fluid.defaults("my.navigator.grade", {
    gradeNames: ["gamepad.navigator"]
});
var navigatorInstanceTwo = my.navigator.grade();
```

## Component Options

The following component configuration options are supported:

| Option | Type | Default Value | Description |
| :---: | :---: | :---: | :--- |
| `windowObject` | `{Object}` | `window` | The global window object from which the navigator derives various methods to read gamepad inputs and attach listeners to it for various gamepad events. |
| `frequency` | `{Integer}` | 50 | The frequency (in ms) at which the navigator will read gamepad inputs. |

These options can be provided to the component in the following ways:

```javascript
// Either pass the options inside the object as an argument while creating an instance of the navigator.
var navigatorInstanceOne = gamepad.navigator({
    windowObject: myCustomWindowObject,
    frequency: 100
});

// Otherwise pass it as default options in a custom component using the navigator grade.
fluid.defaults("my.navigator.grade", {
    gradeNames: ["gamepad.navigator"],
    windowObject: myCustomWindowObject,
    frequency: 100
});
var navigatorInstanceTwo = my.navigator.grade();
```

Though the `windowObject` is a configurable option, it should have all the properties and methods that the navigator
uses. Otherwise, the navigator won't work and will throw errors. You can also use a modified `window` object, such as
the gamepad mocks used in this package's tests, and pass it into the component if you want to achieve a different
behavior. That'll be less likely to throw errors.

## Invokers

### `{navigator}.attachListener()`

- Returns: Nothing.

Attaches event listeners to the `windowObject` for the `gamepadconnected` and `gamepaddisconnected` events. When these
events are fired, the navigator fires its native `onGamepadConnected` or `onGamepadDisconnected` events, depending upon
the former event. These events have listeners attached to it, which start reading the gamepad inputs or stop reading it
further.

### `{navigator}.onConnected()`

- Returns: Nothing.

Listens for the gamepad navigator component's event `onGamepadConnected`. When it is called, it initiates the gamepad
polling invoker [`{navigator}.pollGamepads`](#navigatorpollgamepads) to be called at the same frequency as specified in
the component's configurable option `frequency`. The interval ID is stored in the component's member
`connectivityIntervalReference` for reference in other invokers and listeners present in the component.

### `{navigator}.pollGamepads()`

- Returns: Nothing.

Called periodically to read the gamepad inputs and to update the navigator component's model with those values. The
inputs are read from all the connected gamepads and then combine them to provide the co-pilot mode experience.

### `{navigator}.onDisconnected()`

- Returns: Nothing.

Listens for the gamepad navigator component's event `onGamepadDisconnected`. When it is called, it stops the polling
function interval loop and then checks whether any gamepad is still connected. If any gamepad is found connected, it
will fire the `onGamepadConnected` event so that the navigator continues to read gamepad inputs. Otherwise, the
navigator will restore the component's model to its initial state (when no gamepad was connected).

### `{navigator}.clearConnectivityInterval()`

- Returns: Nothing.

Listens for the navigator component's `onDestroy` event and will clear the polling function interval loop when called.
