<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# Gamepad Navigator

Gamepads are popular devices, and a lot of work has been done to extend its usefulness to a wide variety of people.
Some of the game controllers, such as the
[Xbox Adaptive controller](https://www.microsoft.com/en-us/p/xbox-adaptive-controller/8nsdbhz1n3d8?rtc=1), the
[Logitech G Adaptive Gaming Kit](https://www.logitechg.com/en-us/products/gamepads/adaptive-gaming-kit-accessories.html),
and the [one-handed controllers](https://www.evilcontrollers.com/ps4-one-handed-controller), strive to include a
broader range of people in traditional PC and console gaming.

The Gamepad Navigator is a Chrome extension that allows the users to navigate Chromium-based browsers using a game
controller and an alternative to a keyboard or mouse for browser navigation. The various buttons and analog sticks on
the gamepad will serve as inputs for the different types of navigation features or actions of the browser. These inputs
are read from the gamepads using the [HTML5 Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API)
and processed via [Infusion](https://fluidproject.org/infusion.html). The navigation features or operations can be
reconfigured from the application to redefine what each d-pad, thumbstick, button, and trigger does.

## Installation

1. Clone or download the repository.

2. Install [grunt-cli](https://gruntjs.com/) globally:

   ```bash
   npm install -g grunt-cli
   ```

3. Install all the dependencies:

   ```bash
   npm install
   ```

4. Build the unpacked chrome extension files:

   ```bash
   grunt
   ```

   This will generate a `dist` directory at the root of the project which contains the unpacked chrome extension files.

5. Navigate to the address `chrome://extensions/` in your Chromium-based browser and check the `Developer mode` in the
   top right.

6. Click on the `Load unpacked` button on the top left of the same window and navigate into the `dist` directory to
   open it. This will load the extension into your Chromium-based browser.

_**NOTE**: The new tabs opened using the gamepad navigator will use [Google](https://www.google.com/) as the homepage and
override the default new tab page. However, it can be configured to open any other website instead of Google._

## Supported Actions

The Gamepad Navigator currently supports the following actions for buttons and triggers:

| Action | Description | Invoker Documentation |
| :--- | :--- | :--- |
| **Click** | Click on the focused element. | [click](docs/components/inputMapper.base.md#inputmapperbaseclickvalue) |
| **Focus on the previous element** | Change the focus from the currently focused element to the previous tabbable element. | [reverseTab](docs/components/inputMapper.base.md#inputmapperbasereversetabvalue) |
| **Focus on the next element** | Change the focus from the currently focused element to the previous tabbable element. | [forwardTab](docs/components/inputMapper.base.md#inputmapperbaseforwardtabvalue) |
| **Scroll left** | Scroll the web page left. | [scrollLeft](docs/components/inputMapper.base.md#inputmapperbasescrollleftvalue-speedfactor) |
| **Scroll right** | Scroll the web page right. | [scrollRight](docs/components/inputMapper.base.md#inputmapperbasescrollrightvalue-speedfactor) |
| **Scroll up** | Scroll the web page up. | [scrollUp](docs/components/inputMapper.base.md#inputmapperbasescrollupvalue-speedfactor) |
| **Scroll down** | Scroll the web page down. | [scrollDown](docs/components/inputMapper.base.md#inputmapperbasescrolldownvalue-speedfactor) |
| **Zoom-in on the active web page** | Zoom in on the current tab in the active browser window. | [zoomIn](docs/components/messageListener.md#messagelistenerzoomin) |
| **Zoom-out on the active web page** | Zoom out on the current tab in the active browser window. | [zoomOut](docs/components/messageListener.md#messagelistenerzoomout) |
| **Open a new tab** | Open a new tab in the current browser window. | [openNewTab](docs/components/messageListener.md#messagelisteneropennewtabactive-homepageurl) |
| **Close current browser tab** | Close the current tab in the active browser window. | [closeCurrentTab](docs/components/messageListener.md#messagelistenerclosecurrenttabtabid) |
| **Switch to the previous browser tab** | Switch from the current tab to the previous tab in the active browser window. | [goToPreviousTab](docs/components/messageListener.md#messagelistenergotoprevioustab) |
| **Switch to the next browser tab** | Switch from the current tab to the next tab in the active browser window. | [goToNextTab](docs/components/messageListener.md#messagelistenergotonexttab) |
| **Open a new browser window** | Opens a new window. | [openNewWindow](docs/components/messageListener.md#messagelisteneropennewwindowactive-homepageurl) |
| **Close current browser window** | Close the currently active browser window. | [closeCurrentWindow](docs/components/messageListener.md#messagelistenerclosecurrentwindow) |
| **Switch to the previous browser window** | Switch from the currently active browser window to the previous browser window. | [goToPreviousWindow](docs/components/messageListener.md#messagelistenergotopreviouswindow) |
| **Switch to the next browser window** | Switch from the currently active browser window to the next browser window. | [goToNextWindow](docs/components/messageListener.md#messagelistenergotonextwindow) |
| **Back (history)** | Navigate to the previous page in history. | [previousPageInHistory](docs/components/inputMapper.base.md#inputmapperbasepreviouspageinhistoryvalue) |
| **Next (history)** | Navigate to the next page in history. | [nextPageInHistory](docs/components/inputMapper.base.md#inputmapperbasenextpageinhistoryvalue) |
| **Maximize the current browser window** | Maximize the current browser window. | [maximizeWindow](docs/components/messageListener.md#messagelistenermaximizewindowleft) |
| **Restore the size of current browser window** | Restore the size of the currently active browser window. | [restoreWindowSize](docs/components/messageListener.md#messagelistenerrestorewindowsizeleft) |
| **Reopen the last closed tab or window** | Reopen the last closed browser tab or window. | [reopenTabOrWindow](docs/components/messageListener.md#messagelistenerreopentaborwindow) |

In case of thumbsticks, the following actions are supported:

| Action | Description | Invoker Documentation |
| :--- | :--- | :--- |
| **Scroll horizontally** | Scroll the web page left and right. | [scrollHorizontally](docs/components/inputMapper.base.md#inputmapperbasescrollhorizontallyvalue-speedfactor-invert) |
| **Scroll vertically** | Scroll the web page up and down. | [scrollVertically](docs/components/inputMapper.base.md#inputmapperbasescrollverticallyvalue-speedfactor-invert) |
| **History navigation** | Navigate to the previous and the next page in history. | [thumbstickHistoryNavigation](docs/components/inputMapper.base.md#inputmapperbasethumbstickhistorynavigationvalue-invert) |
| **Focus on the previous/next element** | Change the focus from the currently focused element to the previous or next tabbable element. | [thumbstickTabbing](docs/components/inputMapper.base.md#inputmapperbasethumbsticktabbingvalue-speedfactor-invert) |
| **Zoom in or out on the active web page** | Zoom in or out on the current tab in the active browser window. | [thumbstickZoom](docs/components/inputMapper.md#inputmapperthumbstickzoomvalue-invert) |
| **Maximize/restore the size of current browser window** | Change the size of the current browser window, i.e. maximize or restore. | [thumbstickWindowSize](docs/components/inputMapper.md#inputmapperthumbstickwindowsizevalue-invert) |

## Default Controls

<p align="center">
   <img src="src/images/gamepad.svg">
   <i>
      <p align="center">
         Image Source: <a href="https://tinyurl.com/y2wvtldg">W3C Gamepad API Documentation</a>
      </p>
   </i>
</p>

Although the gamepad inputs are reconfigurable, the extension provides a default configuration for each gamepad input.
The default action for each gamepad input is as follows.  
(_Please refer to the above diagram for gamepad inputs_)

| Gamepad Input | Default Action | Speed Factor | Invert Action / Open a new tab or window in background |
| :--- | :--- | :---: | :---: |
| `Button 0` | Click | - | - |
| `Button 1` | None | - | - |
| `Button 2` | History back button | - | - |
| `Button 3` | History next button | - | - |
| `Button 4: Left Bumper` | Focus on the previous element | `2.5` | - |
| `Button 5: Right Bumper` | Focus on the next element | `2.5` | - |
| `Button 6: Left Trigger` | Scroll left | `1` | - |
| `Button 7: Right Trigger` | Scroll right | `1` | - |
| `Button 8` | Close current browser tab | - | - |
| `Button 9` | Open a new tab | - | `false` |
| `Button 10: Left Thumbstick Button` | Close current browser window | - | - |
| `Button 11: Right Thumbstick Button` | Open a new window | - | `false` |
| `Button 12: D-Pad Up Button` | Switch to the previous browser window | - | - |
| `Button 13: D-Pad Down Button` | Switch to the next browser window | - | - |
| `Button 14: D-Pad Left Button` | Switch to the previous browser tab | - | - |
| `Button 15: D-Pad Right Button` | Switch to the next browser tab | - | - |
| `Left Thumbstick Horizontal Direction` | Scroll horizontally | `1` | `false` |
| `Left Thumbstick Vertical Direction` | Scroll vertically | `1` | `false` |
| `Right Thumbstick Horizontal Direction` | History navigation | - | `false` |
| `Right Thumbstick Vertical Direction` | Focus on the previous/next element | `2.5` | `false` |

<!-- TODO: Mention the keyboard shortcut to open the configuration panel. -->

## Demo

You can check out the recorded demo to see how the navigator works.

<p align="center">
   <a href="http://www.youtube.com/watch?v=PmryYYO4qvc">
      <img src="https://i.imgur.com/JtZvOcu.png" alt="Gamepad Navigator Demo" />
   </a>
</p>

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for detailed information.

## Publishing

For the steps to publish the extension to the Chrome Web Store, please refer to the [PUBLISHING](docs/PUBLISHING.md)
doc.
