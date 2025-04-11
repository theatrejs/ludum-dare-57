import {Actor, FACTORIES, Sound} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './press-any-key.actions.js';
import asepritePressAnyKey from './spritesheets/press-any-key/press-any-key.aseprite';
import fontTheatre from './fonts/theatrejs/theatrejs.font.aseprite';
import soundSelect from './sounds/select/select.rpp';

/**
 * @extends {Actor<(ACTIONS.IDLE | ACTIONS.SELECT), undefined>}
 */
class ActorPressAnyKey extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepritePressAnyKey),
    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(fontTheatre),
    FACTORIES.PreloadableSound(soundSelect)
]) {

    /**
     * @typedef {('idle' | 'select')} TypeTagAseprite An Aseprite tag.
     */

    /**
     * Stores the Aseprite spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeTagAseprite>}
     * @private
     */
    $spritesheet;

    /**
     * Stores the text actor.
     * @type {Actor}
     * @private
     */
    $text;

    /**
     * Triggers the 'idle' action.
     * @private
     */
    $actionIdle() {

        this.$spritesheet.animate('idle');
    }

    /**
     * Triggers the 'select' action.
     * @private
     */
    $actionSelect() {

        this.$spritesheet.animate('select');

        this.addSound(new Sound({

            $audio: soundSelect
        }));
    }

    /**
     * @type {Actor['onBeforeRemove']}
     */
    onBeforeRemove() {

        this.stage.removeActor(this.$text);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$setListener(ACTIONS.IDLE, this.$actionIdle.bind(this));
        this.$setListener(ACTIONS.SELECT, this.$actionSelect.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepritePressAnyKey));
        this.$spritesheet.animate('idle');

        this.$text = this.stage.createActor(PLUGIN_ASEPRITE.FACTORIES.ActorWithText({

            $text: 'Press Start/Enter',
            $font: fontTheatre,
            $spacingCharacters: 2
        }));
    }

    /**
     * @type {Actor['onSetVisible']}
     */
    onSetVisible($visible) {

        this.$text.setVisible($visible);
    }

    /**
     * @type {Actor['onSetZIndex']}
     */
    onSetZIndex($zIndex) {

        this.$text.setZIndex($zIndex);
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$spritesheet.tick($timetick);

        if (this.sprite !== this.$spritesheet.sprite) {

            this.setSprite(this.$spritesheet.sprite);
        }
    }

    /**
     * @type {Actor['onTranslate']}
     */
    onTranslate($translation) {

        this.$text.translate($translation);
    }
}

export default ActorPressAnyKey;
