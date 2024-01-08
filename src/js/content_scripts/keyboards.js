/*
Copyright (c) 2023 The Gamepad Navigator Authors
See the AUTHORS.md file at the top-level directory of this distribution and at
https://github.com/fluid-lab/gamepad-navigator/raw/main/AUTHORS.md.

Licensed under the BSD 3-Clause License. You may not use this file except in
compliance with this License.

You may obtain a copy of the BSD 3-Clause License at
https://github.com/fluid-lab/gamepad-navigator/blob/main/LICENSE
*/
/* globals osk */
(function (fluid) {
    "use strict";

    var gamepad = fluid.registerNamespace("gamepad");

    fluid.defaults("gamepad.osk.keyboard.text", {
        gradeNames: ["osk.keyboard"],
        rowDefs: [
            [osk.keydefsByCode.Backquote, osk.keydefsByCode.Digit1, osk.keydefsByCode.Digit2, osk.keydefsByCode.Digit3, osk.keydefsByCode.Digit4, osk.keydefsByCode.Digit5, osk.keydefsByCode.Digit6, osk.keydefsByCode.Digit7, osk.keydefsByCode.Digit8, osk.keydefsByCode.Digit9, osk.keydefsByCode.Digit0, osk.keydefsByCode.Minus, osk.keydefsByCode.Equal, osk.keydefsByCode.Backspace],
            [osk.keydefsByCode.KeyQ, osk.keydefsByCode.KeyW, osk.keydefsByCode.KeyE, osk.keydefsByCode.KeyR, osk.keydefsByCode.KeyT, osk.keydefsByCode.KeyY, osk.keydefsByCode.KeyU, osk.keydefsByCode.KeyI, osk.keydefsByCode.KeyO, osk.keydefsByCode.KeyP, osk.keydefsByCode.BracketLeft, osk.keydefsByCode.BracketRight, osk.keydefsByCode.Slash, osk.keydefsByCode.ArrowLeft, osk.keydefsByCode.ArrowRight],
            [osk.keydefsByCode.KeyA, osk.keydefsByCode.KeyS, osk.keydefsByCode.KeyD, osk.keydefsByCode.KeyF, osk.keydefsByCode.KeyG, osk.keydefsByCode.KeyH, osk.keydefsByCode.KeyJ, osk.keydefsByCode.KeyK,  osk.keydefsByCode.KeyL, osk.keydefsByCode.Semicolon, osk.keydefsByCode.Quote, osk.keydefsByCode.Enter],
            [osk.keydefsByCode.KeyZ, osk.keydefsByCode.KeyX, osk.keydefsByCode.KeyC, osk.keydefsByCode.KeyV, osk.keydefsByCode.KeyB, osk.keydefsByCode.KeyN, osk.keydefsByCode.KeyM, osk.keydefsByCode.Comma, osk.keydefsByCode.Period, osk.keydefsByCode.ShiftRight, osk.keydefsByCode.CapsLock ],
            [osk.keydefsByCode.Space]
        ]
    });


    fluid.registerNamespace("gamepad.osk.keyboard.numpad");

    // Key definitions for the number pad that don't use the shift key or labels.
    gamepad.osk.keyboard.numpad.keydefs = {
        Backspace: { code: "Backspace", label: "Back", gradeNames: ["osk.key.noShiftLabel"], action: "backspace"},
        Comma: { code: "Comma", label: ",", gradeNames: ["osk.key.noShiftLabel"] },
        Digit0: { code: "Digit0", label: "0", gradeNames: ["osk.key.noShiftLabel"] },
        Digit1: { code: "Digit1", label: "1", gradeNames: ["osk.key.noShiftLabel"] },
        Digit2: { code: "Digit2", label: "2", gradeNames: ["osk.key.noShiftLabel"] },
        Digit3: { code: "Digit3", label: "3", gradeNames: ["osk.key.noShiftLabel"] },
        Digit4: { code: "Digit4", label: "4", gradeNames: ["osk.key.noShiftLabel"] },
        Digit5: { code: "Digit5",  label: "5", gradeNames: ["osk.key.noShiftLabel"] },
        Digit6: { code: "Digit6", label: "6", gradeNames: ["osk.key.noShiftLabel"] },
        Digit7: { code: "Digit7", label: "7", gradeNames: ["osk.key.noShiftLabel"] },
        Digit8: { code: "Digit8", label: "8", gradeNames: ["osk.key.noShiftLabel"] },
        Digit9: { code: "Digit9", label: "9", gradeNames: ["osk.key.noShiftLabel"] },
        Period: { code: "Period", label: ".", gradeNames: ["osk.key.noShiftLabel"]}

    };

    fluid.defaults("gamepad.osk.keyboard.numpad", {
        gradeNames: ["osk.keyboard"],
        rowDefs: [
            [osk.keydefsByCode.ArrowLeft, osk.keydefsByCode.ArrowRight, gamepad.osk.keyboard.numpad.keydefs.Backspace ],
            [gamepad.osk.keyboard.numpad.keydefs.Digit1, gamepad.osk.keyboard.numpad.keydefs.Digit2, gamepad.osk.keyboard.numpad.keydefs.Digit3 ],
            [gamepad.osk.keyboard.numpad.keydefs.Digit4, gamepad.osk.keyboard.numpad.keydefs.Digit5, gamepad.osk.keyboard.numpad.keydefs.Digit6 ],
            [gamepad.osk.keyboard.numpad.keydefs.Digit7, gamepad.osk.keyboard.numpad.keydefs.Digit8, gamepad.osk.keyboard.numpad.keydefs.Digit9 ],
            [gamepad.osk.keyboard.numpad.keydefs.Comma, gamepad.osk.keyboard.numpad.keydefs.Digit0, gamepad.osk.keyboard.numpad.keydefs.Period ]
        ]
    });

})(fluid);
