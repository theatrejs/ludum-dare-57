import {State} from '@theatrejs/theatrejs';

const zIndexes = Object.freeze({

    'background': Number.NEGATIVE_INFINITY,
    'game': 0,
    'interface': Number.POSITIVE_INFINITY
});

/**
 * The state manager of the z-index map.
 * @type {State<typeof zIndexes>}
 * @constant
 */
const stateZIndexes = new State(zIndexes);

/**
 * Gets the z-index of the 'background' actors.
 * @returns {number}
 */
function getStateZIndexBackground() {

    return stateZIndexes.getState().background;
};

/**
 * Gets the z-index of the 'game' actors.
 * @returns {number}
 */
function getStateZIndexGame() {

    return stateZIndexes.getState().game;
};

/**
 * Gets the z-index of the 'interface' actors.
 * @returns {number}
 */
function getStateZIndexInterface() {

    return stateZIndexes.getState().interface;
};

export {

    stateZIndexes,

    getStateZIndexBackground,
    getStateZIndexGame,
    getStateZIndexInterface
};
