import {Actor, EVENT_CODES, FACTORIES, FiniteStateMachine, Sound, Vector2} from '@theatrejs/theatrejs';

import {checkMoveHeroLeftFromOrientation, checkMoveHeroRightFromOrientation, getLevelLine, getPositionHero, moveHeroLeftFromOrientation, moveHeroRightFromOrientation, stateLevel} from 'states/level.state.js';
import {getFirstLevel, getNextLevel, stateLevelCurrent} from 'states/levels.state.js';
import {getOrientation, setOrientationCounterClockwise, setOrientationClockwise, stateOrientation} from 'states/orientation.state.js';
import {getZIndexBackground, getZIndexFar, getZIndexNear, getZIndexOrigin} from 'states/z-indexes.state.js';

import StageCredits from 'stages/credits/credits.stage.js';
import StagePrototype from 'stages/prototype/prototype.stage.js';

import ActorBackground from './actors/background/background.actor.js';
import * as ACTIONS_BACKGROUND from './actors/background/background.actions.js';
import ActorExit from './actors/exit/exit.actor.js';
import * as STATES_EXIT from './actors/exit/exit.states.js';
import ActorFloor from './actors/floor/floor.actor.js';
import * as ACTIONS_FLOOR from './actors/floor/floor.actions.js';
import ActorHero from './actors/hero/hero.actor.js';
import * as ACTIONS_HERO from './actors/hero/hero.actions.js';
import ActorHole from './actors/hole/hole.actor.js';
import ActorWall from './actors/wall/wall.actor.js';
import * as ACTIONS_WALL from './actors/wall/wall.actions.js';

import soundWoosh from './sounds/woosh/woosh.rpp';
import soundAmbiant from './sounds/ambiant/ambiant.rpp';

import stages from 'stages/stages.ldtk';

/**
 * The cooldown duration.
 * @type {number}
 * @constant
 * @private
 */
const $DURATION_COOLDOWN = 200;

/**
 * The step duration.
 * @type {number}
 * @constant
 * @private
 */
const $DURATION_STEP = 200;

/**
 * The size of a grid cell.
 * @type {number}
 * @constant
 * @private
 */
