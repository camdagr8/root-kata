/**
 * Manual test to see if a Driver exists
 */

const chalk = require('chalk');
const Driver = require('../lib/driver');
const prompt = require('prompt');

let schema = {
    properties: {
        name: {
            require     : true,
            type        : 'string',
            description : chalk.yellow('Driver Name:'),
            message     : 'Enter Driver Name',
        }
    }
};

prompt.message   = '  >';
prompt.delimiter = ' ';
prompt.start();
prompt.get(schema, (err, result) => {
    let { name } = result;

    let exists  = Driver.exists(name);
    let color   = (exists === true) ? 'cyan' : 'red';
    let outcome = (exists === true)
        ? 'exists!'
        : 'does not exists.';

    console.log(`\n  ::  ${chalk[color](name)} ${outcome}\n`);
});
