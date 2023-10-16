<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# Publishing to the Chrome Web Store

1. Prepare the code and the `master` branch.
   1. Update the `version` number in the [manifest](src/manifest.json#L3) and [package](package.json#L3) files.
      1. The project follows [semantic versioning](https://semver.org/), i.e. the version is in the format
         "{MAJOR.MINOR.PATCH}[-dev]". For example, "1.0.15" and "1.1.9-dev".
         1. The `version` number in [manifest.json](src/manifest.json) file should be completely numeric. However, other
            json files (for example, [package.json](package.json)) may contain alphabets and non-numeric characters with
            the version number.  
            (See [Manifest Version](https://developer.chrome.com/extensions/manifest/version) for more details)
      2. If the release is a **dev release**, use one of the following commands.
         1. For bug fixes with no API or functionality changes, update the PATCH version: `grunt updateVersion --patch`
         2. For minor API changes and functionality updates, update the MINOR version: `grunt updateVersion --minor`
         3. For breaking API changes and new functionalities, update the MAJOR version: `grunt updateVersion --major`
      3. For a **standard release**, add the command-line flag `--standard` to the above commands.
         1. Dev release with PATCH version updates: `grunt updateVersion --patch --standard`
         2. Dev release with MINOR version updates: `grunt updateVersion --minor --standard`
         3. Dev release with MAJOR version updates: `grunt updateVersion --major --standard`
      4. For a transition from a **dev release** to a **standard release** without updating the version number, use the
         command: `grunt updateVersion --standard`
      5. Push the changes to the `master` branch.
   2. Ensure that all of the code that should be published has been merged into the `master` branch.
   3. Ensure that the code in the `master` branch is working as expected.
      1. Lint: `npm run lint`
      2. Run tests: `npm test`
      3. Manual test build.
         1. Create a build and load the generated unpacked extension into Chrome.  
            (Refer to the [Installation](../README.md#installation) section for more details)
         2. Test all of the available configuration options (Action, Speed Factor, et cetera) and ensure that they work
            on the browser correctly.
            1. Refresh any browser tabs/windows that were open before installing the extension.
            2. The actions and the associated configuration options should be tested individually and in combination to
               ensure that they are working correctly. For example, testing ***Scroll Vertically*** separately, then
               changing its ***Speed Factor***, and selecting the ***Invert Action*** option.
            3. Test the same action and the associated configuration options with at least one different button,
               thumbstick, and trigger.
            4. Multiple web pages should be tested to ensure that everything works correctly.

2. Create the release package: `grunt archive`
   1. This will generate a zip file with the name "build_{tag_name}.zip" (for example, build_v0.1.0-dev.zip), which
      will be uploaded to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions).

3. Publish to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions).
   1. Go to the Developer Dashboard on the Chrome Web Store and log in.
   2. On the Developer Dashboard, click "Edit" (located on the Gamepad Navigator's right-hand side).
   3. On the Gamepad Navigator edit page, click "Upload updated package" and upload the zip created in step 2 above.
   4. Update the "Detailed description" field as necessary. Similar information is contained in this README.
   5. Update the screenshots and videos if necessary. For example, if the images, icons, or the UI of the configuration
      panel has been changed. They will need to be the exact size requested.
   6. Click "Preview Changes".
      1. Verify that everything appears correct. Pay particular attention to anything that was changed. For example,
         version number/name, description, screenshots, et cetera.
   7. If everything appears correct, publish the changes.
      1. The actual publishing to the Chrome Web Store will take some time and may need to go through a review process.

4. Verify the published Gamepad Navigator Chrome extension.
   1. Ensure that the contents of the Gamepad Navigator on the Chrome Web Store appear correct. Double-check the
      details like version number/name, descriptions, screenshots, et cetera.
   2. Install the updated extension from the Chrome Web Store, and run through the manual testing again. (See step
      1.3.3 above)
   3. If there are any issues, fix them and repeat the process.

5. Create a GitHub release.
   1. Set up the `.gruntfile.env` file.
      1. Generate your GitHub access token.  
         (Refer to the [GitHub Docs](https://tinyurl.com/yxsbzjme) for more details)
      2. Create a copy of the `.gruntfile.env.default` file at the root level and rename the copy as `.gruntfile.env`.
      3. Open the `.gruntfile.env` file and set the value of the `GITHUB_ACCESS_TOKEN` variable as your GitHub token
         generated in the above step.
   2. Create a release on GitHub: `grunt release`
      1. This will prompt the user to enter various details (release title, tag version, description, et cetera) on
         their terminal, and will create a new release as per those details.
   3. Once the release is created successfully, announce it where required (for example, the fluid-work mailing list).
