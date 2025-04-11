import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getResolution} from 'states/resolution.state.js';

import ControllerCredits from './credits.controller.js';

class StageCredits extends FACTORIES.StageWithPreloadables([

    ControllerCredits
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setResolution(getResolution());

        this.createActor(ControllerCredits);
    }
}

export default StageCredits;
