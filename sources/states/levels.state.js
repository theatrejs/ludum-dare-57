import {Actor, State, Vector2} from '@theatrejs/theatrejs';
import ActorHero from 'actors/hero/hero.actor.js';
import {getOrientation} from './orientation.state.js';

/**
 * @typedef {('Underground0' | 'Underground1' | 'Underground2')} TypeNameLevel The level names.
 */

/**
 * The state manager of the levels.
 * @type {State<Array<TypeNameLevel>>}
 * @constant
 */
const stateLevels = new State([

    'Underground0',
    'Underground1',
    'Underground2',
    'Underground3',
    'Underground4',
    'Underground5',
    'Underground6',
    'Underground7',
    'Underground8',
    'Underground9',
]);

/**
 * Gets the next level.
 * @returns {TypeNameLevel | undefined}
 */
function getNextLevel() {

    const levels = stateLevels.getState();
    const current = stateLevelCurrent.getState();

    console.log(levels[levels.indexOf(current) + 1])

    return levels[levels.indexOf(current) + 1];
}

/**
 * The state manager of the levels.
 * @type {State<TypeNameLevel>}
 * @constant
 */
const stateLevelCurrent = new State(stateLevels.getState()[0]);

export {

    stateLevelCurrent,
    stateLevels,

    getNextLevel
};
