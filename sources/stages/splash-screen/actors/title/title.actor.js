import {Actor, FACTORIES} from '@theatrejs/theatrejs';
import * as PLUGIN_ASEPRITE from '@theatrejs/plugin-aseprite';

import asepriteTitle from './spritesheets/title.aseprite';

class ActorTitle extends FACTORIES.ActorWithPreloadables([

    PLUGIN_ASEPRITE.FACTORIES.PreloadableAseprite(asepriteTitle)
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

        this.$spritesheet = new PLUGIN_ASEPRITE.Spritesheet(/** @type {PLUGIN_ASEPRITE.Aseprite<TypeTagAseprite>} **/(asepriteTitle));
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

export default ActorTitle;
