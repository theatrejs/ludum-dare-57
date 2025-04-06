import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './hole.actions.js';
import * as STATES from './hole.states.js';
import asepriteHole from './spritesheets/hole.aseprite';
import soundActivate from './sounds/activate.rpp';

/**
 * @extends {Actor<(ACTIONS.START), (STATES.ACTIVATED | STATES.DEACTIVATED | STATES.ENTERED | STATES.LEFT | STATES.STARTED)>}
 */
class ActorHole extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteHole),
    FACTORIES.PreloadableSound(soundActivate)
]) {

    /**
     * @typedef {('activated' | 'idle')} TypeTagAseprite An Aseprite tags.
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

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteHole));
        this.$spritesheet.animate('idle');

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

export default ActorHole;
