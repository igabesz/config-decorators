import { ENV } from '../lib';

export class BasicConfig {
	@ENV('PATH')
	path = '';

	@ENV('YOU_PROBABLY_DONT_HAVE_THIS')
	wontTouchThis = 'wontTouchThis';
};
