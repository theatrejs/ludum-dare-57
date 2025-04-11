import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './hero.actions.js';
import asepriteHero from './spritesheets/hero/hero.aseprite';
import soundBreathe from './sounds/breathe/breathe.rpp';
import soundRoll from './sounds/roll/roll.rpp';

/**
 * @extends {Actor<(ACTIONS.FLY | ACTIONS.ROLL | ACTIONS.ROTATE_EAST | ACTIONS.ROTATE_NORTH | ACTIONS.ROTATE_SOUTH | ACTIONS.ROTATE_WEST), undefined>}
 */
class ActorHero extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteHero),
    FACTORIES.PreloadableSound(soundBreathe),
    FACTORIES.PreloadableSound(soundRoll)
]) {

    /**
     * @typedef {('east' | 'fly' | 'north' | 'south' | 'west')} TypeTagAseprite An Aseprite tags.
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeTagAseprite>}
     * @private
     */
    $spritesheet;

    /**
     * Triggers the 'fly' action.
     * @private
     */
    $actionFly() {

        this.$spritesheet.animate('fly', false);

        this.addSound(new Sound({

            $audio: soundBreathe
        }));
    }

    /**
     * Triggers the 'roll' action.
     * @private
     */
    $actionRoll() {

        this.addSound(new Sound({

            $audio: soundRoll
        }));
    }

    /**
     * Triggers the 'rotate east' action.
     * @private
     */
    $actionRotateEast() {

        this.$spritesheet.animate('east');
    }

    /**
     * Triggers the 'rotate north' action.
     * @private
     */
    $actionRotateNorth() {

        this.$spritesheet.animate('north');
    }

    /**
     * Triggers the 'rotate south' action.
     * @private
     */
    $actionRotateSouth() {

        this.$spritesheet.animate('south');
    }

    /**
     * Triggers the 'rotate west' action.
     * @private
     */
    $actionRotateWest() {

        this.$spritesheet.animate('west');
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$setListener(ACTIONS.FLY, this.$actionFly.bind(this));
        this.$setListener(ACTIONS.ROLL, this.$actionRoll.bind(this));
        this.$setListener(ACTIONS.ROTATE_EAST, this.$actionRotateEast.bind(this));
        this.$setListener(ACTIONS.ROTATE_NORTH, this.$actionRotateNorth.bind(this));
        this.$setListener(ACTIONS.ROTATE_SOUTH, this.$actionRotateSouth.bind(this));
        this.$setListener(ACTIONS.ROTATE_WEST, this.$actionRotateWest.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteHero));

        this.$actionRotateSouth();

        this.setCollider(new Collider({

            $boundaries: new AABB(

                new Vector2(-8, -8),
                new Vector2(8, 8)
            ),
            $traversable: true,
            $type: COLLIDERTYPES.DYNAMIC
        }));
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
}

export default ActorHero;
