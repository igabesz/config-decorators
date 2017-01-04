import { ENV } from '../index';

export class TransformConfig {
	@ENV('PATH', (path: string) => path.length)
	pathLength = 0;
};