const $SIZE_CELL = 32;

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorBackground,
    ActorExit,
    ActorFloor,
    ActorHero,
    ActorHole,
    ActorWall,

    FACTORIES.PreloadableSound(soundWoosh),
    FACTORIES.PreloadableSound(soundAmbiant)
]) {

    /**
     * @typedef {('CLEANING' | 'EXITING' | 'IDLE' | 'LEFT' | 'ROLLING_LEFT' | 'ROLLING_RIGHT' | 'ROTATING_CLOCKWISE' | 'ROTATING_COUNTER_CLOCKWISE')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the camera actor.
     * @type {Actor}
     * @private
     */
    $camera;

    /**
     * Stores the exiting status.
     * @type {boolean}
     * @private
     */
    $exiting;

    /**
     * Stores the hero actor.
     * @type {ActorHero}
     * @private
     */
    $hero;

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    /**
     * Stores the removable actors from the current level view.
     * @type {Array<Actor>}
     * @private
     */
    $removables;

    /**
     * Creates a 'background' actor.
     * @returns {ActorBackground}
     * @private
     */
    $createActorBackground() {

        const background = /** @type {ActorBackground} */(this.stage.createActor(ActorBackground));

        background.setZIndex(getZIndexBackground());

        if (getOrientation() === 'EAST') {

            background.trigger(ACTIONS_BACKGROUND.ROTATE_EAST);
        }

        if (getOrientation() === 'NORTH') {

            background.trigger(ACTIONS_BACKGROUND.ROTATE_NORTH);
        }

        if (getOrientation() === 'SOUTH') {

            background.trigger(ACTIONS_BACKGROUND.ROTATE_SOUTH);
        }

        if (getOrientation() === 'WEST') {

            background.trigger(ACTIONS_BACKGROUND.ROTATE_WEST);
        }

        return background;
    }

    /**
     * Creates a 'exit' actor.
     * @param {Vector2} $position The position of the 'exit' actor to create.
     * @returns {ActorExit}
     * @private
     */
    $createActorExit($position) {

        const exit = /** @type {ActorExit} */(this.stage.createActor(ActorExit));

        exit
        .translate($position)
        .setZIndex(getZIndexNear());

        return exit;
    }

    /**
     * Creates a 'floor' actor.
     * @param {Vector2} $position The position of the 'floor' actor to create.
     * @returns {ActorFloor}
     * @private
     */
    $createActorFloor($position) {

        const floor = /** @type {ActorFloor} */(this.stage.createActor(ActorFloor));

        floor
        .translate($position)
        .setZIndex(getZIndexFar());

        if (getOrientation() === 'EAST') {

            floor.trigger(ACTIONS_FLOOR.ROTATE_EAST);
        }

        if (getOrientation() === 'NORTH') {

            floor.trigger(ACTIONS_FLOOR.ROTATE_NORTH);
        }

        if (getOrientation() === 'SOUTH') {

            floor.trigger(ACTIONS_FLOOR.ROTATE_SOUTH);
        }

        if (getOrientation() === 'WEST') {

            floor.trigger(ACTIONS_FLOOR.ROTATE_WEST);
        }

        return floor;
    }

    /**
     * Creates a 'hero' actor.
     * @param {Vector2} $position The position of the 'hero' actor to create.
     * @returns {ActorHero}
     * @private
     */
    $createActorHero($position) {

        const hero = /** @type {ActorHero} */(this.stage.createActor(ActorHero));

        hero
        .translate($position)
        .setZIndex(getZIndexOrigin());

        if (getOrientation() === 'EAST') {

            hero.trigger(ACTIONS_HERO.ROTATE_EAST);
        }

        if (getOrientation() === 'NORTH') {

            hero.trigger(ACTIONS_HERO.ROTATE_NORTH);
        }

        if (getOrientation() === 'SOUTH') {

            hero.trigger(ACTIONS_HERO.ROTATE_SOUTH);
        }

        if (getOrientation() === 'WEST') {

            hero.trigger(ACTIONS_HERO.ROTATE_WEST);
        }

        return hero;
    }

    /**
     * Creates a 'hole' actor.
     * @param {Vector2} $position The position of the 'hole' actor to create.
     * @returns {ActorHole}
     * @private
     */
    $createActorHole($position) {

        const hole = /** @type {ActorHole} */(this.stage.createActor(ActorHole));

        hole
        .translate($position)
        .setZIndex(getZIndexNear());

        this.$removables.push(hole);

        return hole;
    }

    /**
     * Creates a 'wall' actor.
     * @param {Vector2} $position The position of the 'wall' actor to create.
     * @returns {ActorWall}
     * @private
     */
    $createActorWall($position) {

        const wall = /** @type {ActorWall} */(this.stage.createActor(ActorWall));

        wall
        .translate($position)
        .setZIndex(getZIndexNear());

        if (getOrientation() === 'EAST') {

            wall.trigger(ACTIONS_WALL.ROTATE_EAST);
        }

        if (getOrientation() === 'NORTH') {

            wall.trigger(ACTIONS_WALL.ROTATE_NORTH);
        }

        if (getOrientation() === 'SOUTH') {

            wall.trigger(ACTIONS_WALL.ROTATE_SOUTH);
        }

        if (getOrientation() === 'WEST') {

            wall.trigger(ACTIONS_WALL.ROTATE_WEST);
        }

        return wall;
    }

    /**
     * Creates the level.
     * @private
     */
    $createLevel() {

        this.addSound(new Sound({

            $audio: soundAmbiant,
            $loop: true
        }));

        const grid = stages.getGrid({

            $level: stateLevelCurrent.getState(),
            $layer: 'actors'
        });

        const gridData = stages.getGridData({

            $level: stateLevelCurrent.getState(),
            $layer: 'actors'
        });

        /**
         * @type {Array<Array<(string | undefined)>>}
         */
        const level = [];

        for (let $row = 0, $height = grid.$height; $row < $height; $row += 1) {

            level[$row] = [];

            for (let $column = 0, $width = grid.$width; $column < $width; $column += 1) {

                level[$row][$column] = undefined;
            }
        }

        gridData.entityInstances.forEach(($entity) => {

            level[$entity.__grid[1]][$entity.__grid[0]] = $entity.__identifier;
        });

        stateLevel.setState(level);
    }

    /**
     * Creates the level view.
     * @private
     */
    $createLevelView() {

        [...this.$removables].forEach(($actor) => {

            this.stage.removeActor($actor);
        });

        const background = this.$createActorBackground();
        this.$removables.push(background);

        getLevelLine(getPositionHero()).forEach(($actor, $index, $array) => {

            const position = new Vector2(($SIZE_CELL / 2) + (- ($array.length / 2) + $index) * $SIZE_CELL, 0);

            const floor = this.$createActorFloor(position.clone());
            this.$removables.push(floor);

            switch ($actor) {

                case 'Exit': {

                    const exit = this.$createActorExit(position.clone());
                    this.$removables.push(exit);

                    exit.addListener(STATES_EXIT.ENTERED, () => {

                        this.$exiting = true;
                    });

                    break;
                }

                case 'Hero': {

                    const hero = this.$createActorHero(position.clone());
                    this.$removables.push(hero);

                    this.$hero = hero;
                    this.stage.setPointOfView(this.$hero);

                    break;
                }

                case 'Hole': {

                    const hole = this.$createActorHole(position.clone());
                    this.$removables.push(hole);

                    break;
                }

                case 'Wall': {

                    const wall = this.$createActorWall(position.clone());
                    this.$removables.push(wall);

                    break;
                }
            }
        });
    }

    /**
     * Snaps the 'hero' actor to the level grid.
     * @private
     */
    $snapHero() {

        const cell = this.$hero.translation.clone().multiply(new Vector2(1 / ($SIZE_CELL / 2), 1));
        this.$hero.translateTo(new Vector2(Math.round(cell.x) * ($SIZE_CELL / 2), cell.y));
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$exiting = false;
        this.$removables = [];

        stateOrientation.setState('SOUTH');

        this.$createLevel();
        this.$createLevelView();

        const getCommandRotateClockwise = () => (this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.LT) || this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.LB) || this.engine.getInput(EVENT_CODES.KEYBOARD_AZERTY.LEFT));
        const getCommandRotateCounterClockwise = () => (this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.RT) || this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.RB) || this.engine.getInput(EVENT_CODES.KEYBOARD_AZERTY.RIGHT));
        const getCommandLeft = () => (this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.LEFT) || this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.LS_LEFT) || this.engine.getInput(EVENT_CODES.KEYBOARD_AZERTY.Q));
        const getCommandRight = () => (this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.RIGHT) || this.engine.getInput(EVENT_CODES.GAMEPAD_XBOX.LS_RIGHT) || this.engine.getInput(EVENT_CODES.KEYBOARD_AZERTY.D));

        this.$machine = new FiniteStateMachine([

            {
                $state: 'IDLE',
                $transitions: [

                    {
                        $state: 'ROLLING_LEFT',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN && getCommandLeft() === true && checkMoveHeroLeftFromOrientation() === true)
                    },
                    {
                        $state: 'ROLLING_RIGHT',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN && getCommandRight() === true && checkMoveHeroRightFromOrientation() === true)
                    },
                    {
                        $state: 'ROTATING_CLOCKWISE',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN && getCommandRotateClockwise() === true)
                    },
                    {
                        $state: 'ROTATING_COUNTER_CLOCKWISE',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN && getCommandRotateCounterClockwise() === true)
                    }
                ]
            },
            {
                $state: 'ROLLING_LEFT',
                $onEnter: () => {

                    this.$hero.trigger(ACTIONS_HERO.ROLL);
                },
                $onTick: ({$timetick}) => {

                    this.$hero.translate(new Vector2(- ($SIZE_CELL * $timetick) / $DURATION_STEP, 0));
                },
                $onLeave: () => {

                    moveHeroLeftFromOrientation();
                    this.$snapHero();
                },
                $transitions: [

                    {
                        $state: 'EXITING',
                        $condition: ({$timer}) => ($timer >= $DURATION_STEP && this.$exiting === true)
                    },
                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= $DURATION_STEP)
                    }
                ]
            },
            {
                $state: 'ROLLING_RIGHT',
                $onEnter: () => {

                    this.$hero.trigger(ACTIONS_HERO.ROLL);
                },
                $onTick: ({$timetick}) => {

                    this.$hero.translate(new Vector2(($SIZE_CELL * $timetick) / $DURATION_STEP, 0));
                },
                $onLeave: () => {

                    moveHeroRightFromOrientation();
                    this.$snapHero();
                },
                $transitions: [

                    {
                        $state: 'EXITING',
                        $condition: ({$timer}) => ($timer >= $DURATION_STEP && this.$exiting === true)
                    },
                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= $DURATION_STEP)
                    }
                ]
            },
            {
                $state: 'ROTATING_CLOCKWISE',
                $onEnter: () => {

                    setOrientationClockwise();
                    this.$createLevelView();

                    this.addSound(new Sound({

                        $audio: soundWoosh
                    }));
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN)
                    }
                ]
            },
            {
                $state: 'ROTATING_COUNTER_CLOCKWISE',
                $onEnter: () => {

                    setOrientationCounterClockwise();
                    this.$createLevelView();

                    this.addSound(new Sound({

                        $audio: soundWoosh
                    }));
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= $DURATION_COOLDOWN)
                    }
                ]
            },
            {
                $state: 'EXITING',
                $onEnter: () => {

                    this.$snapHero();

                    this.$camera = this.stage.createActor(Actor).translateTo(this.$hero.translation.clone());
                    this.stage.setPointOfView(this.$camera);

                    this.$hero.trigger(ACTIONS_HERO.FLY);
                },
                $onTick: ({$timetick}) => {

                    this.$hero.translate(new Vector2(0, ($SIZE_CELL * 2) * $timetick / 1000));
                    this.$camera.translate(new Vector2(0, $SIZE_CELL * $timetick / 1000));
                },
                $transitions: [

                    {
                        $state: 'CLEANING',
                        $condition: ({$timer}) => ($timer >= 1600)
                    }
                ]
            },
            {
                $state: 'CLEANING',
                $onEnter: async () => {

                    [...this.$removables].forEach(($actor) => {

                        this.stage.removeActor($actor);
                    });
                },
                $transitions: [

                    {
                        $state: 'LEFT',
                        $condition: ({$timer}) => ($timer >= 1000)
                    }
                ]
            },
            {
                $state: 'LEFT',
                $onEnter: async () => {

                    const next = getNextLevel();

                    if (typeof next === 'undefined') {

                        await this.engine.preloadStage(StageCredits);

                        stateLevelCurrent.setState(getFirstLevel());

                        this.engine.createStage(StageCredits);

                        return;
                    }

                    stateLevelCurrent.setState(next);

                    this.engine.createStage(StagePrototype);
                }
            }
        ]);

        this.$machine.initiate('IDLE');
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$machine.tick($timetick);
    }
}

export default ControllerPrototype;
