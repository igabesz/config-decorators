import { loadConfig } from '../index';
import * as assert from 'assert';


let ConfigClass: any;
let configInstance: any;


describe('Environment', () => {
	it('should have PATH as ENV variable', () => {
		assert.equal(typeof process.env.PATH, 'string', 'The PATH variable is not found among ENV variables.');
		assert.notEqual(process.env.PATH.length, 0, 'The PATH environmental variable has 0 length');
	});
});

describe('Basics', () => {
	it('should not fail creating the class', () => {
		ConfigClass = require('./BasicConfig').BasicConfig;
	});

	it('should instantiate the class properly',  () => {
		configInstance = loadConfig(ConfigClass);
	});

	it('should have non-null PATH length', () => {
		assert.equal(typeof configInstance.path, 'string');
		assert.notEqual(configInstance.path.length, 0);
	});
});

describe('Transform', () => {
	it('should not fail creating the class (transformed)', () => {
		ConfigClass = require('./TransformConfig').TransformConfig;
	});

	it('should instantiate the class properly (transformed)',  () => {
		configInstance = loadConfig(ConfigClass);
	});

	it('should have non-null PATH length (transformed)', () => {
		assert.equal(typeof configInstance.pathLength, 'number');
		assert.notEqual(configInstance.pathLength.length, 0);
	});
});
