import {FACTORIES, Stage, Vector2, Vector3} from '@theatrejs/theatrejs';

import ControllerPrototype from './prototype.controller.js';

class StagePrototype extends FACTORIES.StageWithPreloadables([

    ControllerPrototype
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(new Vector3(0 / 255, 0 / 255, 0 / 255));
        this.engine.setResolution(new Vector2(480, 360));

        this.createActor(ControllerPrototype);
    }
}

export default StagePrototype;
