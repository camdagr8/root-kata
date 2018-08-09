
/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const msg        = require('../models/messages');
const trips      = require('../store/trips');
const updateJSON = require('./jsonWriter');
const output     = require('./output');
const op         = require('object-path');
const beautify   = require('js-beautify');
const prompt     = require('prompt');
const chalk      = require('chalk');
const slug       = require('slugify');



/**
 * -----------------------------------------------------------------------------
 * Driver module
 * @description
 * Functions for creating, reading, updating and deleting driver data.
 * -----------------------------------------------------------------------------
 */
const Driver = {

    init: (name, params) => {

        if (params['list'] === true) {
            Driver.read(name);
            return;
        }

        if (typeof params['rename'] === 'string') {
            Driver.update({ oldName: name, newName: params.rename });
            return;
        }

        if (params['delete'] === true) {
            Driver.delete(name);
            return;
        }

        Driver.create({ name, params });
    },

    exists: (name) => {
        let prop = slug(name, '_').toLowerCase();
        return op.has(trips, prop);
    },

    create: ({ name, params = {} }) => {

        console.log(' ');

        if (!name) {
            output({
                error   : true,
                message : msg.error[2],
            });
            console.log(' ');
            return;
        }

        let { overwrite = false } = params;

        if (Driver.exists(name) && overwrite !== true) {
            output({
                error   : true,
                input   : name,
                message : msg.error[1],
            });
            console.log(' ');
            return;
        }

        let prop = slug(name, '_').toLowerCase();
        let data = Object.assign({}, trips);
        data[prop] = [];

        let filePath = updateJSON(data, '/store/trips.json');

        output({
            action  : 'Updated',
            message : filePath
        });

        let action = (overwrite === true)
            ? 'Replaced'
            : 'Created';

        output({
            action,
            input   : name,
            message : msg.success[1]
        });

        console.log(' ');
        return data;
    },

    read: (name) => {
        console.log(' ');

        if (!name) {
            output({
                action  : 'Drivers:',
                error   : false,
                message : Object.keys(trips).join(', '),
            });
            console.log(' ');
            return;
        }

        if (!Driver.exists(name)) {

            output({
                error   : true,
                input   : name,
                message : msg.error[3],
            });
            console.log(' ');
            return;
        }

        let prop = slug(name, '_').toLowerCase();

        console.log(
            beautify(
                JSON.stringify(trips[prop]),
                {indent_size: 2}
            )
        );

        console.log(' ');
    },

    update: ({ oldName, newName }) => {
        console.log(' ');

        if (!oldName) {
            output({
                error   : true,
                message : msg.error[2],
            });
            console.log(' ');
            return;
        }

        if (!Driver.exists(oldName)) {
            output({
                error   : true,
                input   : oldName,
                message : msg.error[3],
            });
            console.log(' ');
            return;
        }

        let propOld = slug(oldName, '_').toLowerCase();
        let propNew = slug(newName, '_').toLowerCase();
        let data    = Object.assign({}, trips);

        data[propNew] = data[propOld];

        delete data[propOld];

        let filePath = updateJSON(data, '/store/trips.json');

        output({
            action  : 'Updated',
            message : filePath
        });

        output({
            action  : 'Renamed',
            input   : `${oldName} to ${newName}`,
            message : msg.success[1]
        });

        console.log(' ');
    },

    delete: (name) => {
        console.log(' ');

        if (!name) {
            output({
                error   : true,
                message : msg.error[2],
            });
            console.log(' ');
            return;
        }

        if (!Driver.exists(name)) {
            output({
                error   : true,
                input   : name,
                message : msg.error[3],
            });
            console.log(' ');
            return;
        }

        let prop = slug(name, '_').toLowerCase();

        let schema = {
            properties: {
                confirm: {
                    require     : true,
                    type        : 'string',
                    default     : 'N',
                    pattern     : /^(?:Y|N|Yes|No)$/gi,
                    description : chalk.yellow('Deleting a Driver can not be undone. Are you sure? (Y/N):'),
                    message     : 'Confirm delete',
                }
            }
        };

        prompt.message   = '  >';
        prompt.delimiter = ' ';
        prompt.start();
        prompt.get(schema, (err, result) => {
            if (err) { return; }

            let { confirm } = result;
            confirm = confirm.substr(0, 1).toLowerCase();

            if (confirm === 'y') {
                console.log(' ');

                let data = Object.assign({}, trips);
                delete data[prop];

                let filePath = updateJSON(data, '/store/trips.json');

                output({
                    action  : 'Updated',
                    message : filePath
                });

                output({
                    action  : 'Deleted',
                    color   : 'red',
                    input   : name,
                    message : msg.success[1]
                });
            }

            console.log(' ');
        });
    }

};

module.exports = Driver;
