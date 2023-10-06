import { HexColors } from "../enums";
import { expect } from "../jestLikeIfs";

export default function runRepairerLogic(creep: RepairerCreep): void {
    if (Memory.maxHp === undefined) {
        Memory.maxHp = 5000;
    }

    if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.repairing = false;
    } else if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
        creep.memory.repairing = true;
    }

    if (!creep.memory.repairing) {
        const sources = creep.pos.findClosestByPath(FIND_SOURCES);
        if (sources === null) return; // not found; probably temparary

        const harvestingResult = expect(creep.harvest(sources)).in([
            OK,
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

    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                (structure.structureType === STRUCTURE_WALL ||
                    structure.structureType === STRUCTURE_ROAD ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) &&
                structure.hits > 0 &&
                structure.hits < Memory.maxHp &&
                structure.hits < structure.hitsMax
            );
        },
    });

    if (targets.length > 0) {
        const repairResult = expect(creep.repair(targets[0])).in([
            OK,
            ERR_NOT_IN_RANGE,
        ]);
        if (repairResult === ERR_NOT_IN_RANGE) {
            expect(
                creep.moveTo(targets[0], {
                    visualizePathStyle: { stroke: HexColors.white },
                })
            ).in([OK, ERR_BUSY, ERR_TIRED, ERR_NO_PATH]);
        }
    } else {
        expect(
            creep.moveTo(Game.flags.AFK, {
                visualizePathStyle: { stroke: HexColors.red },
            })
        ).in([OK, ERR_BUSY, ERR_TIRED]);

        if (Memory.maxHp < 300000000) {
            Memory.maxHp += 5000;
        } else {
            Memory.maxHp = 50000;
        }
    }
}
