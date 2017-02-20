import * as child_process from 'child_process';
import { loadConfig } from '../lib';
import { assert } from 'chai';
import { BasicConfig } from './BasicConfig';
import { TransformConfig } from './TransformConfig';
import { RequiredConfigA, RequiredConfigB, RequiredSuccess } from './RequiredConfig';
import { CliTest1 } from './cli-test1';


let ConfigClass: any;


describe('Environment', () => {
	it('should have PATH as ENV variable', () => {
		assert.equal(typeof process.env.PATH, 'string', 'The PATH variable is not found among ENV variables.');
		assert.notEqual(process.env.PATH.length, 0, 'The PATH environmental variable has 0 length');
	});
});

describe('Basics', () => {
	let basicConfigInstance: BasicConfig;
	it('should not fail creating the class', () => {
		ConfigClass = require('./BasicConfig').BasicConfig;
	});

	it('should instantiate the class properly',  () => {
		basicConfigInstance = loadConfig(<typeof BasicConfig>ConfigClass);
	});

	it('should have non-null PATH length', () => {
		assert.equal(typeof basicConfigInstance.path, 'string');
		assert.equal(basicConfigInstance.wontTouchThis, 'wontTouchThis');
		assert.notEqual(basicConfigInstance.path.length, 0);
	});
});

describe('Transform', () => {
	let transformConfigInstance: TransformConfig;
	it('should not fail creating the class (transformed)', () => {
		ConfigClass = require('./TransformConfig').TransformConfig;
	});

	it('should instantiate the class properly (transformed)',  () => {
		transformConfigInstance = loadConfig(<typeof TransformConfig>ConfigClass);
	});

	it('should have non-null PATH length (transformed)', () => {
		assert.equal(typeof transformConfigInstance.pathLength, 'number');
		assert.notEqual(transformConfigInstance.pathLength, 0);
	});
});

describe('Required', () => {
	let classOk: typeof RequiredSuccess;
	let classA: typeof RequiredConfigA;
	let classB: typeof RequiredConfigB;

	it(`should import classes with 'required' params`, () => {
		classOk = require('./RequiredConfig').RequiredSuccess;
		assert.ok(classOk);
		classA = require('./RequiredConfig').RequiredConfigA;
		assert.ok(classA);
		classB = require('./RequiredConfig').RequiredConfigB;
		assert.ok(classB);
	});

	it('should parse PATH env var as required', () => {
		let instance = loadConfig(classOk);
		assert.isString(instance.path);
		assert.isNumber(instance.pathLength);
		assert.ok(instance.pathLength > 0);
	});

	it('should fail instantiating class with missing property, syntax #1', () => {
		assert.throws(() => {
			let cannotInstantiate = loadConfig(classA);
		});
	});

	it('should fail instantiating class with missing property, syntax #2', () => {
		assert.throws(() => {
			let cannotInstantiate = loadConfig(classB);
		});
	});
});

describe('CLI', () => {
	let gotMessage = false;
	let config: CliTest1;

	it('should execute child process with CLI arguments', async () => {
		let child = child_process.fork('test/cli-test1', ['--PATH', 'test', '-x42', '--booltrue']);
		await new Promise((resolve, reject) => {
			child.on('message', msg => {
				if (gotMessage) return;
				gotMessage = true;
				if (msg.err) return reject(msg.err);
				config = msg.config;
				return resolve(msg.config);
			});
			child.on('exit', () => {
				if (gotMessage) return;
				gotMessage = true;
				reject('Child proceess exited without message');
			});
			child.on('error', err => {
				console.log('error', err);
			});
		});
	});

	it('should prioritize CLI over ENV', () => {
		assert.ok(config);
		assert.equal(config.path, 'test');
	});

	it('should parse numbers', () => {
		assert.ok(config);
		assert.equal(config.x, 42);
	});

	it('should parse booleans', () => {
		assert.ok(config);
		assert.ok(config.boolTrue);
		assert.notOk(config.boolFalse);
	});
});
