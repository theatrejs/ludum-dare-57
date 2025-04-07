import {AABB, Actor, Collider, COLLIDERTYPES, FACTORIES, Sound, Vector2} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import * as ACTIONS from './exit.actions.js';
import * as STATES from './exit.states.js';
import asepriteExit from './spritesheets/exit.aseprite';
import soundActivate from './sounds/portal.rpp';

import StagePrototype from 'stages/prototype/prototype.stage.js';
import StageCredits from 'stages/credits/credits.stage.js';
import { getNextLevel, stateLevelCurrent } from 'states/levels.state.js';

/**
 * @extends {Actor<(ACTIONS.ACTIVATE | ACTIONS.DEACTIVATE | ACTIONS.START), (STATES.ACTIVATED | STATES.DEACTIVATED | STATES.ENTERED | STATES.LEFT | STATES.STARTED)>}
 */
class ActorExit extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteExit),
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

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteExit));
        this.$spritesheet.animate('idle');

        this.setCollider(new Collider({

            $boundaries: new AABB(

                new Vector2(-0.5, -0.5),
                new Vector2(0.5, 0.5)
            ),
            $traversable: true,
            $type: COLLIDERTYPES.STATIC
        }));

        this.addSound(new Sound({

            $audio: soundActivate,
            $loop: true
        }));

        this.setZIndex(1);
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
