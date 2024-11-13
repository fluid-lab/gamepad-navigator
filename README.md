<!--
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
-->

# Gamepad Navigator

## What is this extension?

The Gamepad Navigator is a Chrome extension that allows a user to control Chromium-based browsers (Chrome, Edge,
Brave, et cetera) using a game controller. Any controller supported by the
[HTML5 Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) can be used with this extension.

Although it should work with any controller, it is particularly intended to be usable with solutions such as:

- The [Xbox Adaptive controller](https://www.microsoft.com/en-us/p/xbox-adaptive-controller/8nsdbhz1n3d8)
- The [Logitech Adaptive Gaming Kit](https://www.logitechg.com/en-us/products/gamepads/adaptive-gaming-kit-accessories.html),
  which provides accessible inputs for the Xbox Adaptive Controller
- The [Playstation Access Controller](https://www.playstation.com/accessories/access-controller/)
- The [Logitech Adaptive Gaming Kit for Access Controller](https://www.logitechg.com/nl-nl/products/gamepads/adaptive-gaming-kit-for-access-controller.943-001254.html)
- The [HORI Flex controller for Nintendo Switch](https://stores.horiusa.com/flex-controller-for-nintendo-switch/)
- Various modified controllers such as [one-handed controllers](https://www.evilcontrollers.com/ps4-one-handed-controller)

This extension was written in collaboration with members of the [Fluid Community](https://fluidproject.org/), an "open,
collaborative project to improve the user experience and inclusiveness of open source software". Most of this extension
is written using [Infusion](https://fluidproject.org/infusion.html), a framework created and supported by that
community.

## What can this extension do?

This extension listens for gamepad inputs, and waits until an configured input is pressed. It then launches the
associated "action". Most of these "actions" are focused around navigation, such as moving focus between clickable
onscreen elements, clicking an element, or scrolling the page up or down. See below for the full list of supported
actions.

The settings panel provided by this extension can be used to control which actions are "bound" to which inputs. By
default, the following controls are available:

| Action                                                          | Xbox             | Playstation             | Switch          |
| --------------------------------------------------------------- | ---------------- | ----------------------- | --------------- |
| Click the focused element (see below).                          | "A" Button       | "X" Button              | B Button        |
| Send 'Escape' to the focused element.                           | "B" Button       | "Circle" Button         | A Button        |
| Navigate to the previous focusable element (repeats when held). | Left Bumper      | Left Bumper             | Left Bumper     |
| Navigate to the next focusable element (repeats when held).     | Right Bumper     | Right Bumper            | Right Bumper    |
| Start a search with the onscreen keyboard.                      | Back Button      | Share Button            | Minus Button    |
| Open the "action launcher".                                     | Start Button     | Options Button          | Plus Button     |
| Open the configuration panel.                                   | Xbox Logo Button | Playstation Logo Button | Share Button    |
| Send arrow keys to the focused element (repeats when held).     | D-pad            | D-pad                   | D-pad           |
| Scroll Up and Down in the current page (repeats when held).     | Left Thumbstick  | Left Thumbstick         | Left Thumbstick |

In most cases, clicking on a focused element will open links and menus, just as a mouse click would. However, there are
a couple of special cases:

1. Clicking on a text input will open an onscreen keyboard that can be controlled using the gamepad. This will allow you
   to enter text in forms, including searches.

2. Clicking on a drop-down or multi-select list will open a dialog to help you choose an item using the gamepad.

## What can't this extension do?

This extension cannot operate on browser internal pages such as browser preferences, or the default "new page" opened
by clicking "New Window" in the "File" menu or by hitting control+n (command-n on OS X).  This extension provides a
"safe" means of opening new windows and tabs so that the extension can continue working on new windows.

This extension can only work well on pages that allow you to
[operate all the controls with a keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html). Unfortunately,
there are many pages that are not written with this in mind.

Although we aim to support anything that can be done with a keyboard, some controls have complex javascript that we're
not able to operate. Wherever possible, we [create an issue](https://github.com/fluid-lab/gamepad-navigator/issues)
to document these problems, and work to resolve as many problems as we can.

## Installation

### From The Chrome Web Store

The latest released version of the Gamepad Navigator is available for free on the
[Chrome Web Store](https://chrome.google.com/webstore/detail/gamepad-navigator/egilmijcknfacjjbchcacijkknbkgfnd).

### Manual Installation

The extension can also be installed on any Chromium-based browser using the source code (see below) as follows:

1. Clone or download this repository.

2. Install all the dependencies, using a command like `npm install`.

3. Build the unpacked chrome extension files using the command `npm run build`.

   This will generate a `dist` directory in the root of the project directory which contains the unpacked extension.

4. Navigate to the address `chrome://extensions/` in your Chromium-based browser and check the `Developer mode` in the
   top right corner.

5. Click on the `Load unpacked` button on the top left of the same window, navigate into the `dist` directory, and
   open it. This will load the extension into your Chromium-based browser.

## Demo

If you want to see it in action before you try it, there is
[a series of demonstration videos on YouTube](https://www.youtube.com/playlist?list=PLSG_Q2qCFaC2kB6kYiOAi8Zxmyy6iCn3e)
that cover how to use the gamepad navigator in detail.

## Questions?

If you have questions, check out [the wiki on GitHub](https://github.com/fluid-lab/gamepad-navigator/wiki).

## Contributing

If you are interested in contributing to this project, please see our [page for contributors](CONTRIBUTING.md).
