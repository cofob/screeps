import { CreepRole, LogLevel } from "./enums";

declare global {
    interface CreepWorker {
        run(creep: Creep): void;
    }

    interface CreepSpawn {
        body: BodyPartConstant[];
        name: string;
        opts?: SpawnOptions;
        getCreepName(): string;
        worker: CreepWorker;
        ui_name?: string;
    }

    interface CreepMemory {
        role?: CreepRole;

        upgrading?: boolean;
        repairing?: boolean;
        building?: boolean;
    }

    interface Memory {
        MaxHp?: number;
        logLevel?: string;
    }

    type LogLevelStrings = keyof typeof LogLevel;
}

export {};
