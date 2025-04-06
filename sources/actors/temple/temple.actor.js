import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './temple.actions.js';
import * as STATES from './temple.states.js';
import asepriteTemple from './spritesheets/temple.aseprite';
import soundActivate from './sounds/activate.rpp';
import { getOrientation } from 'states/orientation.state.js';

/**
 * @extends {Actor<(ACTIONS.START), (STATES.ACTIVATED | STATES.DEACTIVATED | STATES.ENTERED | STATES.LEFT | STATES.STARTED)>}
 */
class ActorTemple extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteTemple),
    FACTORIES.PreloadableSound(soundActivate)
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
     * Triggers the 'start' action.
     * @private
     */
    $actionStart() {

        this.$trigger(STATES.STARTED);
    }

    /**
     * @type {Actor['onCollideEnter']}
     */
    onCollideEnter() {

        this.$trigger(STATES.ENTERED);
    }

    /**
     * @type {Actor['onCollideLeave']}
     */
    onCollideLeave() {

        this.$trigger(STATES.LEFT);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$setListener(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteTemple));

        switch (getOrientation()) {

            case 'EAST': this.$spritesheet.animate('east'); break;
            case 'NORTH': this.$spritesheet.animate('north'); break;
            case 'SOUTH': this.$spritesheet.animate('south'); break;
            case 'WEST': this.$spritesheet.animate('west'); break;
        }

        this.setCollider(new Collider({

            $boundaries: new AABB(

                new Vector2(-8, -8),
                new Vector2(8, 8)
            ),
            $traversable: true,
            $type: COLLIDERTYPES.STATIC
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

export default ActorTemple;
