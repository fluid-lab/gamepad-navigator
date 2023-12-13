# Actions

An "action" is a function that accepts up to three parameters:

- `actionOptions {Object}` The configurable options (such as repeat rate) for the action. See below for details
- `inputType {String}` The type of input, either "axes" or "buttons".
- `index` The input number.

Each time an action is executed, the input value is read from the model using the `inputType` and `index` values. This
ensures that actions bound to analog controls make use of the current value of the input and not the value of the input
when it first started repeating.

Actions do not return any values.

## Action Options

A ["binding"](bindings.md) for a particular input also includes any configurable options the action supports.
Currently, the following parameters are used by one or more actions:

- `repeatRate {Number}` How often (in seconds) to repeat the action.
- `background {Boolean}` Whether to open a new window/tab in the background.
- `invert {Boolean}` Whether to invert the value of a thumb stick.
- `scrollFactor {Number}` For scrolling actions, how far to scroll each time the action is executed.
- `key {String}` For the `sendKey` action, which of the supported keys to send.

### Supported Action Options, by Action

#### Actions with no additional parameters:

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `click`                       |              |             |         |                |      |
| `closeCurrentTab`             |              |             |         |                |      |
| `closeCurrentWindow`          |              |             |         |                |      |
| `maximizeWindow`              |              |             |         |                |      |
| `nextPageInHistory`           |              |             |         |                |      |
| `openActionLauncher`          |              |             |         |                |      |
| `openConfigPanel`             |              |             |         |                |      |
| `openSearchKeyboard`          |              |             |         |                |      |
| `previousPageInHistory`       |              |             |         |                |      |
| `restoreWindowSize`           |              |             |         |                |      |
| `reopenTabOrWindow`           |              |             |         |                |      |

#### Actions that only support the `background` parameter:

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ---------- | ----------- | ------- | -------------- | ---- |
| `openNewTab`                  |            | Yes         |         |                |      |
| `openNewWindow`               |            | Yes         |         |                |      |

#### Actions that only support the `repeatRate` parameter:

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `goToNextTab`                 | Yes          |             |         |                |      |
| `goToNextWindow`              | Yes          |             |         |                |      |
| `goToPreviousTab`             | Yes          |             |         |                |      |
| `goToPreviousWindow`          | Yes          |             |         |                |      |
| `tabForward`                  | Yes          |             |         |                |      |
| `tabBackward`                 | Yes          |             |         |                |      |
| `zoomIn`                      | Yes          |             |         |                |      |
| `zoomOut`                     | Yes          |             |         |                |      |

#### Actions that support `repeatRate` and `key`

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `sendKey`                     | Yes          |             |         |                | Yes  |

#### Actions that support `repeatRate` and `invert`

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `thumbstickHistoryNavigation` | Yes          |             | Yes     |                |      |
| `thumbstickHorizontalArrows`  | Yes          |             | Yes     |                |      |
| `thumbstickTabbing`           | Yes          |             | Yes     |                |      |
| `thumbstickVerticalArrows`    | Yes          |             | Yes     |                |      |
| `thumbstickWindowSize`        | Yes          |             | Yes     |                |      |
| `thumbstickZoom`              | Yes          |             | Yes     |                |      |

#### Actions that support `repeatRate` and `scrollFactor`

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `scrollDown`                  | Yes          |             |         | Yes            |      |
| `scrollLeft`                  | Yes          |             |         | Yes            |      |
| `scrollRight`                 | Yes          |             |         | Yes            |      |
| `scrollUp`                    | Yes          |             |         | Yes            |      |

#### Actions that support `repeatRate`, `invert`, and `scrollFactor`

|| Action Key                  || Repeat Rate || Background || Invert || Scroll Factor || Key ||
| ----------------------------- | ------------ | ----------- | ------- | -------------- | ---- |
| `scrollHorizontally`          | Yes          |             | Yes     | Yes            |      |
| `scrollVertically`            | Yes          |             | Yes     | Yes            |      |
