import { ENV } from '../lib';

export class BasicConfig {
	@ENV('PATH')
	path = '';
};
