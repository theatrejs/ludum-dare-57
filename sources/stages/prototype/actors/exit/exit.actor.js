import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as STATES from './exit.states.js';
import asepriteExit from './spritesheets/exit/exit.aseprite';
import soundPortal from './sounds/portal/portal.rpp';

/**
 * @extends {Actor<undefined, (STATES.ENTERED)>}
 */
class ActorExit extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteExit),
    FACTORIES.PreloadableSound(soundPortal)
]) {

    /**
     * @typedef {('idle')} TypeTagAseprite An Aseprite tags.
     */

    /**
     * Stores the spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeTagAseprite>}
     * @private
     */
    $spritesheet;

    /**
     * @type {Actor['onCollideEnter']}
     */
    onCollideEnter() {

        this.$trigger(STATES.ENTERED);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteExit));
        this.$spritesheet.animate('idle');

        this.setCollider(new Collider({

            $boundaries: new AABB(

                new Vector2(-8, -8),
                new Vector2(8, 8)
            ),
            $traversable: true,
            $type: COLLIDERTYPES.STATIC
        }));

        this.addSound(new Sound({

            $audio: soundPortal,
            $loop: true
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

export default ActorExit;
