interface IConfigMeta {
	name: string;
	env: string;
	required?: boolean;
	transform?: (envVariable: string) => any;
}


export type PropertyAnnotation = (target: { constructor: any }, paramName: string) => void;

export function ENV(envVarName: string): PropertyAnnotation;
export function ENV(envVarName: string, required: boolean): PropertyAnnotation;
export function ENV(envVarName: string, transform: (envVariable: string) => any): PropertyAnnotation;
export function ENV(envVarName: string, transform: (envVariable: string) => any, required: boolean): PropertyAnnotation;
export function ENV(envVarName: string, param2?: ((envVariable: string) => any) | boolean, param3?: boolean) {
	let transform: (envVariable: string) => any | undefined = undefined;
	let required: boolean | undefined = undefined;
	if (typeof param2 === 'function') transform = param2;
	if (typeof param2 === 'boolean') required = param2;
	if (typeof param3 === 'boolean') required = param3;

	return (target: { constructor: any }, paramName: string) => {
		let ctor = target.constructor as { __vars?: { [name: string]: IConfigMeta }};
		ctor.__vars = ctor.__vars || {};
		ctor.__vars[paramName] = {
			name: paramName,
			env: envVarName,
			required,
			transform,
		};
	};
}

export function loadConfig<T>(Type: { new(): T }): T {
	let result = new Type();
	return augmentInstance(Type, result);
}


function augmentInstance(Type: { __vars?: { [name: string]: IConfigMeta }}, instance) {
	for (let name in Type.__vars || {}) {
		let configVar = Type.__vars[name];
		let value: any = process.env[configVar.env];
		// No such env var
		if (value === undefined) {
			if (configVar.required) throw new Error('Missing ENV variable: ${configVar.env}');
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
