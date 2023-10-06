import { LogLevel } from "./enums";

declare global {
    type CreepType = "harvester" | "upgrader" | "builder" | "repairer";
    type LogLevelStrings = keyof typeof LogLevel;

    interface Memory {
        maxHp?: number;
        logLevel?: LogLevelStrings;
    }

    interface CreepMemory {
        role: CreepType;
    }

    interface BuilderCreep extends Creep {
        memory: CreepMemory & {
            role: "builder";
            building: boolean;
        };
    }

    interface RepairerCreep extends Creep {
        memory: CreepMemory & {
            role: "repairer";
            repairing: boolean;
        };
    }

    interface UpgraderCreep extends Creep {
        memory: CreepMemory & {
            role: "upgrader";
            upgrading: boolean;
        };
    }
}

export {};
