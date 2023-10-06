import { HexColors } from "$src/constants";

export default class BuilderRole implements CreepWorker {
  run(creep: Creep): void {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
    }

    if (creep.memory.building) {
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: HexColors.white },
          });
        }
      } else {
        let roads = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType === STRUCTURE_ROAD ||
              structure.structureType === STRUCTURE_SPAWN ||
              (structure.structureType === STRUCTURE_TOWER && structure.hits < structure.hitsMax)
            );
          },
        });
        if (roads.length > 0) {
          if (creep.repair(roads[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(roads[0], {
              visualizePathStyle: { stroke: HexColors.white },
            });
          }
        } else {
          creep.moveTo(Game.flags.AFK, {
            visualizePathStyle: { stroke: HexColors.red },
          });
        }
      }
    } else {
      let sources = creep.pos.findClosestByPath(FIND_SOURCES);
      if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources, { visualizePathStyle: { stroke: HexColors.orange } });
      }
    }
  }
}
