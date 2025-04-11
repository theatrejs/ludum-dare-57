import {State} from '@theatrejs/theatrejs';

/**
 * @typedef {('EAST' | 'NORTH' | 'SOUTH' | 'WEST')} TypeOrientation The representation of a level orientation.
 */

/**
 * The state manager of the level orientation.
 * @type {State<TypeOrientation>}
 * @constant
 */
const stateOrientation = new State(/** @type {TypeOrientation} **/('SOUTH'));

/**
 * Gets the level.
 * @returns {TypeOrientation}
 */
function getOrientation() {

    return stateOrientation.getState();
}

/**
 * Sets the counter-clockwise orientation of the level.
 */
function setOrientationCounterClockwise() {

    switch (stateOrientation.getState()) {

        case 'NORTH': {

            stateOrientation.setState('WEST');

            return;
        }

        case 'WEST': {

            stateOrientation.setState('SOUTH');

            return;
        }

        case 'SOUTH': {

            stateOrientation.setState('EAST');

            return;
        }

        case 'EAST': {

            stateOrientation.setState('NORTH');

            return;
        }
    }
}

/**
 * Sets the clockwise orientation of the level.
 */
function setOrientationClockwise() {

    switch (stateOrientation.getState()) {

        case 'NORTH': {

            stateOrientation.setState('EAST');

            return;
        }

        case 'EAST': {

            stateOrientation.setState('SOUTH');

            return;
        }

        case 'SOUTH': {

            stateOrientation.setState('WEST');

            return;
        }

        case 'WEST': {

            stateOrientation.setState('NORTH');

            return;
        }
    }
}

export {

    stateOrientation,

    getOrientation,
    setOrientationCounterClockwise,
    setOrientationClockwise
};
