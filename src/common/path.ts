import { HexColors } from "../constants";

export function moveToSources(creep: Creep): void {
    let sources = creep.pos.findClosestByPath(FIND_SOURCES);
    if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources, { visualizePathStyle: { stroke: HexColors.orange }, reusePath: 5 });
    }
}

export class Vec2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function findDistanceBetweenVec2(pos1: Vec2, pos2: Vec2): number {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export function moveToEnergyContainer(creep: Creep): void {
    let containers = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
            return (
                (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            );
        },
    });
    if (containers.length > 0) {
        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[0], {
                visualizePathStyle: { stroke: HexColors.white },
            });
        }
    }
}
