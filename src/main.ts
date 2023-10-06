import { BuilderCreep, HarvesterCreep, RepairerCreep, UpgraderCreep, roleToCreep, spawnCreep } from "./creeps/creeps";
import Logger, { setLogLevel } from "./logging";
import { ErrorMapper } from "./utils/ErrorMapper";

const logger = new Logger("main");

function main() {
    setLogLevel("DEBUG");
    logger.debug(`Deployed from GitHub!`);

    if (Game.time % 60 === 0) {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                logger.info(`Clearing non-existing creep memory: ${name}`);
            }
        }
    }

    let harvesters = _.filter(Game.creeps, function (creep) {
        return creep.memory.role == "harvester";
    });
    let upgraders = _.filter(Game.creeps, function (creep) {
        return creep.memory.role == "upgrader";
    });
    let builders = _.filter(Game.creeps, function (creep) {
        return creep.memory.role == "builder";
    });
    let repairers = _.filter(Game.creeps, function (creep) {
        return creep.memory.role == "repairer";
    });

    // Creep spawning
    // Check if there is a not-spawning spawn
    let spawns = _.filter(Game.spawns, function (spawn) {
        return !spawn.spawning;
    });
    if (spawns.length > 0) {
        if (harvesters.length < 4) {
            spawnCreep("Spawn1", HarvesterCreep);
        } else if (upgraders.length < 2) {
            spawnCreep("Spawn1", UpgraderCreep);
        } else if (builders.length < 2) {
            spawnCreep("Spawn1", BuilderCreep);
        } else if (repairers.length < 1) {
            spawnCreep("Spawn1", RepairerCreep);
        }
    }

    // Spawns
    for (let name in Game.spawns) {
        let spawn = Game.spawns[name];

        // If spawning is in progress, display the creep's name
        if (spawn.spawning) {
            let spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text("🛠️" + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y, {
                align: "left",
                opacity: 0.8,
            });
        }
    }

    // Creeps
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        roleToCreep[creep.memory.role].worker.run(creep);
    }

    // Structures
    for (let name in Game.structures) {
        let structure = Game.structures[name];

        // If structure is a tower
        if (structure.structureType === STRUCTURE_TOWER) {
            let tower = structure as StructureTower;

            // Find closest hostile creep and attack it
            let closestHostile = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                if (tower.attack(closestHostile) === OK) continue;
            }

            // Find closest damaged structure and repair it
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax,
            });
            if (closestDamagedStructure) {
                if (tower.repair(closestDamagedStructure) === OK) continue;
            }
        }
    }
}

export const loop = ErrorMapper.wrapLoop(main);
