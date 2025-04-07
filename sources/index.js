import {Engine, ExtensionGamepad, ExtensionPointer} from '@theatrejs/theatrejs';

import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';
import StagePrototype from 'stages/prototype/prototype.stage.js';

ExtensionGamepad.activate();
ExtensionPointer.activate();

const engine = new Engine();
engine.initiate(25);

await engine.preloadStage(StageSplashScreen);
engine.createStage(StageSplashScreen);
