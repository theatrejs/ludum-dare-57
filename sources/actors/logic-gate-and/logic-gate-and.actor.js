import {Actor, FACTORIES} from '@theatrejs/theatrejs';

import * as ACTIONS from './logic-gate-and.actions.js';
import * as STATES from './logic-gate-and.states.js';

/**
 * @extends {Actor<(ACTIONS.ACTIVATE_FIRST | ACTIONS.ACTIVATE_SECOND | ACTIONS.DEACTIVATE_FIRST | ACTIONS.DEACTIVATE_SECOND | ACTIONS.START), (STATES.ACTIVATED | STATES.DEACTIVATED | STATES.STARTED)>}
 */
class ActorLogicGateAnd extends FACTORIES.ActorWithPreloadables([]) {

    /**
     * Stores the activated state of the first input.
     * @type {boolean}
     * @private
     */
    $inputFirstActivated;

    /**
     * Stores the activated state of the second input.
     * @type {boolean}
     * @private
     */
    $inputSecondActivated;

    /**
     * Triggers the activated state of the first input.
     * @private
     */
    $actionActivateInputFirst() {

        if (this.$inputFirstActivated === true) {

            return;
        }

        this.$inputFirstActivated = true;

        if (this.$inputSecondActivated === false) {

            return;
        }

        this.$trigger(STATES.ACTIVATED);
    }

    /**
     * Triggers the activated state of the second input.
     * @private
     */
    $actionActivateInputSecond() {

        if (this.$inputSecondActivated === true) {

            return;
        }

        this.$inputSecondActivated = true;

        if (this.$inputFirstActivated === false) {

            return;
        }

        this.$trigger(STATES.ACTIVATED);
    }

    /**
     * Triggers the deactivated state of the first input.
     * @private
     */
    $actionDeactivateInputFirst() {

        if (this.$inputFirstActivated === false) {

            return;
        }

        this.$inputFirstActivated = false;

        if (this.$inputSecondActivated === false) {

            return;
        }

        this.$trigger(STATES.DEACTIVATED);
    }

    /**
     * Triggers the deactivated state of the second input.
     * @private
     */
    $actionDeactivateInputSecond() {

        if (this.$inputSecondActivated === false) {

            return;
        }

        this.$inputSecondActivated = false;

        if (this.$inputFirstActivated === false) {

            return;
        }

        this.$trigger(STATES.DEACTIVATED);
    }

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        this.$inputFirstActivated = false;
        this.$inputSecondActivated = false;

        this.$setListener(ACTIONS.ACTIVATE_FIRST, this.$actionActivateInputFirst.bind(this));
        this.$setListener(ACTIONS.ACTIVATE_SECOND, this.$actionActivateInputSecond.bind(this));
        this.$setListener(ACTIONS.DEACTIVATE_FIRST, this.$actionDeactivateInputFirst.bind(this));
        this.$setListener(ACTIONS.DEACTIVATE_SECOND, this.$actionDeactivateInputSecond.bind(this));
    }
}

export default ActorLogicGateAnd;
