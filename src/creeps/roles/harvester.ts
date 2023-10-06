import { HexColors } from "$src/constants";

export default class HarvesterRole implements CreepWorker {
    run(creep: Creep): void {
        if (creep.store.getFreeCapacity() > 0) {
            let drop = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            const pickupAnswer = creep.pickup(drop);

            if (pickupAnswer === ERR_NOT_IN_RANGE) {
                creep.moveTo(drop, { visualizePathStyle: { stroke: HexColors.orange } });
            } else if (pickupAnswer === ERR_INVALID_TARGET) {
                const sources = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(sources) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources, {
                        visualizePathStyle: { stroke: HexColors.orange },
                    });
                }
            } else {
                if (pickupAnswer !== OK) console.log("ERROR: Uknown pickup answer:", pickupAnswer);
            }

            return;
        }

        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: { stroke: HexColors.white },
                });
                return;
            }
        }
        for (const structureType of [STRUCTURE_TOWER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION]) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        structure.structureType === structureType &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                },
            });

            if (targets.length !== 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: HexColors.white },
                    });
                }
                break;
            }
        }
    }
}
