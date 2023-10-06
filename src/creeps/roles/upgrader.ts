import { moveToSources } from "$src/common/path";
import { HexColors } from "$src/constants";

export default class UpgraderRole implements CreepWorker {
    run(creep: Creep): void {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: HexColors.white },
                });
            }
        } else {
            moveToSources(creep);
        }
    }
}
