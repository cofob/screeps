import { BaseTask } from "./base";
import { HarvestTask } from "./harvest";

export const taskNameToClass: { [taskName: string]: typeof BaseTask } = {
    harvest: HarvestTask,
};

export { HarvestTask };
