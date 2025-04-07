import {Actor, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './controls.actions.js';
// import asepriteControls from './spritesheets/controls.aseprite';
import fontTheatre from './fonts/theatrejs.font.aseprite';
// import soundActivate from './sounds/activate.rpp';

/**
 * @extends {Actor<(ACTIONS.IDLE | ACTIONS.SELECT), undefined>}
 */
class ActorControls extends FACTORIES.ActorWithPreloadables([

    // PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteControls),
    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(fontTheatre),
    // FACTORIES.PreloadableSound(soundActivate)
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
     * Stores the left text actor.
     * @type {Actor}
     * @private
     */
    $textLeft;

    /**
     * Stores the right text actor.
     * @type {Actor}
     * @private
     */
    $textRight;

    /**
     * Stores the top text actor.
     * @type {Actor}
     * @private
     */
    $textTop;

    /**
     * Triggers the 'idle' action.
     * @private
     */
    $actionIdle() {

        // this.$spritesheet.animate('idle');
    }

    /**
     * Triggers the 'select' action.
     * @private
     */
    $actionSelect() {

        // this.$spritesheet.animate('select');
    }

    /**
     * @type {Actor['onBeforeRemove']}
     */
    onBeforeRemove() {

        this.stage.removeActor(this.$textLeft);
        this.stage.removeActor(this.$textRight);
        this.stage.removeActor(this.$textTop);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        // this.$setListener(ACTIONS.IDLE, this.$actionIdle.bind(this));
        // this.$setListener(ACTIONS.SELECT, this.$actionSelect.bind(this));

        // this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteControls));
        // this.$spritesheet.animate('idle');

        this.$textTop = this.stage.createActor(PLUGIN_ASEPRITE.FACTORIES.ActorWithText({

            $text: 'Move: AD/QD',
            $font: fontTheatre,
            $spacingCharacters: 1,
            $align: 'center',
            $anchor: 'top'
        }))
        .translate(new Vector2(0, 96 + 16));

        this.$textLeft = this.stage.createActor(PLUGIN_ASEPRITE.FACTORIES.ActorWithText({

            $text: 'Arr. left\nLB/LT',
            $font: fontTheatre,
            $spacingCharacters: 1,
            $align: 'left',
            $anchor: 'bottom-left'
        }))
        .translate(new Vector2(- 96 - 48, - 96 - 16));

        this.$textRight = this.stage.createActor(PLUGIN_ASEPRITE.FACTORIES.ActorWithText({

            $text: 'Arr. right\nRB/RT',
            $font: fontTheatre,
            $spacingCharacters: 1,
            $align: 'right',
            $anchor: 'bottom-right'
        }))
        .translate(new Vector2(+ 96 + 48, - 96 - 16));
    }

    /**
     * @type {Actor['onSetVisible']}
     */
    onSetVisible($visible) {

        this.$textLeft.setVisible($visible);
        this.$textRight.setVisible($visible);
        this.$textTop.setVisible($visible);
    }

    /**
     * @type {Actor['onSetZIndex']}
     */
    onSetZIndex($zIndex) {

        this.$textLeft.setZIndex($zIndex);
        this.$textRight.setZIndex($zIndex);
        this.$textTop.setZIndex($zIndex);
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        // this.$spritesheet.tick($timetick);

        // if (this.sprite !== this.$spritesheet.sprite) {

        //     this.setSprite(this.$spritesheet.sprite);
        // }
    }

    /**
     * @type {Actor['onTranslate']}
     */
    onTranslate($translation) {

        this.$textLeft.translate($translation);
        this.$textRight.translate($translation);
        this.$textTop.translate($translation);
    }
}

export default ActorControls;
