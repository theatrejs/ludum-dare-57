import {Actor, EVENTCODES, FACTORIES, FiniteStateMachine, Vector2} from '@theatrejs/theatrejs';

import {getStateStage} from 'states/stage.state.js';
import {getStateZIndexInterface} from 'states/z-indexes.state.js';

import StageSplashScreen from 'stages/splash-screen/splash-screen.stage.js';

import ActorCredits from './actors/credits/credits.actor.js';

import ActorLudumDare from './actors/ludum-dare/ludum-dare.actor.js';
import * as ACTIONS_PRESS_ANY_KEY from './actors/ludum-dare/ludum-dare.actions.js';

class ControllerCredits extends FACTORIES.ActorWithPreloadables([

    ActorCredits,
    ActorLudumDare
]) {

    /**
     * @typedef {('ENTERING' | 'IDLE' | 'LEAVING' | 'LOADING' | 'SELECTED')} TypeStateMachine A finite state machine state.
     */

    /**
     * Stores the 'credits' actor.
     * @type {Actor}
     * @private
     */
    $actorCredits;

    /**
     * Stores the 'ludum dare' actor.
     * @type {Actor}
     * @private
     */
    $actorLudumDare;

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

        this.stage.removeActor(this.$actorCredits);
        this.stage.removeActor(this.$actorLudumDare);
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

                    this.$actorCredits = this.stage.createActor(ActorCredits)
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

                    this.$actorLudumDare = this.stage.createActor(ActorLudumDare)
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

                    this.$actorLudumDare.trigger(ACTIONS_PRESS_ANY_KEY.SELECT);
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

                    this.stage.removeActor(this.$actorCredits);
                    this.stage.removeActor(this.$actorLudumDare);

                    this.engine.createStage(StageSplashScreen);

                    window.open('https://ldjam.com/events/ludum-dare/57/$406925');
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

export default ControllerCredits;
