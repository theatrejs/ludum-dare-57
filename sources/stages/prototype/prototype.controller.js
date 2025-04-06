import {Actor, EVENTCODES, FACTORIES, FiniteStateMachine, Vector2} from '@theatrejs/theatrejs';

import ActorExit from 'actors/exit/exit.actor.js';

import ActorHero from 'actors/hero/hero.actor.js';

import ActorHole from 'actors/hole/hole.actor.js';

import ActorLogicGateAnd from 'actors/logic-gate-and/logic-gate-and.actor.js';

import ActorTimer1000 from 'actors/timer-1000/timer-1000.actor.js';

import ActorWall from 'actors/wall/wall.actor.js';

import ActorTemple from 'actors/temple/temple.actor.js';

import stages from 'stages/stages.ldtk';

import {stateLevel, getLevel, getLineFromNorth, getLineFromSouth, getLineFromWest, getPositionHero, getLineFromEast, checkMoveHeroLeftFromOrientation, checkMoveHeroRightFromOrientation, moveHeroLeftFromOrientation, moveHeroRightFromOrientation} from 'states/level.state.js';
import {setOrientationCCW, setOrientationCW, stateOrientation} from 'states/orientation.state.js';

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorExit,
    ActorHero,
    ActorHole,
    ActorLogicGateAnd,
    ActorTimer1000,
    ActorWall,

    ActorTemple
]) {

    /**
     * @typedef {('IDLE' | 'SWITCHING_CCW' | 'SWITCHING_CW' | 'WALKING_LEFT' | 'WALKING_RIGHT')} TypeStateMachine A finite state machine state.
     */

    $actors = [];

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    $createLevel() {

        const grid = stages.getGrid({

            $level: 'Underground2',
            $layer: 'actors'
        });

        const gridData = stages.getGridData({

            $level: 'Underground2',
            $layer: 'actors'
        });

        console.log(grid);
        console.log(gridData);

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

        console.log(
            // getLevel(),
            getLineFromWest(getPositionHero()));
    }

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

        const temple = this.stage.createActor(ActorTemple)
        .translateTo(new Vector2(0, 96 + 32));

        this.$actors.push(temple);

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

            const actor = this.stage.createActor(mapping.get($actor))
            .translate(new Vector2(16 + (- ($array.length / 2) + $index) * 32, 0));

            if ($actor === 'Hero') {

                this.stage.setPointOfView(actor);
            }

            this.$actors.push(actor);
        });
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

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

        const getCommandCCW = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.RT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.RIGHT));
        const getCommandCW = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.LEFT));
        const getCommandLeft = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LEFT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LS_LEFT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.Q));
        const getCommandRight = () => (this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.RIGHT) || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.LS_RIGHT) || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.D));

        this.$machine = new FiniteStateMachine([

            {
                $state: 'IDLE',
                $transitions: [

                    {
                        $state: 'SWITCHING_CCW',
                        $condition: ({$timer}) => ($timer >= 200 && getCommandCCW() === true)
                    },
                    {
                        $state: 'SWITCHING_CW',
                        $condition: ({$timer}) => ($timer >= 200 && getCommandCW() === true)
                    },
                    {
                        $state: 'WALKING_LEFT',
                        $condition: ({$timer}) => ($timer >= 200 && checkMoveHeroLeftFromOrientation() === true && getCommandLeft() === true)
                    },
                    {
                        $state: 'WALKING_RIGHT',
                        $condition: ({$timer}) => ($timer >= 200 && checkMoveHeroRightFromOrientation() === true && getCommandRight() === true)
                    }
                ]
            },
            {
                $state: 'SWITCHING_CCW',
                $onEnter: () => {

                    setOrientationCCW();
                    this.$createView();
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

                    moveHeroLeftFromOrientation();
                    this.$createView();
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

                    moveHeroRightFromOrientation();
                    this.$createView();
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

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$machine.tick($timetick);
    }
}

export default ControllerPrototype;
