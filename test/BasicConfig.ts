import { ENV } from '../lib';

export class BasicConfig {
	@ENV('PATH')
	path = '';

	@ENV('SOMETHING1_ENABLED', 'boolean')
	something1Enabled = true;

	@ENV('SOMETHING2_ENABLED', 'boolean')
	something2Enabled = true;

	@ENV('SOMETHING3_ENABLED', 'boolean')
	something3Enabled = true;

	@ENV('YOU_PROBABLY_DONT_HAVE_THIS')
	wontTouchThis = 'wontTouchThis';
};
