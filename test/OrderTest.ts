import { ENV, CLI, loadConfig } from '../lib';


export class OrderTest {
	/** This should be set from ENV only */
	@ENV('ORDER_TEST_1')
	@CLI('order-test-1')
	orderTest1 = 'unset';

	/** This should be set from CLI only */
	@ENV('ORDER_TEST_2')
	@CLI('order-test-2')
	orderTest2 = 'unset';

	/** This should be set from both CLI and ENV */
	@ENV('ORDER_TEST_3')
	@CLI('order-test-3')
	orderTest3 = 'unset';
}

process.env.ORDER_TEST_1 = 'env';
process.env.ORDER_TEST_3 = 'env';

try {
	const config = loadConfig(OrderTest);
	process.send({ config });
}
catch (err) {
	console.log(err);
	process.send({ err });
}
