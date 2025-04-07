import {Actor, EVENTCODES, FACTORIES, FiniteStateMachine, Sound, Vector2} from '@theatrejs/theatrejs';

import ActorExit from 'actors/exit/exit.actor.js';
import * as STATES_EXIT from 'actors/exit/exit.states.js';

import ActorFloor from 'actors/floor/floor.actor.js';

import ActorHero from 'actors/hero/hero.actor.js';

import ActorHole from 'actors/hole/hole.actor.js';

import ActorLogicGateAnd from 'actors/logic-gate-and/logic-gate-and.actor.js';

import ActorTimer1000 from 'actors/timer-1000/timer-1000.actor.js';

import ActorWall from 'actors/wall/wall.actor.js';

import ActorTemple from 'actors/temple/temple.actor.js';

import stages from 'stages/stages.ldtk';

import {stateLevel, getLevel, getLineFromNorth, getLineFromSouth, getLineFromWest, getPositionHero, getLineFromEast, checkMoveHeroLeftFromOrientation, checkMoveHeroRightFromOrientation, moveHeroLeftFromOrientation, moveHeroRightFromOrientation} from 'states/level.state.js';
import {setOrientationCCW, setOrientationCW, stateOrientation} from 'states/orientation.state.js';
import { getNextLevel, stateLevelCurrent } from 'states/levels.state.js';
import StageCredits from 'stages/credits/credits.stage.js';
import StagePrototype from './prototype.stage.js';

import ActorControls from './actors/controls/controls.actor.js';

