import { clearDeadBodies, towerControl, getCreepsByTypes, keepPopulation, renderUI, runCreepsTasks } from "./stages";
import Logger, { setLogLevel } from "./logging";
import { ErrorMapper } from "./errorMapper";

const logger = new Logger("main");

function main(): void {
    logger.debug(`Tick ${Game.time}`);

    if (Game.time % 60 === 0) {
        clearDeadBodies();
    }
    towerControl();
    const creepsByTypes = getCreepsByTypes();
    keepPopulation(creepsByTypes);
    runCreepsTasks();
    renderUI();
}

exports.loop = ErrorMapper.wrapLoop(main);
