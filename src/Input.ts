import { Keys, Gamepads, GamepadButton, Vec2 } from 'miglib';

const PAD = 0;
const DEADZONE = 0.2;

export class Input {

    static car() {
        return (
            Keys.justPressed(Keys.KEY_C) ||
            Gamepads.wasButtonPressed(PAD, GamepadButton.Y)
        );
    }

    static move(): Vec2 {
        let x = 0;
        let y = 0;

        if (Keys.isDown(Keys.KEY_A)) x -= 1;
        if (Keys.isDown(Keys.KEY_D)) x += 1;
        if (Keys.isDown(Keys.KEY_W)) y -= 1;
        if (Keys.isDown(Keys.KEY_S)) y += 1;

        if (Gamepads.isButtonDown(PAD, GamepadButton.DPAD_LEFT)) x -= 1;
        if (Gamepads.isButtonDown(PAD, GamepadButton.DPAD_RIGHT)) x += 1;
        if (Gamepads.isButtonDown(PAD, GamepadButton.DPAD_UP)) y -= 1;
        if (Gamepads.isButtonDown(PAD, GamepadButton.DPAD_DOWN)) y += 1;

        const stick = Gamepads.getLeftStick(PAD);
        if (stick.length() > DEADZONE) {
            x += stick.x;
            y += stick.y;
        }

        const dir = new Vec2(x, y);
        const len = dir.length();
        if (len < 0.0001) return new Vec2(0, 0);
        return len > 1 ? dir.normalize() : dir;
    }

    static interactPressed(): boolean {
        return (
            Keys.justPressed(Keys.KEY_E) ||
            Gamepads.wasButtonPressed(PAD, GamepadButton.A)
        );
    }

    static menuPressed(): boolean {
        return (
            Keys.justPressed(Keys.KEY_Q) ||
            Gamepads.wasButtonPressed(PAD, GamepadButton.B)
        );
    }
}
