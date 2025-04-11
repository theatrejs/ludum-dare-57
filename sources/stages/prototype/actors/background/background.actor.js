import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './background.actions.js';
import asepriteBackground from './spritesheets/background/background.aseprite';

/**
 * @extends {Actor<(ACTIONS.ROTATE_EAST | ACTIONS.ROTATE_NORTH | ACTIONS.ROTATE_SOUTH | ACTIONS.ROTATE_WEST), undefined>}
 */
class ActorBackground extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteBackground)
]) {

    /**
     * @typedef {('east' | 'north' | 'south' | 'west')} TypeTagAseprite An Aseprite tags.
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeTagAseprite>}
     * @private
     */
    $spritesheet;

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

        this.$setListener(ACTIONS.ROTATE_EAST, this.$actionRotateEast.bind(this));
        this.$setListener(ACTIONS.ROTATE_NORTH, this.$actionRotateNorth.bind(this));
        this.$setListener(ACTIONS.ROTATE_SOUTH, this.$actionRotateSouth.bind(this));
        this.$setListener(ACTIONS.ROTATE_WEST, this.$actionRotateWest.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteBackground));

        this.$actionRotateSouth();
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

export default ActorBackground;
