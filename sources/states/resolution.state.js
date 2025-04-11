import {State, Vector2} from '@theatrejs/theatrejs';

/**
 * The state manager of the resolution.
 * @type {State<Vector2>}
 * @constant
 */
const stateResolution = new State(new Vector2(320, 240));

/**
 * Gets the resolution.
 * @returns {Vector2}
 */
function getResolution() {

    return stateResolution.getState();
}

export {

    stateResolution,

    getResolution
};