import soundTeleport from '../../actors/hero/sounds/teleport.rpp';
import soundBreathe from '../../actors/hero/sounds/breathe.rpp';
import soundRoll from '../../actors/hero/sounds/roll.rpp';
import soundWoosh from '../../actors/hero/sounds/woosh.rpp';
import soundAmbiant from '../../actors/hero/sounds/ambiant.rpp';

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorControls,
    ActorExit,
    ActorFloor,
    ActorHero,
    ActorHole,
    ActorLogicGateAnd,
    ActorTimer1000,
    ActorWall,

    ActorTemple,
    FACTORIES.PreloadableSound(soundTeleport),
    FACTORIES.PreloadableSound(soundBreathe),
    FACTORIES.PreloadableSound(soundRoll),
    FACTORIES.PreloadableSound(soundWoosh),
    FACTORIES.PreloadableSound(soundAmbiant),
]) {

    /**
     * @typedef {('EXITING' | 'IDLE' | 'LEAVING' | 'SWITCHING_CCW' | 'SWITCHING_CW' | 'WALKING_LEFT' | 'WALKING_RIGHT')} TypeStateMachine A finite state machine state.
     */

    $actors = [];

    /**
     * @type {Actor}
     */
    $hero;

    /**
     * @type {boolean}
     */
    $exiting;

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    $controls;

    $createLevel() {

        this.addSound(new Sound({

            $audio: soundAmbiant,
            $loop: true
        }));

        // this.$controls = this.stage.createActor(ActorControls)
        // .setZIndex(1000)

        const grid = stages.getGrid({

            $level: stateLevelCurrent.getState(),
            $layer: 'actors'
        });

        const gridData = stages.getGridData({

            $level: stateLevelCurrent.getState(),
            $layer: 'actors'
        });

        // console.log(grid);
        // console.log(gridData);

        const level = [];

        for (let $row = 0, $height = grid.$height; $row < $height; $row += 1) {

            level[$row] = [];

            for (let $column = 0, $width = grid.$width; $column < $width; $column += 1) {

                level[$row][$column] = undefined;
            }
        }

        gridData.entityInstances.forEach(($entity) => {

            // console.log($entity, $entity.__grid, level[$entity.__grid[1]]);

            level[$entity.__grid[1]][$entity.__grid[0]] = $entity.__identifier;
        });

        stateLevel.setState(level);

        // console.log(
        //     // getLevel(),
        //     getLineFromWest(getPositionHero()));
    }

    $camera;

    $temple;

    $createView() {

        /**
         * @type {Map<string, typeof Actor<string, string>>}
         */
        const mapping = /** @type {Map<string, typeof Actor<string, string>>} */(new Map());

        mapping.set('Exit', ActorExit);
        mapping.set('Hero', ActorHero);
        mapping.set('Hole', ActorHole);
        mapping.set('LogicGateAnd', ActorLogicGateAnd);
        mapping.set('Timer1000', ActorTimer1000);
        mapping.set('Wall', ActorWall);

        [...this.$actors].forEach(($actor) => {

            this.stage.removeActor($actor);
        });

        this.$temple = this.stage.createActor(ActorTemple)
        this.$actors.push(this.$temple);

        let getterLine = getLineFromNorth;

        const orientation = stateOrientation.getState();

        if (orientation === 'EAST') {

            getterLine = getLineFromEast;
        }

        if (orientation === 'SOUTH') {

            getterLine = getLineFromSouth;
        }

        if (orientation === 'WEST') {

            getterLine = getLineFromWest;
        }

        getterLine(getPositionHero()).forEach(($actor, $index, $array) => {

            const floor = this.stage.createActor(ActorFloor)
            .translate(new Vector2(16 + (- ($array.length / 2) + $index) * 32, 0));

            this.$actors.push(floor);

            const actor = this.stage.createActor(mapping.get($actor))
            .translate(new Vector2(16 + (- ($array.length / 2) + $index) * 32, 0));

            if ($actor === 'Hero') {

                this.stage.setPointOfView(actor);

                // this.stage.setPointOfView(new Actor(this.stage).translateTo(

                //     actor.translation.clone().add(new Vector2(0, -32))
                // ));

                this.$hero = actor;

                actor.setZIndex(1);
            }

            if ($actor === 'Exit') {

                actor.addListener(STATES_EXIT.ENTERED, () => {

                    this.$exiting = true;

                    this.$camera = this.stage.createActor(Actor).translateTo(this.$hero.translation.clone());
                    this.stage.setPointOfView(this.$camera);
                });
            }

            this.$actors.push(actor);
        });
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$exiting = false;

        /**/

        // stages.getEntities({

        //     $level: 'Underground1',
        //     $layer: 'actors'
        // })
        // .forEach(($entity) => {

        //     const {$identifier, $position, $type} = $entity;

        //     if (mapping.has($type) === false) {

        //         return;
        //     }

        //     const actor = this.stage.createActor(mapping.get($type))
        //     .setIdentifier($identifier)
        //     .translateTo($position.clone());

        //     interactives.push(actor);
        // });

        // stages.getEntitiesData({

        //     $level: 'Underground1',
        //     $layer: 'interactions'
        // })
        // .map(($entity) => ({

        //     $source: {

        //         $identifier: $entity.fieldInstances[0].__value.entityIid,
        //         $state: $entity.fieldInstances[1].__value
        //     },
        //     $target: {

        //         $identifier: $entity.fieldInstances[2].__value.entityIid,
        //         $action: $entity.fieldInstances[3].__value
        //     }
        // }))
        // .forEach(($entity) => {

        //     this.stage.actors.find(($actor) => ($actor.identifier === $entity.$source.$identifier))
        //     .addListener($entity.$source.$state, () => {

        //         this.stage.actors.find(($actor) => ($actor.identifier === $entity.$target.$identifier))
        //         .trigger($entity.$target.$action);
        //     })
        // });

        // interactives.forEach(($actor) => {

        //     $actor.trigger('START');
        // });

        stateOrientation.setState('SOUTH');

        this.$createLevel();

        this.$createView();

        const getCommandCW = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LB) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.LEFT));
        const getCommandCCW = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.RT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.RB) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.RIGHT));
        const getCommandLeft = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LEFT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LS_LEFT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.Q));
        const getCommandRight = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.RIGHT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LS_RIGHT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.D));


        this.$machine = new FiniteStateMachine([

            {
                $state: 'IDLE',
                $transitions: [

                    {
                        $state: 'EXITING',
                        $condition: ({$timer}) => ($timer >= 1600 && this.$exiting === true)
                    },
                    {
                        $state: 'SWITCHING_CCW',
                        $condition: ({$timer}) => (this.$exiting === false && $timer >= 200 && getCommandCCW() === true)
                    },
                    {
                        $state: 'SWITCHING_CW',
                        $condition: ({$timer}) => (this.$exiting === false && $timer >= 200 && getCommandCW() === true)
                    },
                    {
                        $state: 'WALKING_LEFT',
                        $condition: ({$timer}) => (this.$exiting === false && $timer >= 200 && getCommandLeft() === true && checkMoveHeroLeftFromOrientation() === true)
                    },
                    {
                        $state: 'WALKING_RIGHT',
                        $condition: ({$timer}) => (this.$exiting === false && $timer >= 200 && getCommandRight() === true && checkMoveHeroRightFromOrientation() === true)
                    }
                ]
            },
            {
                $state: 'EXITING',
                $onEnter: ({$timetick}) => {

                    [...this.$actors].forEach(($actor) => {

                        this.stage.removeActor($actor);
                    });
                },
                $onLeave: async () => {

                    const next = getNextLevel();

                    if (typeof next === 'undefined') {

                        console.log('CREDITS')

                        await this.engine.preloadStage(StageCredits);
                        this.engine.createStage(StageCredits);

                        return;
                    }

                    stateLevelCurrent.setState(next);

                    this.engine.createStage(StagePrototype);
                },
                $transitions: [

                    {
                        $state: 'LEAVING',
                        $condition: ({$timer}) => ($timer >= 1000)
                    }
                ]
            },
            {
                $state: 'LEAVING'
            },
            {
                $state: 'SWITCHING_CCW',
                $onEnter: () => {

                    setOrientationCCW();
                    this.$createView();

                    this.addSound(new Sound({

                        $audio: soundWoosh
                    }));
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= 200)
                    }
                ]
            },
            {
                $state: 'SWITCHING_CW',
                $onEnter: () => {

                    setOrientationCW();
                    this.$createView();

                    this.addSound(new Sound({

                        $audio: soundWoosh
                    }));
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= 200)
                    }
                ]
            },
            {
                $state: 'WALKING_LEFT',
                $onEnter: () => {

                    // this.$createView();

                    this.addSound(new Sound({

                        $audio: soundRoll
                    }));
                },
                $onTick: ({$timetick}) => {

                    this.$hero.translate(new Vector2(- (32 * $timetick) / 200, 0));
                },
                $onLeave: () => {

                    moveHeroLeftFromOrientation();
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= 200)
                    }
                ]
            },
            {
                $state: 'WALKING_RIGHT',
                $onEnter: () => {

                    // this.$createView();

                    this.addSound(new Sound({

                        $audio: soundRoll
                    }));
                },
                $onTick: ({$timetick}) => {

                    this.$hero.translate(new Vector2((32 * $timetick) / 200, 0));
                },
                $onLeave: () => {

                    moveHeroRightFromOrientation();
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= 200)
                    }
                ]
            }
        ]);

        this.$machine.initiate('IDLE');
    }

    $exit;

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$machine.tick($timetick);

        if (typeof this.$camera !== 'undefined') {

            this.$camera.translate(new Vector2(0, 32 * $timetick / 1000));
        }

        if (this.$exiting) {

            this.$hero.translate(new Vector2(0, 64 * $timetick / 1000));
        }

        if (this.$exiting && this.$exit !== true) {

            this.$exit = true;

            this.$hero.actionFly();

            this.addSound(new Sound({

                $audio: soundBreathe
            }));
            // this.stage.removeActor(this.$controls);
        }

        // this.$temple.translateTo(this.$hero.translation.clone());
        // this.$controls.translateTo(

        //     new Vector2(

        //         Math.floor(this.$hero.translation.clone().x),
        //         Math.floor(this.$hero.translation.clone().y)
        //     )
        // );
    }
}

export default ControllerPrototype;
