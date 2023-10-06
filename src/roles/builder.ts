import { HexColors } from "../enums";
import { expect } from "../jestLikeIfs";

export default function runBuilderLogic(creep: BuilderCreep): void {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
    } else if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
        creep.memory.building = true;
    }

    if (!creep.memory.building) {
        const sources = creep.pos.findClosestByPath(FIND_SOURCES);
        if (sources === null) return; // not found; probably temparary

        const harvestingResult = expect(creep.harvest(sources)).in([OK, ERR_BUSY, ERR_NOT_IN_RANGE]);
        if (harvestingResult === ERR_NOT_IN_RANGE) {
            creep.moveTo(sources, {
                visualizePathStyle: { stroke: HexColors.orange },
            });
        }

        return;
    }

    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        const buildResult = expect(creep.build(targets[0])).in([OK, ERR_NOT_IN_RANGE]);
        if (buildResult === ERR_NOT_IN_RANGE) {
            expect(
                creep.moveTo(targets[0], {
                    visualizePathStyle: { stroke: HexColors.white },
                }),
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
        return;
    }

    const structures = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
            return (
                (structure.structureType === STRUCTURE_ROAD ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) &&
                structure.hits < structure.hitsMax
            );
        },
    });

    if (structures.length > 0) {
        const repairResult = expect(creep.repair(structures[0])).in([OK, ERR_NOT_IN_RANGE]);
        if (repairResult === ERR_NOT_IN_RANGE) {
            expect(
                creep.moveTo(structures[0], {
                    visualizePathStyle: { stroke: HexColors.white },
                }),
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
    } else {
        expect(
            creep.moveTo(Game.flags.AFK, {
                visualizePathStyle: { stroke: HexColors.red },
            }),
        ).in([OK, ERR_BUSY, ERR_TIRED]);
    }
}
