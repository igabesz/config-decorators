import { loadConfig } from '../lib';
import { assert } from 'chai';
import { BasicConfig } from './BasicConfig';
import { TransformConfig } from './TransformConfig';
import { RequiredConfigA, RequiredConfigB, RequiredSuccess } from './RequiredConfig';


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
