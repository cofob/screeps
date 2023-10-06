interface TaskMemoryState {
    name: string;
    state: any;
}

interface Task {
    name: string;
    state: any;

    bodyRequirements: BodyPartConstant[];
    tick(): OK | FINISHED;
}
