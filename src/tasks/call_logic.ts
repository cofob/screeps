import Logger from "$src/logging";
import { taskNameToClass } from "./index";

const logger = new Logger("tasks.call_logic");

/**
 * Spawns a task for a creep.
 *
 * If the creep already has a task, it will be deleted.
 */
export function spawnTask(creep: Creep, task: Task): void {
    if (creep.memory.task) {
        delete creep.memory.task;
    }
    creep.memory.task = {
        name: task.name,
        state: task.state,
    } as TaskMemoryState;
    logger.debug(`Spawned task: ${task.name}`);
}

/**
 * Takes a creep and runs its task.
 */
export function tickCreepTask(creep: Creep): void {
    if (!creep.memory.task) {
        return;
    }
    let memory_state = creep.memory.task as TaskMemoryState;
    logger.debug(`Ticking task: ${memory_state.name}`);
    let task = new taskNameToClass[memory_state.name](creep, memory_state.state);
    task.tick();
}

/**
 * Checks if a creep is busy (i.e has a task).
 */
export function isCreepBusy(creep: Creep): boolean {
    return !!creep.memory.task;
}
