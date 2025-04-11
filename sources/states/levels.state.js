import {State} from '@theatrejs/theatrejs';

const levels = Object.freeze([

    'Stage1',
    'Stage2',
    'Stage3',
    'Stage4',
    'Stage5',
    'Stage6',
    'Stage7',
    'Stage8',
    'Stage9',
    'Stage10'
]);

/**
 * The state manager of the levels.
 * @type {State<typeof levels>}
 * @constant
 */
const stateLevels = new State(levels);

/**
 * Gets the first level.
 * @returns {string}
 */
function getFirstLevel() {

    const levels = stateLevels.getState();

    return levels[0];
}

/**
 * Gets the next level.
 * @returns {string | undefined}
 */
function getNextLevel() {

    const levels = stateLevels.getState();
    const current = stateLevelCurrent.getState();

    return levels[levels.indexOf(current) + 1];
}

/**
 * The state manager of the levels.
 * @type {State<string>}
 * @constant
 */
const stateLevelCurrent = new State(stateLevels.getState()[0]);

export {

    stateLevelCurrent,
    stateLevels,

    getFirstLevel,
    getNextLevel
};
