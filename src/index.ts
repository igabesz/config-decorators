import * as parseArgs from 'minimist';


interface IConfigMeta {
	name: string;
	env?: string;
	cli?: string;
	required?: boolean;
	transform?: (envVariable: string) => any;
}


export type PropertyAnnotation = (target: { constructor: any }, paramName: string) => void;

export interface ENV {
	(envVarName: string): PropertyAnnotation;
	(envVarName: string, required: boolean): PropertyAnnotation;
	(envVarName: string, type: 'number' | 'boolean'): PropertyAnnotation;
	(envVarName: string, type: 'number' | 'boolean', required: boolean): PropertyAnnotation;
	(envVarName: string, transform: (envVariable: string) => any): PropertyAnnotation;
	(envVarName: string, transform: (envVariable: string) => any, required: boolean): PropertyAnnotation;
}
export function ENV(envVarName: string, param2?: ((envVariable: string) => any) | boolean | 'number' | 'boolean', param3?: boolean) {
	return createDecorator(envVarName, undefined, param2, param3);
}

export interface CLI {
	(cliVarName: string): PropertyAnnotation;
	(cliVarName: string, required: boolean): PropertyAnnotation;
	(cliVarName: string, type: 'number' | 'boolean'): PropertyAnnotation;
	(cliVarName: string, type: 'number' | 'boolean', required: boolean): PropertyAnnotation;
	(cliVarName: string, transform: (envVariable: string) => any): PropertyAnnotation;
	(cliVarName: string, transform: (envVariable: string) => any, required: boolean): PropertyAnnotation;
}
export function CLI(cliVarName: string, param2?: ((envVariable: string) => any) | boolean | 'number' | 'boolean', param3?: boolean) {
	return createDecorator(undefined, cliVarName, param2, param3);
}

function parseBoolean(str: string) {
	str = str || '';
	if (['', '0', 'false'].indexOf(str.toString()) !== -1) { return false; }
	return true;
}

function createDecorator(
	env: string | undefined,
	cli: string | undefined,
	param2: ((envVariable: string) => any) | boolean | 'number' | 'boolean' | undefined,
	param3?: boolean | undefined,
) {
	let transform: (envVariable: string) => any | undefined = undefined;
	let required: boolean | undefined = undefined;
	if (param2 === 'number') transform = (str: string) => parseFloat(str);
	if (param2 === 'boolean') transform = (str: string) => parseBoolean(str);
	if (typeof param2 === 'function') transform = param2;
	if (typeof param2 === 'boolean') required = param2;
	if (typeof param3 === 'boolean') required = param3;

	return (target: { constructor: any }, paramName: string) => {
		let ctor = target.constructor as { __vars?: { [name: string]: IConfigMeta }};
		// Preparing
		ctor.__vars = ctor.__vars || {};
		ctor.__vars[paramName] = ctor.__vars[paramName] || <any>{};
		let meta = ctor.__vars[paramName];
		// Saving props
		meta.name = paramName;
		env && (meta.env = env);
		cli && (meta.cli = cli);
		required && (meta.required = required);
		transform && (meta.transform = transform);
	};
}

export function loadConfig<T>(Type: { new(): T }): T {
	let result = new Type();
	// WARNING: We don't see `__vars` externally on `Type`.
	return augmentInstance(Type as any, result);
}

function augmentInstance(Type: { __vars?: { [name: string]: IConfigMeta }}, instance) {
	for (let name in Type.__vars || {}) {
		let configVar = Type.__vars[name];
		let hasValue = false;
		let value: any;
		// ENV: Lower priority
		if (configVar.env && configVar.env in process.env) {
			value = process.env[configVar.env];
			hasValue = true;
		}
		// CLI: Higher priority
		if (configVar.cli) {
			let args = parseArgs(process.argv);
			if (configVar.cli in args) {
				value = args[configVar.cli];
				hasValue = true;
			}
		}
		// No such env var
		if (!hasValue) {
			if (configVar.required) {
				let envText = configVar.env ? ` ENV=${configVar.env}` : '';
				let cliText = configVar.cli ? ` CLI=${configVar.cli}` : '';
				throw new Error(`Missing variable: ${configVar.name};${envText}${cliText}`);
			}
			else continue;
		}
		// Trying to transform
		if (configVar.transform) {
			try { value = configVar.transform(value); }
			catch (err) {
				let myErr = new Error(`Failed to transform property ${configVar.name} (value: ${value}), see 'innerError' for details.`);
				(myErr as any).innerError = err;
				throw myErr;
			}
		}
		instance[configVar.name] = value;
	}
	return instance;
}
