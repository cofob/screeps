import { expect } from "./jestLikeIfs";
import Logger from "./logging";

const logger = new Logger("utils");

const bodyByRole: { [creepRole in CreepType]: BodyPartConstant[] } = {
    harvester: [WORK, CARRY, MOVE, MOVE],
    upgrader: [WORK, CARRY, CARRY, MOVE, MOVE],
    builder: [WORK, CARRY, MOVE, MOVE],
    repairer: [WORK, WORK, CARRY, MOVE, MOVE],
};

export function spawnCreep(role: CreepType): OK | ERR_BUSY | ERR_NOT_ENOUGH_ENERGY | ERR_NOT_ENOUGH_EXTENSIONS {
    const answer = Game.spawns["Spawn1"].spawnCreep(bodyByRole[role], role + Game.time, {
        memory: { role: role },
    });
    if (answer === OK) logger.info("Spawning new creep: " + role);
    return expect(answer).in([OK, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, ERR_NOT_ENOUGH_EXTENSIONS]);
}

export function isEmptySpace(creep: Creep): boolean {
    return creep.store.getFreeCapacity() > 0;
}
