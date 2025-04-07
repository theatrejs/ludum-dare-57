import {FACTORIES, Stage, Vector2, Vector3} from '@theatrejs/theatrejs';

import ControllerPrototype from './prototype.controller.js';

class StagePrototype extends FACTORIES.StageWithPreloadables([

    ControllerPrototype
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(new Vector3(6 / 255, 6 / 255, 8 / 255));
        this.engine.setResolution(new Vector2(320, 240));

        this.createActor(ControllerPrototype);
    }
}

export default StagePrototype;
