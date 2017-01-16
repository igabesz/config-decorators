import { ENV } from '../lib';


export class RequiredSuccess {
	@ENV('PATH', true)
	path: string;

	@ENV('PATH', path => path.length, true)
	pathLength: number;
}

export class RequiredConfigA {
	@ENV('IM_SURE_YOU_DONT_HAVE_THIS_ENV_VARIABLE', true)
	dummy: any;
}

export class RequiredConfigB {
	@ENV('IM_SURE_YOU_DONT_HAVE_THIS_ENV_VARIABLE', value => value, true)
	dummy: any;
}
