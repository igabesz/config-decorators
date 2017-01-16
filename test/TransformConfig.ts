import { ENV } from '../lib';


export class TransformConfig {
	@ENV('PATH', (path: string) => path.length)
	pathLength = 0;
};
