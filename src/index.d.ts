import { LogLevel } from "./enums";

declare global {
    type FINISHED = -101;
    type ERR_BODY_PARTS_MISMATCH = -102;
    const FINISHED: FINISHED;
    const ERR_BODY_PARTS_MISMATCH: ERR_BODY_PARTS_MISMATCH;

    type CreepType = "harvester" | "upgrader" | "builder" | "repairer";
    type LogLevelStrings = keyof typeof LogLevel;

    interface RenderConfig {
        enableRender?: boolean;
        enableCreepNames?: boolean;
        enableSpawningNames?: boolean;
    }

    interface Memory {
        maxHp?: number;
        logLevel?: LogLevelStrings;
        enableRuinsHarvesting?: true;
        render?: RenderConfig;
    }

    interface CreepMemory {
        role: CreepType;
        task?: any;
    }
}

export {};
