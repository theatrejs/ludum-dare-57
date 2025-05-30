import {Engine, ExtensionGamepad} from '@theatrejs/theatrejs';

import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';

ExtensionGamepad.activate();

const engine = new Engine();
engine.initiate(25);

await engine.preloadStage(StageSplashScreen);
engine.createStage(StageSplashScreen);
