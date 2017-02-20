import { ENV, CLI, loadConfig } from '../lib';

export class CliTest1 {
	@CLI('PATH')
	@ENV('PATH')
	path: string;

	@CLI('x', 'number')
	x: number;

	@CLI('booltrue', 'boolean', true)
	boolTrue: boolean;

	@CLI('boolfalse', 'boolean')
	boolFalse = false;
}

try {
	const config = loadConfig(CliTest1);
	process.send({ config });
}
catch (err) {
	console.log(err);
	process.send({ err });
}
