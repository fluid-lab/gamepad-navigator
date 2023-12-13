# Preferences

There are a few user-configurable "preferences" that are persisted to local storage and read on startup:

| Key                   | Description |  Allowed Values | Default |
| --------------------- | ----------- | --------------- | ------- |
| `analogCutoff`        | An analog input such as a thumb stick or trigger must send a value above this number before the [input mapper](./inputMapper.base.md) will respond. | A number from `0` (all inputs allowed) to `1` (no input possible). | `0.25` |
| `newTabOrWindowURL`   | The URL to open when creating a new tab or window. | Any controllable URL (see below). | `https://www.google.com/` |
| `openWindowOnStartup` | If no "safe" windows (see below) are open on startup, open one automatically. | `true` or `false` | `true` |
| `pollingFrequency`    | How often (in milliseconds) to check gamepad inputs. | A number value. | `50` |
| `vibrate`             | Whether to vibrate when we cannot complete an action (for example, if we attempt to scroll down and we are already at the bottom of the page). | `true` or `false` | `true` |

## "Safe" Windows

The code that allows the gamepad navigator to respond to inputs is not injected on browser internal pages such as your
browser preferences. A new window that is created using a mouse or keyboard uses one of these "internal" pages as well.
This is why we have two of the preferences outlined above.

The `newTabOrWindowURL` preference gives us a "safe" URL to use when creating windows and tabs. The `openWindowOnSartup`
setting is designed to ensure that there will always be a "safe" window available and focused on startup.
