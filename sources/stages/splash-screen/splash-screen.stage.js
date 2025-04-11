import {FACTORIES, Stage} from '@theatrejs/theatrejs';

import {getColor} from 'states/color.state.js';
import {getResolution} from 'states/resolution.state.js';

import ControllerSplashScreen from './splash-screen.controller.js';

class StageSplashScreen extends FACTORIES.StageWithPreloadables([

    ControllerSplashScreen
]) {

    /**
     * @type {Stage['onCreate']}
     */
    onCreate() {

        this.engine.setColor(getColor());
        this.engine.setResolution(getResolution());

        this.createActor(ControllerSplashScreen);
    }
}

export default StageSplashScreen;
