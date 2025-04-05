import {Actor, FACTORIES} from '@theatrejs/theatrejs';

import ActorButton from 'actors/button/button.actor.js';

import ActorLogicGateAnd from 'actors/logic-gate-and/logic-gate-and.actor.js';

import ActorTimer1000 from 'actors/timer-1000/timer-1000.actor.js';

import stages from 'stages/stages.ldtk';

class ControllerPrototype extends FACTORIES.ActorWithPreloadables([

    ActorButton,
    ActorLogicGateAnd,
    ActorTimer1000
]) {

    /**
     * @type {Actor['onCreate']}
     */
    onCreate() {

        /**
         * @type {Map<string, typeof Actor<string, string>>}
         */
        const mapping = /** @type {Map<string, typeof Actor<string, string>>} */(new Map());

        mapping.set('Button', ActorButton);
        mapping.set('LogicGateAnd', ActorLogicGateAnd);
        mapping.set('Timer1000', ActorTimer1000);

        /**
         * @type {Array<Actor>}
         */
        const interactives = [];

        stages.getEntities({

            $level: 'LevelPrototype',
            $layer: 'actors'
        })
        .forEach(($entity) => {

            const {$identifier, $position, $type} = $entity;

            if (mapping.has($type) === false) {

                return;
            }

            const actor = this.stage.createActor(mapping.get($type))
            .setIdentifier($identifier)
            .translateTo($position.clone());

            interactives.push(actor);
        });

        stages.getEntitiesData({

            $level: 'LevelPrototype',
            $layer: 'interactions'
        })
        .map(($entity) => ({

            $source: {

                $identifier: $entity.fieldInstances[0].__value.entityIid,
                $state: $entity.fieldInstances[1].__value
            },
            $target: {

                $identifier: $entity.fieldInstances[2].__value.entityIid,
                $action: $entity.fieldInstances[3].__value
            }
        }))
        .forEach(($entity) => {

            this.stage.actors.find(($actor) => ($actor.identifier === $entity.$source.$identifier))
            .addListener($entity.$source.$state, () => {

                this.stage.actors.find(($actor) => ($actor.identifier === $entity.$target.$identifier))
                .trigger($entity.$target.$action);
            })
        });

        interactives.forEach(($actor) => {

            $actor.trigger('START');
        });
    }
}

export default ControllerPrototype;
