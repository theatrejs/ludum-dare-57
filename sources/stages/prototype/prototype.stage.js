import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getResolution} from 'states/resolution.state.js';

import ControllerPrototype from './prototype.controller.js';

class StagePrototype extends FACTORIES.StageWithPreloadables([

    ControllerPrototype
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setResolution(getResolution());

        this.createActor(ControllerPrototype);
    }
}

export default StagePrototype;
