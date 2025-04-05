import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './button.actions.js';
import * as STATES from './button.states.js';
import asepriteButton from './spritesheets/button.aseprite';
import soundActivate from './sounds/activate.rpp';

/**
 * @extends {Actor<(ACTIONS.ACTIVATE | ACTIONS.DEACTIVATE | ACTIONS.START), (STATES.ACTIVATED | STATES.DEACTIVATED | STATES.ENTERED | STATES.LEFT | STATES.STARTED)>}
 */
class ActorButton extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteButton),
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
     * Triggers the 'activate' action.
     * @private
     */
    $actionActivate() {

        this.$spritesheet.animate('activated');

        this.addSound(new Sound({

            $audio: soundActivate
        }));

        this.$trigger(STATES.ACTIVATED);
    }

    /**
     * Triggers the 'deactivate' action.
     * @private
     */
    $actionDeactivate() {

        this.$spritesheet.animate('idle');

        this.$trigger(STATES.DEACTIVATED);
    }

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

        this.$setListener(ACTIONS.ACTIVATE, this.$actionActivate.bind(this));
        this.$setListener(ACTIONS.DEACTIVATE, this.$actionDeactivate.bind(this));
        this.$setListener(ACTIONS.START, this.$actionStart.bind(this));

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteButton));
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

export default ActorButton;
