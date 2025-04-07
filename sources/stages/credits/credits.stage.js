import {FACTORIES, Stage, Vector2, Vector3} from '@theatrejs/theatrejs';

import ControllerCredits from './credits.controller.js';

class StageCredits extends FACTORIES.StageWithPreloadables([

    ControllerCredits
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(new Vector3(6 / 255, 6 / 255, 8 / 255));
        this.engine.setResolution(new Vector2(320, 240));

        this.createActor(ControllerCredits);
    }
}

export default StageCredits;
