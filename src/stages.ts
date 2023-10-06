import { spawnCreep } from "./utils";

import Logger from "./logging";
import { isCreepBusy, tickCreepTask } from "./tasks/call_logic";
import { expect } from "./jestLikeIfs";
import { HexColors } from "./enums";

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

function renderCreepNameOverItsHead(creep: Creep) {
    if (creep.spawning) return;
    const shortRoleName = creep.memory.role[0].toUpperCase();
    creep.room.visual.text(shortRoleName, creep.pos.x + 1, creep.pos.y, {
        align: "left",
        opacity: 0.8,
    });
}

function renderSpawningName(spawn: StructureSpawn) {
    spawn.room.visual.text("🛠️" + spawn.spawning.name, spawn.pos.x + 1, spawn.pos.y, {
        align: "left",
        opacity: 0.8,
    });
}

export function renderUI() {
    let renderConfig: RenderConfig = Memory.render || {};

    if (!renderConfig.enableRender) return;

    if (renderConfig.enableCreepNames) {
        for (const name in Game.creeps) {
            renderCreepNameOverItsHead(Game.creeps[name]);
        }
    }

    if (renderConfig.enableSpawningNames) {
        for (const name in Game.spawns) {
            renderSpawningName(Game.spawns[name]);
        }
    }
}

export function getCreepsByTypes(): CreepsByTypes {
    const creepsByTypes: { [creepType in CreepType]: Creep[] } = {
        harvester: [],
        upgrader: [],
        builder: [],
        repairer: [],
    };

    return creepsByTypes;
}

export function runCreepsTasks(): void {
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        tickCreepTask(creep);

        if (!isCreepBusy)
            if (Game.flags.AFK !== undefined)
                expect(
                    creep.moveTo(Game.flags.AFK, {
                        visualizePathStyle: { stroke: HexColors.red },
                    }),
                ).in([OK, ERR_BUSY, ERR_TIRED]);
    }
}

export function keepPopulation(creepsByTypes: CreepsByTypes) {
    let isSpawned = false;
    if (creepsByTypes.harvester.length < 3) {
        isSpawned = spawnCreep("harvester") === OK;
    } else if (creepsByTypes.repairer.length < 2) {
        isSpawned = spawnCreep("repairer") === OK;
    } else if (creepsByTypes.upgrader.length < 2) {
        isSpawned = spawnCreep("upgrader") === OK;
    } else if (creepsByTypes.builder.length < 4) {
        isSpawned = spawnCreep("builder") === OK;
    }
}
