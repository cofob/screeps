export class BaseTask implements Task {
    name: string;
    bodyRequirements: BodyPartConstant[];
    state: any;
    creep: Creep;
    tick(): OK | FINISHED {
        return OK;
    }

    constructor(creep: Creep, state: any) {
        let body_check = this.checkBodyRequirements(creep.body);
        if (body_check !== OK) {
            throw new Error(`Invalid creep body: ${body_check}`);
        }

        if (state !== undefined) {
            this.state = state;
        } else {
            this.emptyState();
        }
        this.creep = creep;
    }

    emptyState(): void {}

    private checkBodyRequirements(body: BodyPartConstant[] | BodyPartDefinition[]) {
        let body_parts: BodyPartConstant[] = [];
        if (typeof body[0] === "string") {
            body_parts = body as BodyPartConstant[];
        } else {
            for (let part of body as BodyPartDefinition[]) {
                body_parts.push(part.type);
            }
        }

        let failed = false;
        for (let part of this.bodyRequirements) {
            if (!body_parts.includes(part)) {
                failed = true;
                break;
            }
        }

        if (failed) return ERR_BODY_PARTS_MISMATCH;
        return OK;
    }
}
