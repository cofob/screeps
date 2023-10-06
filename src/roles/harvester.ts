import { HexColors } from "../enums";
import { expect } from "../jestLikeIfs";
import { isEmptySpace } from "../utils";

class HarvestingLogic {
    creep: Creep;
    constructor(creep: Creep) {
        this.creep = creep;
    }

    public run(): void {
        const foundDroppedResources = this.tryToHarvestDroppedResources();
        if (foundDroppedResources) return;
        // all ruins were harvested
        // const foundUnharvestedRuins = this.tryToHarvestFromRuins();
        // if (foundUnharvestedRuins) return;
        this.harvestFromSources();
    }

    /** @return is found dropped resources **/
    private tryToHarvestDroppedResources(): boolean {
        const drop = this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (drop === null) return false;

        const pickupAnswer = expect(this.creep.pickup(drop)).in([
            OK,
            ERR_BUSY,
            ERR_NOT_IN_RANGE,
        ]);

        if (pickupAnswer === ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(drop, {
                    visualizePathStyle: { stroke: HexColors.orange },
                })
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
        return true;
    }

    /** @return is found ruins **/
    // private tryToHarvestFromRuins(): boolean {
    //     const ruins = this.creep.room.find(FIND_RUINS, {
    //         filter: (ruin) => ruin.store.getUsedCapacity() > 0,
    //     });
    //     if (ruins.length === 0) return false;

    //     const withdrawAnswer = expect(
    //         this.creep.withdraw(ruins[0], RESOURCE_ENERGY)
    //     ).in([OK, ERR_BUSY, ERR_NOT_IN_RANGE, ERR_NO_PATH]);
    //     if (withdrawAnswer === ERR_NOT_IN_RANGE) {
    //         expect(
    //             this.creep.moveTo(ruins[0], {
    //                 visualizePathStyle: { stroke: HexColors.orange },
    //             })
    //         ).in([OK, ERR_BUSY, ERR_TIRED]);
    //     }
    //     return true;
    // }

    private harvestFromSources(): void {
        const sources = this.creep.pos.findClosestByPath(FIND_SOURCES);
        if (sources === null) return; // no path?; probably temparary

        const harvestAnswer = expect(this.creep.harvest(sources)).in([
            OK,
            ERR_NOT_IN_RANGE,
        ]);
        if (harvestAnswer === ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(sources, {
                    visualizePathStyle: { stroke: HexColors.orange },
                })
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
    }
}

class TransferingEnergyLogic {
    creep: Creep;
    constructor(creep: Creep) {
        this.creep = creep;
    }

    public transfer(): void {
        for (const structureType of [
            STRUCTURE_TOWER,
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
        ]) {
            const targets = this.findStructures(structureType);

            if (targets.length === 0) continue;

            this.transferEnergyTo(targets[0]);
            break;
        }
    }

    private findStructures(
        structureType: STRUCTURE_TOWER | STRUCTURE_SPAWN | STRUCTURE_EXTENSION
    ): AnyStructure[] {
        return this.creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    structure.structureType === structureType &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            },
        });
    }

    private transferEnergyTo(target: AnyStructure): void {
        const transferResult = expect(
            this.creep.transfer(target, RESOURCE_ENERGY)
        ).in([OK, ERR_NOT_IN_RANGE, ERR_NO_PATH]);

        if (transferResult == ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(target, {
                    visualizePathStyle: { stroke: HexColors.white },
                })
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }
    }
}

export default function runHarvesterLogic(creep: Creep): void {
    if (isEmptySpace(creep)) {
        new HarvestingLogic(creep).run();
    } else {
        new TransferingEnergyLogic(creep).transfer();
    }
}
