<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# `gamepad.configMaps`

// TODO: Add links referencing the "mix in" components' documentation.

This grade provides the configuration maps for the gamepad. It is used in the `gamepad.configurationPanel` and
`gamepad.inputMapper.base` grades that provide the actual functionality according to the configuration.

## Using this grade

This can be used by passing it to the component's `gradeNames` option.

``` javascript
fluid.defaults("my.inputMapperBase.grade", {
    gradeNames: ["gamepad.configMaps", "gamepad.navigator"]
});

var inputMapperBaseInstance = my.inputMapperBase.grade();
```

## Component Options

All the configuration options for this component are also model variables. It uses the model data to provide gamepad
configuration maps to other components. However, the grade can be extended to provide custom configuration options.

| Model Variable | Description |
| :---: | :--- |
| `model.commonConfiguration.homepageURL` | The URL of the webpage to be loaded when a new tab or window is opened using the gamepad. Its default value is `https://www.google.com/` |
| `model.map` | It provides the action configuration for each gamepad input and other associated properties. See below for more details. |

## Model Structure

The grade stores the model data in the following format:

``` snippet
model: {
    map: {
        buttons: {
            "0": {
                defaultAction: "previousPageInHistory",
                currentAction: null,
                speedFactor: 1,
                background: false
            },
            // The buttons below use same format as above but have different values for configuration options (keys).
            "1": {...},
            "2": {...},
            "3": {...},
            "4": {...},
            "5": {...},
            "6": {...},
            "7": {...},
            "8": {...},
            "9": {...},
            "10": {...},
            "11": {...},
            "12": {...},
            "13": {...},
            "14": {...},
            "15": {...},
            // The buttons below are reserved for special functionality so they cannot be configured.
            "16": null,
            "17": null
        },
        axes: {
            "0": {
                defaultAction: "scrollHorizontally",
                currentAction: null,
                speedFactor: 1,
                invert: false
            },
            // The axes below use the same format as above but have different values for configuration options (keys).
            "1": {...},
            "2": {...},
            "3": {...}
        }
    },
    // Stores all the common configuration options for the gamepad actions.
    commonConfiguration: {
        homepageURL: "https://www.google.com/"
    }
}
```

The first 16 buttons and all the axes are configurable. The configuration options used in their model data are explained
below:

| Option | Supported Input | Description |
| :---: | :---: | :--- |
| `defaultAction` | `buttons` and `axes` | The default action triggered with the particular gamepad input if the `currentAction` is not provided. |
| `currentAction` | `buttons` and `axes` | The action triggered with the particular gamepad input. It takes precedence over the `defaultAction` and is `null` by default. However, this can be specified when the component is created. |
| `speedFactor` | `buttons` and `axes` | The speed with which the given action should be executed. It is only applicable if the action is continuous and hence supports only a few actions. |
| `background` | `buttons` | Specifies whether a new tab or window should be opened in background and is applicable for those two actions only. |
| `invert` | `axes` | Supported only for actions provided to `axes` and specifies whether the direction of the action should be inverted. |

The above model options can be modified by using Infusion's
[changeApplier API](https://docs.fluidproject.org/infusion/development/ChangeApplierAPI.html) or by passing custom
options while creating an instance.

``` javascript
fluid.defaults("my.configMaps.grade", {
    gradeNames: ["gamepad.configMaps"]
});

// Pass new maps configuration as options.
var configMapsInstanceOne = my.configMaps.grade({
    model: {
        map: {
            buttons: {
                "0": {
                    currentAction: "openNewTab",
                    background: true
                },
                "1": {
                    currentAction: "forwardTab",
                    speedFactor: 2
                }
            },
            axes: {
                "0": {
                    currentAction: "scrollVertically",
                    speedFactor: 2.5,
                    invert: true
                }
            }
        },
        commonConfiguration: {
            homepageURL: "https://www.github.com/"
        }
    }
});

// Modify maps using the changeApplier API.
var configMapsInstanceTwo = my.configMaps.grade();
configMapsInstanceTwo.applier.change("commonConfiguration.homepageURL", "https://www.github.com/");
```

## Invokers

This grade doesn't provide any invokers.
