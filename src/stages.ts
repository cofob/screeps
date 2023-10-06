import { spawnCreep } from "./utils";

import runHarvesterLogic from "./roles/harvester";
import runUpgraderLogic from "./roles/upgrader";
import runBuilderLogic from "./roles/builder";
import runRepairerLogic from "./roles/repairer";
import Logger from "./logging";

const logger = new Logger("stages");

type CreepsByTypes = { [creepType in CreepType]: Creep[] };

export function clearDeadBodies(): void {
    for (const name in Memory.creeps) {
        if (!Game.creeps[name] /*.isAlive()*/) {
            delete Memory.creeps[name];
            logger.info("Clearing dead creep memory: " + name);
        }
    }
}

export function towerControl(): void {
    // We have no towers yet
    /*
    for (const structure of Object.values(Game.structures)) {
        if (structure.structureType !== STRUCTURE_TOWER) return;

        const tower = structure as StructureTower;

        // Find closest hostile creep and attack it
        let closestHostile =
            tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            if (tower.attack(closestHostile) === OK) continue;
        }

        // Find closest damaged structure and repair it
        let closestDamagedStructure = tower.pos.findClosestByRange(
            FIND_STRUCTURES,
            {
                filter: (structure) => structure.hits < structure.hitsMax,
            }
        );
        if (closestDamagedStructure) {
            if (tower.repair(closestDamagedStructure) === OK) continue;
        }
    }
    */
}

function showCreepNameOverItsHead(creep: Creep) {
    const shortRoleName = creep.memory.role[0].toUpperCase();
    creep.room.visual.text(shortRoleName, creep.pos.x + 1, creep.pos.y, {
        align: "left",
        opacity: 0.8,
    });
}

export function getCreepsByTypesAndRunLogic(): CreepsByTypes {
    const creepsByTypes: { [creepType in CreepType]: Creep[] } = {
        harvester: [],
        upgrader: [],
        builder: [],
        repairer: [],
    };
    for (const creep of Object.values(Game.creeps)) {
        creepsByTypes[creep.memory.role].push(creep);
        showCreepNameOverItsHead(creep);
        switch (creep.memory.role) {
            case "harvester":
                runHarvesterLogic(creep);
                break;
            case "upgrader":
                runUpgraderLogic(creep as UpgraderCreep);
                break;
            case "builder":
                runBuilderLogic(creep as BuilderCreep);
                break;
            case "repairer":
                runRepairerLogic(creep as RepairerCreep);
                break;
        }
    }

    return creepsByTypes;
}

export function keepPopulation(creepsByTypes: CreepsByTypes) {
    let isSpawned = false;
    if (creepsByTypes.harvester.length < 3) {
        isSpawned = spawnCreep("harvester") === OK;
    } else if (creepsByTypes.repairer.length < 1) {
        isSpawned = spawnCreep("repairer") === OK;
    } else if (creepsByTypes.upgrader.length < 10) {
        isSpawned = spawnCreep("upgrader") === OK;
    } else if (creepsByTypes.builder.length < 1) {
        isSpawned = spawnCreep("builder") === OK;
    }

    const spawning = Game.spawns["Spawn1"].spawning;
    if (spawning !== null) {
        const spawningCreep = Game.creeps[spawning.name];
        Game.spawns["Spawn1"].room.visual.text(
            "Spawning " + spawningCreep.memory.role,
            Game.spawns["Spawn1"].pos.x + 1,
            Game.spawns["Spawn1"].pos.y,
            { align: "left", opacity: 0.8 }
        );
        if (isSpawned) logger.info("Spawning new creep: " + spawningCreep);
    }
}
