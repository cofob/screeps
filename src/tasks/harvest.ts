import { HexColors } from "$src/enums";
import { expect } from "$src/jestLikeIfs";
import { isEmptySpace } from "$src/utils";
import { BaseTask } from "./base";

type ItemToHarvest = Resource | Ruin | Source;

interface HarvestTaskState {
    task: "harvesting" | "transfering";
    toHarvest?: ItemToHarvest;
}

export class HarvestTask extends BaseTask {
    name = "harvest";
    bodyRequirements: BodyPartConstant[] = ["move", "work", "carry"];
    state: HarvestTaskState;

    constructor(creep: Creep, state?: HarvestTaskState) {
        super(creep, state);
    }

    emptyState(): void {
        this.state = {
            task: isEmptySpace(this.creep) ? "harvesting" : "transfering",
        };
    }

    tick(): OK | FINISHED {
        if (this.state.task === "harvesting") this.runHarvesting();
        else this.runTransfering();
        return FINISHED;
    }

    private runHarvesting() {
        if (this.state.toHarvest === undefined) {
            const toHarvest = this.findSomethingToHarvest();
            this.state.toHarvest = toHarvest;
        }
        this.harvest(this.state.toHarvest);
    }

    private findSomethingToHarvest(): ItemToHarvest {
        const droppedResource = this.findDroppedResources();
        if (droppedResource) return droppedResource;
        const unharvestedRuins = this.findRuins();
        if (unharvestedRuins) return unharvestedRuins;
        return this.findSources();
    }

    private findDroppedResources(): Resource<ResourceConstant> | null {
        return this.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    }

    private findRuins(): Ruin | null {
        if (!Memory.enableRuinsHarvesting) return null;

        const ruins = this.creep.room.find(FIND_RUINS, {
            filter: ruin => ruin.store.getUsedCapacity() > 0,
        });
        if (ruins.length === 0) return null;
        return ruins[0];
    }

    private findSources(): Source | null {
        return this.creep.pos.findClosestByPath(FIND_SOURCES);
    }

    private harvest(toHarvest: ItemToHarvest): void {
        let clearState = false;
        if ("resourceType" in toHarvest) {
            clearState = this.harvestDrop(toHarvest);
        } else if ("destroyTime" in toHarvest) {
            clearState = this.harvestRuin(toHarvest);
        } else {
            clearState = this.harvestSource(toHarvest);
        }
    }

    /** @returns whether to remove state **/
    private harvestDrop(drop: Resource<ResourceConstant>): boolean {
        const pickupAnswer = expect(this.creep.pickup(drop)).in([OK, ERR_BUSY, ERR_NOT_IN_RANGE]);

        if (pickupAnswer === ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(drop, {
                    visualizePathStyle: { stroke: HexColors.orange },
                }),
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }

        return pickupAnswer === OK;
    }

    /** @returns whether to remove state **/
    private harvestRuin(ruin: Ruin): boolean {
        const withdrawAnswer = expect(this.creep.withdraw(ruin, RESOURCE_ENERGY)).in([
            OK,
            ERR_BUSY,
            ERR_NOT_IN_RANGE,
            ERR_NO_PATH,
        ]);

        if (withdrawAnswer === ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(ruin, {
                    visualizePathStyle: { stroke: HexColors.orange },
                }),
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }

        return withdrawAnswer === OK;
    }

    /** @returns whether to remove state **/
    private harvestSource(source: Source): boolean {
        const harvestAnswer = expect(this.creep.harvest(source)).in([OK, ERR_NOT_IN_RANGE]);
        if (harvestAnswer === ERR_NOT_IN_RANGE) {
            expect(
                this.creep.moveTo(source, {
                    visualizePathStyle: { stroke: HexColors.orange },
                }),
            ).in([OK, ERR_BUSY, ERR_TIRED]);
        }

        return harvestAnswer === OK;
    }
}
