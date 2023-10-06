import { CreepRole } from "$src/enums";
import Logger from "$src/logging";
import { BuilderRole, HarvesterRole, RepairerRole, UpgraderRole } from "./roles";

const logger = new Logger("creeps.creeps");

function formatCreepName(name: string) {
  return `${name}-${Game.time}`;
}

export const HarvesterCreep: CreepSpawn = {
  body: [WORK, CARRY, MOVE, MOVE],
  name: "Harvester",
  opts: { memory: { role: CreepRole.harvester } },
  getCreepName: () => formatCreepName("Harvester"),
  worker: new HarvesterRole(),
};

export const UpgraderCreep: CreepSpawn = {
  body: [WORK, CARRY, CARRY, MOVE, MOVE],
  name: "Upgrader",
  opts: { memory: { role: CreepRole.upgrader } },
  getCreepName: () => formatCreepName("Upgrader"),
  worker: new UpgraderRole(),
};

export const BuilderCreep: CreepSpawn = {
  body: [WORK, CARRY, MOVE, MOVE],
  name: "Builder",
  opts: { memory: { role: CreepRole.builder } },
  getCreepName: () => formatCreepName("Builder"),
  worker: new BuilderRole(),
};

export const RepairerCreep: CreepSpawn = {
  body: [WORK, WORK, CARRY, MOVE, MOVE],
  name: "Repairer",
  opts: { memory: { role: CreepRole.repairer } },
  getCreepName: () => formatCreepName("Repairer"),
  worker: new RepairerRole(),
};

export const roleToCreep = {
  harvester: HarvesterCreep,
  upgrader: UpgraderCreep,
  builder: BuilderCreep,
  repairer: RepairerCreep,
};

export function spawnCreep(world: string, creep_spawn: CreepSpawn): void {
  let name = creep_spawn.getCreepName();
  let result = Game.spawns[world].spawnCreep(creep_spawn.body, name, creep_spawn.opts);
  if (result === OK) {
    logger.info(`Spawning new creep: ${name}`);
  }
}
