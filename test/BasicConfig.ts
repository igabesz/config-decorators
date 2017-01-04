import { ENV } from '../index';

export class BasicConfig {
	@ENV('PATH')
	path = '';
};
