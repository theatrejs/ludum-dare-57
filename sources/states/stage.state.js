import {Stage, State} from '@theatrejs/theatrejs';

import StagePrototype from 'stages/prototype/prototype.stage.js';

/**
 * The state manager of the stage.
 * @type {State<typeof Stage>}
 * @constant
 */
const stateStage = new State(StagePrototype);

/**
 * Gets the stage.
 * @returns {typeof Stage}
 */
function getStateStage() {

    return stateStage.getState();
};

export {

    stateStage,

    getStateStage
};
