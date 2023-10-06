import Logger from "./logging";
import { ErrorMapper } from "./errorMapper";

const logger = new Logger("jestLikeIfs");

const numbersToNames: { [key: number]: string } = {
    0: "OK",
    1: "ERR_NOT_OWNER",
    2: "ERR_NO_PATH",
    3: "ERR_NAME_EXISTS",
    4: "ERR_BUSY",
    5: "ERR_NOT_FOUND",
    6: "ERR_NOT_ENOUGH_RESOURCES_OR_ENERGY_OR_EXTENSIONS",
    7: "ERR_INVALID_TARGET",
    8: "ERR_FULL",
    9: "ERR_NOT_IN_RANGE",
    10: "ERR_INVALID_ARGS",
    11: "ERR_TIRED",
    12: "ERR_NO_BODYPART",
    14: "ERR_RCL_NOT_ENOUGH",
    15: "ERR_GCL_NOT_ENOUGH",
};

function formatName(name: number): string {
    if (name < 0) name *= -1;

    const formatted = numbersToNames[name];
    if (formatted !== undefined) return formatted;
    else {
        logger.warn("unknown answer: " + name);
        return name.toString();
    }
}

function throwError(actual: unknown, expected: unknown): void {
    logger.debug(`actual expected ${actual} ${expected}`);

    ErrorMapper.wrapLoop(() => {
        throw new Error(
            `Got unexpected answer (${formatName(actual as number)} !== ${(expected as number[]).map(formatName)})`,
        );
    })();
}

export function expect(value: any) {
    return {
        toBe<T>(expected: T): T {
            if (value !== expected) {
                throwError(value, expected);
            }
            return value;
        },
        in<T>(expected: T[]): T {
            if (!expected.includes(value)) {
                throwError(value, expected);
            }
            return value;
        },
    };
}
