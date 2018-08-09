
const chalk = require('chalk');

module.exports = (params) => {
    let {
        input,
        action  = '',
        color   = 'cyan',
        error   = false,
        message = '',
        prefix  = ' ::'
    } = params;

    action  = (error === true) ? 'Error' : action;
    color   = (error === true) ? 'red' : color;

    let clr = chalk[color];
    input   = (input) ? clr(input) : input;

    message = message.replace(/%s/gi, input);

    console.log(prefix, clr(`${action}`), message);
};
