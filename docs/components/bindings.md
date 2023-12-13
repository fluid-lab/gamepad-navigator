# Bindings

Bindings are a hash that associates an input (such as a button or thumb stick) with an [action](actions.md). Here is a
simple example:

```json
{
    "bindings": {
        "buttons": {
            "0": {
                "action": "click"
            }
        }
    }
}
```

This binds button 0 (on any controller) to the "click" action (see [the input mapper base grade](inputMapper.base.md)
for details). A more complex example might include [action options](actions.md), as shown here:

```json
{
    "bindings": {
        "axes": {
            "0": {
                "action": "scrollHorizontally",
                "scrollFactor": 10,
                "repeateRate": 0.1
            }
        }
    }
}
```

This binds the first axis (on any controller) to the `scrollHorizontally` action (see
[the input mapper base grade](inputMapper.base.md) for details). The additional action options specify how far we
should scroll each time the action is executed, and how often the action should repeat while the axis is still held
down.
