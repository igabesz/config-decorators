# Config Decorators

This is a configuration helper library that enables the efficient management of
default dev settings and prod settings from environment variables. Useful for separating
dev and prod environments, dockerization, etc.

## Install

`npm i config-decorators -S`


## Usage

- Create a class with the config props
  - Use inline settings for default values
  - Use the `ENV` decorator to define overrides if the ENV variable is available
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
}

export const config = loadConfig(Config);
```

**Import**

```
import * as mongoose from 'mongoose';
import { config } from './config';

mongoose.connect(config.mongoUrl);
```

### How does it work?

The main stuff is at `loadConfig`:

- First, it instantiates your class
- Then it checks each prop having `ENV` decorators
	- If there's no ENV variable with the given name then steps to next prop
	- If there's a given transformator then the ENV variable is transformed
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

**CLI Parse**

```
	@ENV('SERVER_PORT', parseInt)
	@CLI('port') // or something like this to parse `node app.js --port 8081`
	port = 8080;
```
