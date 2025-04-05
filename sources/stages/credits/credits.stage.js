import {FACTORIES, Stage, Vector2, Vector3} from '@theatrejs/theatrejs';

import ControllerCredits from './credits.controller.js';

class StageCredits extends FACTORIES.StageWithPreloadables([

    ControllerCredits
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(new Vector3(0 / 255, 0 / 255, 0 / 255));
        this.engine.setResolution(new Vector2(480, 360));

        this.createActor(ControllerCredits);
    }
}

export default StageCredits;
