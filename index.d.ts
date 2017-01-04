export declare function ENV(envVarName: string, transform?: (envVariable: string) => any): (target: {
    constructor: any;
}, paramName: string) => void;
export declare function loadConfig<T>(Type: {
    new (): T;
}): T;
