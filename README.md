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

_**Note**: The new tabs opened using the gamepad navigator will use [Google](https://www.google.com/) as the homepage and
override the default new tab page. However, it can be configured to open any other website instead of Google._
