import {Actor, EVENTCODES, FACTORIES, FiniteStateMachine, Vector2} from '@theatrejs/theatrejs';

import {getStateStage} from 'states/stage.state.js';
import {getStateZIndexInterface} from 'states/z-indexes.state.js';

import ActorPressAnyKey from './actors/press-any-key/press-any-key.actor.js';
import * as ACTIONS_PRESS_ANY_KEY from './actors/press-any-key/press-any-key.actions.js';

import ActorTitle from './actors/title/title.actor.js';

class ControllerSplashScreen extends FACTORIES.ActorWithPreloadables([

    ActorPressAnyKey,
    ActorTitle
]) {

    /**
     * @typedef {('ENTERING' | 'IDLE' | 'LEAVING' | 'LEFT' | 'LOADING' | 'SELECTED')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the 'press any key' actor.
     * @type {Actor}
     * @private
     */
    $actorPressAnyKey;

    /**
     * Stores the 'title' actor.
     * @type {Actor}
     * @private
     */
    $actorTitle;

    /**
     * Stores the finite state machine.
     * @type {FiniteStateMachine<TypeStateMachine>}
     * @private
     */
    $machine;

    /**
     * Stores the preloaded status of the next stage.
     * @type {boolean}
     * @private
     */
    $preloaded;

    /**
     * @type {Actor['onBeforeRemove']}
     */
    onBeforeRemove() {

        this.stage.removeActor(this.$actorPressAnyKey);
        this.stage.removeActor(this.$actorTitle);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$preloaded = false;

        this.engine.preloadStage(getStateStage()).then(() => {

            this.$preloaded = true;
        });

        this.$machine = new FiniteStateMachine([

            {
                $state: 'LOADING',
                $transitions: [

                    {
                        $state: 'ENTERING',
                        $condition: ({$timer}) => ($timer >= 2000)
                    }
                ]
            },
            {
                $state: 'ENTERING',
                $onEnter: () => {

                    this.$actorTitle = this.stage.createActor(ActorTitle)
                    .translateTo(new Vector2(0, 64))
                    .setZIndex(getStateZIndexInterface());
                },
                $transitions: [

                    {
                        $state: 'IDLE',
                        $condition: ({$timer}) => ($timer >= 2000)
                    }
                ]
            },
            {
                $state: 'IDLE',
                $onEnter: () => {

                    this.$actorPressAnyKey = this.stage.createActor(ActorPressAnyKey)
                    .translateTo(new Vector2(0, -96))
                    .setZIndex(getStateZIndexInterface());
                },
                $transitions: [

                    {
                        $state: 'SELECTED',
                        $condition: () => (

                            this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.A) === true
                            || this.engine.getInput(EVENTCODES.GAMEPAD_XBOX.START) === true
                            || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.ENTER) === true
                            || this.engine.getInput(EVENTCODES.KEYBOARD_AZERTY.SPACE) === true
                        )
                    }
                ]
            },
            {
                $state: 'SELECTED',
                $onEnter: () => {

                    this.$actorPressAnyKey.trigger(ACTIONS_PRESS_ANY_KEY.SELECT);
                },
                $transitions: [

                    {
                        $state: 'LEAVING',
                        $condition: ({$timer}) => ($timer >= 2000 && this.$preloaded === true)
                    }
                ]
            },
            {
                $state: 'LEAVING',
                $onEnter: () => {

                    this.stage.removeActor(this.$actorPressAnyKey);
                    this.stage.removeActor(this.$actorTitle);
                },
                $transitions: [

                    {
                        $state: 'LEFT',
                        $condition: ({$timer}) => ($timer >= 2000)
                    }
                ]
            },
            {
                $state: 'LEFT',
                $onEnter: () => {

                    this.engine.createStage(getStateStage());
                }
            }
        ]);

        this.$machine.initiate('LOADING');
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        this.$machine.tick($timetick);
    }
}

export default ControllerSplashScreen;
