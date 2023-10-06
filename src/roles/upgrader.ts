import { HexColors } from "../enums";
import { expect } from "../jestLikeIfs";

export default function runUpgraderLogic(creep: UpgraderCreep): void {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.upgrading = false;
    } else if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
        creep.memory.upgrading = true;
    }

    if (!creep.memory.upgrading) {
        const sources = creep.pos.findClosestByPath(FIND_SOURCES);
        if (sources === null) return; // not found; probably temparary

        const harvestingResult = expect(creep.harvest(sources)).in([
            OK,
            ERR_BUSY,
            ERR_NOT_IN_RANGE,
        ]);
        if (harvestingResult === ERR_NOT_IN_RANGE) {
            expect(
                creep.moveTo(sources, {
                    visualizePathStyle: { stroke: HexColors.orange },
                })
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
        return;
    }

    const upgradeResult = expect(
        creep.upgradeController(creep.room.controller)
    ).in([OK, ERR_NOT_IN_RANGE]);
    if (upgradeResult === ERR_NOT_IN_RANGE) {
        expect(
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: { stroke: HexColors.white },
            })
        ).in([OK, ERR_BUSY, ERR_TIRED]);
    }
}
