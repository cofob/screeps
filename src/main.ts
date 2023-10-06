import { clearDeadBodies, towerControl, getCreepsByTypesAndRunLogic, keepPopulation } from "./stages";
import Logger, { setLogLevel } from "./logging";

const logger = new Logger("main");

export function loop(): void {
    setLogLevel("DEBUG");
    logger.debug(`Tick ${Game.time}`);

    if (Game.time % 60 === 0) {
        clearDeadBodies();
    }
    towerControl();
    const creepsByTypes = getCreepsByTypesAndRunLogic();
    keepPopulation(creepsByTypes);
}
