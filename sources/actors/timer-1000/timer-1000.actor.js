import {Actor, FACTORIES} from '@theatrejs/theatrejs';

import * as ACTIONS from './timer-1000.actions.js';
import * as STATES from './timer-1000.states.js';

/**
 * @extends {Actor<(ACTIONS.INCREASE | ACTIONS.START), (STATES.ACTIVATED | STATES.STARTED)>}
 */
class ActorTimer1000 extends FACTORIES.ActorWithPreloadables([]) {

    /**
     * Stores the remaining time.
     * @type {number}
     * @private
     */
    $timeout;

    /**
     * Triggers 'increase' action.
     * @private
     */
    $actionIncrease() {

        this.$timeout += 1000;
    }

    /**
     * Triggers the 'start' action.
     * @private
     */
    $actionStart() {

        this.$trigger(STATES.STARTED);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$timeout = 0;

        this.$setListener(ACTIONS.INCREASE, this.$actionIncrease.bind(this));
        this.$setListener(ACTIONS.START, this.$actionStart.bind(this));
    }

    /**
     * @type {Actor['onTick']}
     */
    onTick($timetick) {

        if (this.$timeout > 0) {

            this.$timeout -= $timetick;

            if (this.$timeout < 0) {

                this.$timeout = 0;
            }

            if (this.$timeout === 0) {

                this.$trigger(STATES.ACTIVATED);
            }
        }
    }
}

export default ActorTimer1000;
