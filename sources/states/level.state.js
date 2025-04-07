import {Actor, State, Vector2} from '@theatrejs/theatrejs';
import ActorHero from 'actors/hero/hero.actor.js';
import {getOrientation} from './orientation.state.js';

/**
 * @typedef {Array<Array<string>>} TypeGridLevel The representation of the grid of a level.
 */

/**
 * The state manager of the level.
 * @type {State<TypeGridLevel>}
 * @constant
 */
const stateLevel = new State([]);

/**
 * Gets the level.
 * @returns {TypeGridLevel}
 */
function getLevel() {

    return stateLevel.getState();
}

/**
 * Gets the line of actors from the east view.
 * @param {Vector2} $position The position of the 'Hero' actor.
 * @returns {Array<string>}
 */
function getLineFromEast($position) {

    return [...getLineFromWest($position)].reverse();
}

/**
 * Gets the line of actors from the north view.
 * @param {Vector2} $position The position of the 'Hero' actor.
 * @returns {Array<string>}
 */
function getLineFromNorth($position) {

    return [...getLineFromSouth($position)].reverse();
}

/**
 * Gets the line of actors from the south view.
 * @param {Vector2} $position The position of the 'Hero' actor.
 * @returns {Array<string>}
 */
function getLineFromSouth($position) {

    const level = stateLevel.getState();

    return [...level[$position.y]];
}

/**
 * Gets the line of actors from the West view.
 * @param {Vector2} $position The position of the 'Hero' actor.
 * @returns {Array<string>}
 */
function getLineFromWest($position) {

    const level = stateLevel.getState();

    return level.map(($row) => ($row[$position.x]));
}

/**
 * Gets the position of the 'Hero' actor.
 * @returns {Vector2}
 */
function getPositionHero() {

    const level = stateLevel.getState();

    for (let $row = 0, $height = level.length; $row < $height; $row += 1) {

        for (let $column = 0, $width = level[0].length; $column < $width; $column += 1) {

            if (level[$row][$column] === 'Hero') {

                return new Vector2($column, $row);
            }
        }
    }
}

/**
 * Checks if the 'Hero' actor can move to the position.
 * @param {Vector2} $position The position to check.
 * @returns {boolean}
 */
function checkMovable($position) {

    const cell = stateLevel.getState()[$position.x][$position.y];

    console.log(cell)

    if (cell === 'Hole') {

        return false;
    }

    if (cell === 'Wall') {

        return false;
    }

    return true;
}

/**
 * Checks if the 'Hero' actor can move to the left.
 * @returns {boolean}
 */
function checkMoveHeroLeftFromOrientation() {

    const orientation = getOrientation();

    switch (orientation) {

        case 'NORTH': {

            return checkMoveHeroEast();
        }

        case 'EAST': {

            return checkMoveHeroSouth();
        }

        case 'SOUTH': {

            return checkMoveHeroWest();
        }

        case 'WEST': {

            return checkMoveHeroNorth();
        }
    }
}

/**
 * Checks if the 'Hero' actor can move to the right.
 * @returns {boolean}
 */
function checkMoveHeroRightFromOrientation() {

    const orientation = getOrientation();

    switch (orientation) {

        case 'NORTH': {

            return checkMoveHeroWest();
        }

        case 'WEST': {

            return checkMoveHeroSouth();
        }

        case 'SOUTH': {

            return checkMoveHeroEast();
        }

        case 'EAST': {

            return checkMoveHeroNorth();
        }
    }
}

/**
 * Checks if the 'Hero' actor can move to the north.
 * @returns {boolean}
 */
function checkMoveHeroNorth() {

    const position = getPositionHero();

    if (position.y === 0) {

        return false;
    }

    return checkMovable(new Vector2(position.y - 1, position.x)) === true;
}

/**
 * Checks if the 'Hero' actor can move to the east.
 * @returns {boolean}
 */
function checkMoveHeroEast() {

    const position = getPositionHero();

    const level = stateLevel.getState();

    if (position.x === level[0].length - 1) {

        return false;
    }

    return checkMovable(new Vector2(position.y, position.x + 1)) === true;
}

/**
 * Checks if the 'Hero' actor can move to the south.
 * @returns {boolean}
 */
function checkMoveHeroSouth() {

    const position = getPositionHero();

    const level = stateLevel.getState();

    if (position.y === level.length - 1) {

        return false;
    }

    return checkMovable(new Vector2(position.y + 1, position.x)) === true;
}

/**
 * Checks if the 'Hero' actor can move to the west.
 * @returns {boolean}
 */
function checkMoveHeroWest() {

    const position = getPositionHero();

    if (position.x === 0) {

        return false;
    }

    return checkMovable(new Vector2(position.y, position.x - 1)) === true;
}

/**
 * Moves 'Hero' actor to the left.
 */
function moveHeroLeftFromOrientation() {

    const orientation = getOrientation();

    switch (orientation) {

        case 'NORTH': {

            return moveHeroEast();
        }

        case 'EAST': {

            return moveHeroSouth();
        }

        case 'SOUTH': {

            return moveHeroWest();
        }

        case 'WEST': {

            return moveHeroNorth();
        }
    }
}

/**
 * Moves the 'Hero' actor to the right.
 */
function moveHeroRightFromOrientation() {

    const orientation = getOrientation();

    switch (orientation) {

        case 'NORTH': {

            return moveHeroWest();
        }

        case 'WEST': {

            return moveHeroSouth();
        }

        case 'SOUTH': {

            return moveHeroEast();
        }

        case 'EAST': {

            return moveHeroNorth();
        }
    }
}

/**
 * Moves the 'Hero' actor to the north.
 */
function moveHeroNorth() {

    const position = getPositionHero();

    const level = stateLevel.getState();


    if (level[position.y - 1][position.x] === 'Exit') {

        stateLevel.setState(level);

        return;
    }

    level[position.y][position.x] = undefined;
    level[position.y - 1][position.x] = 'Hero';

    stateLevel.setState(level);
}

/**
 * Moves the 'Hero' actor to the east.
 */
function moveHeroEast() {

    const position = getPositionHero();

    const level = stateLevel.getState();


    if (level[position.y][position.x + 1] === 'Exit') {

        stateLevel.setState(level);

        return;
    }

    level[position.y][position.x] = undefined;
    level[position.y][position.x + 1] = 'Hero';

    stateLevel.setState(level);
}

/**
 * Moves the 'Hero' actor to the south.
 */
function moveHeroSouth() {

    const position = getPositionHero();

    const level = stateLevel.getState();


    if (level[position.y + 1][position.x] === 'Exit') {

        stateLevel.setState(level);

        return;
    }

    level[position.y][position.x] = undefined;
    level[position.y + 1][position.x] = 'Hero';

    stateLevel.setState(level);
}

/**
 * Moves the 'Hero' actor to the west.
 */
function moveHeroWest() {

    const position = getPositionHero();

    const level = stateLevel.getState();


    if (level[position.y][position.x - 1] === 'Exit') {

        stateLevel.setState(level);

        return;
    }

    level[position.y][position.x] = undefined;
    level[position.y][position.x - 1] = 'Hero';

    stateLevel.setState(level);
}

export {

    stateLevel,

    getLevel,
    getLineFromEast,
    getLineFromNorth,
    getLineFromSouth,
    getLineFromWest,
    getPositionHero,
    checkMovable,
    checkMoveHeroLeftFromOrientation,
    checkMoveHeroRightFromOrientation,
    moveHeroLeftFromOrientation,
    moveHeroRightFromOrientation
};
