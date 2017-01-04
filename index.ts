interface IConfigMeta {
	name: string;
	env: string;
	transform?: (envVariable: string) => any;
}

export function ENV(envVarName: string, transform?: (envVariable: string) => any) {
	return (target: { constructor: any }, paramName: string) => {
		let ctor = target.constructor as { __vars?: { [name: string]: IConfigMeta }};
		ctor.__vars = ctor.__vars || {};
		ctor.__vars[paramName] = {
			name: paramName,
			env: envVarName,
			transform: transform || null,
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
		if (value === undefined) continue;
		if (configVar.transform) {
			try { value = configVar.transform(value); }
			catch (err) { continue; }
		}
		instance[configVar.name] = value;
	}
	return instance;
}
