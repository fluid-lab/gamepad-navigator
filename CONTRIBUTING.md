<!--
Copyright (c) 2020 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/master/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/master/LICENSE
-->

# Contributing to the Gamepad Navigator

Thank you for your interest in contributing to this project. As the core values and principles of this project align
with the [Fluid Project](https://wiki.fluidproject.org/pages/viewpage.action?pageId=3900010), a first good step would
be to get acquainted with the Fluid Community (see [Get Involved](https://tinyurl.com/yxgwccdr)), and understanding how
[Infusion](http://docs.fluidproject.org/infusion/) works. The next step should be reviewing the project's
[documentation](docs) and looking into the [source code](src).

## Code of Conduct

The Fluid Community strives to create new community supports, open governance and recognition systems, and
collaboration techniques that help make our community more open and welcoming. The Gamepad Navigator and everyone
participating in it is governed by the [Fluid Community's Code of Conduct](https://tinyurl.com/y5q4c6qy). By
participating, you are expected to uphold this code. Please report unacceptable behavior on the ["#fluid-work" IRC
channel](https://tinyurl.com/y53ue7d8) or the [fluid-work mailing list](https://tinyurl.com/y4tpf9ty).

## Process/Workflow

The Gamepad Navigator's [source code](src) is hosted on GitHub. All of the code included in a
[release](https://github.com/fluid-lab/gamepad-navigator/releases) lives in the `master` branch.

The Gamepad Navigator uses a workflow where individual contributors fork the project repository, work in a branch
created off of `master`, and submit a pull request against the project repository's `master` branch to merge their
contributions. See the
[Coding and Commit Standards](https://wiki.fluidproject.org/display/fluid/Coding+and+Commit+Standards) for more clarity
on the quality and standards of submitted contributions.

### Open an Issue on GitHub

The Gamepad Navigator uses [GitHub issues](https://github.com/fluid-lab/gamepad-navigator/issues) to track issues. The
branch containing your contribution should be named after the GitHub issue number you're working on. For example,
branch "GH-28" for issue #28.

GitHub issues should be meaningful and describe the task, bug, or feature in a way that can be understood by the
community. Opaque or general descriptions should be avoided. If you have a large task that will involve several
substantial commits, consider breaking it up into subtasks and mention them in the ticket's description. That way, you
can create multiple pull requests that are easier to review. For example, break issue #28 into two subtasks and make
a branch for each subtask, such as "GH-28-1" and "GH-28-2".

<!-- TODO: Add an issue and pull request template on GitHub -->
Go through the following steps to open a new issue/ticket:

1. Search through the existing tickets to see if a similar ticket is already filed. If you find a ticket that seems to
   match yours, add a comment to the same ticket describing any additional information you have (different context or
   environment, speculated cause, possible solution, or any other feedback). Otherwise, create a new ticket.
2. Provide as much relevant detail in the ticket description. If the ticket is a bug report, it should include the
   following:
   - What is happening? What would you expect to happen instead?
   - Instructions for reproducing the problem.
   - Additional details about your environment (operating system, gamepad device details, supported browser version -
     Chrome, Edge, Opera, and other Chromium-based browsers).
3. In addition, please provide any additional information that might help someone working on the ticket (see below).
   - Console logs or error messages.
   - Suspected technical cause of the problem.
   - Suggestions for resolving that bug.

### Add Unit Tests

Production-level code needs to be accompanied by a reasonable suite of unit tests. This helps others confirm that the
code is working as intended, and allows the community to adopt more agile refactoring techniques while being more
confident in our ability to avoid regressions. All unit tests should be written using jqUnit (check the
[jqUnit documentation](https://docs.fluidproject.org/infusion/development/jqUnit.html) for more information).

### Lint Your Code

JavaScript is a highly dynamic and loose language, and many common errors are not picked up until runtime. To avoid
errors and common pitfalls in the language, and to maintain consistency in terms of syntax, lint your code regularly
using the provided Grunt lint task (see below). Ensure that you run lint checks on your code before making a commit.

``` snippet
# Runs linting tasks
npm run lint
```

### Create Meaningful Commit Logs

All commit log messages should include the following information:

1. A reference to the GitHub issue this commit applies to (at the beginning of the first line).
2. A short and meaningful summary of the commit, on the first line.
3. A meaningful commit log describing the contents of the change. Also, mention if the pull request is meant to close a
   ticket at the beginning. For example, "Resolves #18", "Fixes #28", et cetera.

Sometimes, a commit may be trivial or entirely cosmetic (code reformatting, fixing typos in comments, et cetera).
In those cases, it is acceptable to use the "NOGH:" prefix for your log. However, you must still provide a meaningful
summary and a descriptive commit message.

``` snippet
GH-29: Added bar method to inputMapper

Resolves #29
Refactored the inputMapper to include a new bar algorithm based on the latest changes in the Chrome API.
(https://linkToAPI)
```

### Submit a Pull Request

Once you've added tests with your code and "confirmed that the lint checks are passing, you can submit a Pull Request
(PR) to the repository's `master` branch. After the PR has been submitted, ping one or more maintainers on the
"#fluid-work" IRC channel, fluid-work mailing list, or the PR itself. They will review the contribution, which
typically results in a back and forth conversation and modifications to the PR. Merging into the project repo is a
manual process and requires at least one maintainer to merge it into the project repo.
