# Config Decorators

This is a configuration helper library that enables the efficient management of
default dev settings and prod settings from environment variables. Useful for separating
dev and prod environments, dockerization, etc.


## Install

`npm i config-decorators -S`


## Usage

- Create a class with the config props
  - Use inline settings for default values
  - Use the `ENV` or `CLI` decorator to define overrides if the ENV variable / CLI argument is available
- Instantiate the class with the `loadConfig` call
  - You CAN instantiate the same class more than once
  - You CAN create several classes with various decorators

Aaand... Done!

**Config class**

```
import { loadConfig, ENV } from './config-decorators';

export class Config {
	@ENV('MONGO_URL')
	mongoUrl = 'mongodb://localhost/test2';

	// Use it with a transform function
	@ENV('SERVER_PORT', parseInt)
	port = 8080;

	// Or use the 'number' shortcut
	@ENV('SERVER_PORT_2', 'number')
	@CLI('port2')
	port2 = 8081;

	// Rules for boolean values:
	// '0', '', 'false' will be parsed as `false`.
	// Everything else will be `true`.
	@ENV('ENABLE_AUTH', 'boolean')
	@CLI('enable-auth')
	enableAuth = true;
}

export const config = loadConfig(Config);
```

**Import**

```
import * as mongoose from 'mongoose';
import { config } from './config';

mongoose.connect(config.mongoUrl);
```


### CLI variables

Note that CLI has higher priority than ENV. `test.js`:

```
class CliTest1 {
	@CLI('PATH')
	@ENV('PATH')
	path: string;
}
const config = loadConfig(CliTest1);
console.log(config.path);
```

When calling `node test.js --PATH test` will print `test`, not the PATH environmental variable.


### Required variables

The ENV/CLI variable can be required; `loadConfig` will throw an error if there's no such ENV variable and no CLI argument.
Note that NOT the class decorators but the `loadConfig` throws the error.

```
export class Config {
	@ENV('MONGO_URL', true)
	mongoUrl: string;

	@ENV('SERVER_PORT', parseInt, true)
	port: number;
}

// Here comes the error
export const config = loadConfig(Config);
```


### How does it work?

The main stuff is at `loadConfig`:

- First, it instantiates your class
- Then it checks each prop having `ENV` or `CLI` decorators
	- If there's no ENV/CLI variable with the given name then steps to next prop
	- If there's a given transformator then the value is transformed
	- Overrides the value of the prop


## Tests

- Clone the repo
- `npm i`
- `npm run build` -- You should have `tsc` (TypeScript) in your PATH
- `npm run test`

Tested on Node.js with TypeScript (2.1.4+) classes, ES6 build.


## Further Dev Plans -- NOT READY YET

Create an issue if you need something.

**Validation**

```
	@ENV('SERVER_PORT', parseInt)
	@Validate(value => value > 1000)
	port = 8080;
```

**Print help**

```
if (config.help) {
	printHelp(ConfigClass1, ConfigClass2); // <- here
	return;
}
```

**Wider interface to minimist, e.g. aliases**
