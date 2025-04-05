import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteCredits from './spritesheets/credits.aseprite';

class ActorCredits extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteCredits)
]) {

    /**
     * @typedef {('idle')} TypeTagAseprite An Aseprite tag.
     */

    /**
     * Stores the Aseprite spritesheet.
     * @type {PLUGIN_ASEPRITE.Spritesheet<TypeTagAseprite>}
     * @private
     */
    $spritesheet;

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteCredits));
        this.$spritesheet.animate('idle');
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

export default ActorCredits;
