import { moveToSources } from "$src/common/path";
import { HexColors } from "$src/constants";

export default class RepairerRole implements CreepWorker {
    run(creep: Creep): void {
        if (Memory.MaxHp == undefined) {
            Memory.MaxHp = 50000;
        }

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (
                        structure.structureType ===
                            STRUCTURE_WALL /** || structure.structureType == STRUCTURE_ROAD) || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER)**/ &&
                        structure.hits > 0 &&
                        structure.hits < Memory.MaxHp
                    );
                },
            });
            if (targets.length > 0) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: { stroke: HexColors.white },
                    });
                }
            } else {
                creep.moveTo(Game.flags.AFK, {
                    visualizePathStyle: { stroke: HexColors.red },
                });
                if (Memory.MaxHp < 300000000) {
                    Memory.MaxHp = Memory.MaxHp + Memory.MaxHp;
                } else {
                    Memory.MaxHp = 50000;
                }
            }
        } else {
            moveToSources(creep);
        }
    }
}
