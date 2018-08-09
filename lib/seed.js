
const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const updateJSON = require('./jsonWriter');
const Trip = require('./trip');
const slug = require('slugify');
const output = require('./output');
const chalk = require('chalk');
const prompt     = require('prompt');


const Seed = {
    init: (file) => {
        console.log(' ');

        let schema = {
            properties: {
                confirm: {
                    require     : true,
                    type        : 'string',
                    default     : 'N',
                    pattern     : /^(?:Y|N|Yes|No)$/gi,
                    description : chalk.yellow('Seeding data will overwrite the existing driver store. Are you sure? (Y/N):'),
                    message     : 'Confirm Overwrite',
                }
            }
        };

        prompt.message   = '  >';
        prompt.delimiter = ' ';
        prompt.start();
        prompt.get(schema, (err, result) => {
            if (err) {
                console.log(' ');
                return;
            }

            let { confirm } = result;
            confirm = confirm.substr(0, 1).toLowerCase();

            if (confirm === 'y') {
                Seed.load(file);
            } else {
                console.log(' ');
            }
        });
    },

    load: (file = '/store/import.txt') => {
        let trips = {};
        let dir = process.cwd();
        let filePath = path.normalize(path.join(dir, file));

        let fileCont = fs.readFileSync(filePath).toString().match(/^.+$/gm);

        let cont = fileCont.map(
            item => _.object(
                ['type', 'name', 'start', 'end', 'distance'],
                item.split(' ')
            )
        );

        _.where(cont, {type: 'Driver'}).forEach((item) => {
            let { name } = item;
            let prop = slug(name, '_').toLowerCase();
            trips[prop] = trips[prop] || [];
        });

        _.where(cont, {type: 'Trip'}).forEach((item = {}) => {
            let { name, start, end, distance } = item;
            let prop = slug(name, '_').toLowerCase();

            trips[prop] = trips[prop] || [];
            trips[prop].push(Trip.create(name, start, end, distance, 'object'));
        });

        updateJSON(trips, '/store/trips.json');

        let results = Trip.report(null, 'object');

        console.log(' ');
        results.forEach((result) => {
            let { miles = 0, velocity, name } = result;

            let report =  (miles === 0)
                ? `${chalk.cyan(name)}: ${chalk.red('0')} miles`
                : `${chalk.cyan(name)}: ${chalk.blue(miles)} miles @ ${chalk.blue(velocity)} mph`;

            output({
                message: report
            });
        });
        console.log(' ');
    }
};

module.exports = Seed;
