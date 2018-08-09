/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const msg        = require('../models/messages');
const trips      = require('../store/trips');
const updateJSON = require('./jsonWriter');
const Calc       = require('./calculate');
const Driver     = require('./driver');
const output     = require('./output');
const op         = require('object-path');
const _          = require('underscore');
const beautify   = require('beautify');
const moment     = require('moment');
const prompt     = require('prompt');
const chalk      = require('chalk');
const slug       = require('slug');



/**
 * -----------------------------------------------------------------------------
 * Trip module
 * @description
 * Functions for creating trips.
 * -----------------------------------------------------------------------------
 */
const Trip = {

    validate: ({ name, start, end, distance }) => {

        // Got name?
        if (!name) {
            output({
                error   : true,
                message : msg.error[2],
            });
            console.log(' ');
            return;
        }

        // Time expression
        let time = new RegExp(/^([0-1]?[0-9]|[2][0-3]):([0-5][0-9])?$/);
        let hour = new RegExp(/^[1-9]$/);

        // Valid start time?
        if (time.test(start) !== true) {
            output({
                error: true,
                input: start,
                message: msg.error[4]
            });
            console.log(' ');
            return false;
        }

        // Valid end time?
        if (time.test(end) !== true) {
            output({
                error: true,
                input: end,
                message: msg.error[5]
            });
            console.log(' ');
            return false;
        }

        // Validate end time is after start time.
        let s = Number(start.split(':').shift());
        start = (hour.test(s)) ? '0'+start : start;

        let e = Number(end.split(':').shift());
        end = (hour.test(e)) ? '0'+end : end;

        let stime = moment(start, 'HH:mm');
        let etime = moment(end, 'HH:mm');

        if (etime.diff(stime) < 0) {
            output({
                error: true,
                input: distance,
                message: msg.error[7]
            });
            console.log(' ');
            return false;
        }

        // Valid distance?
        if (isNaN(distance)) {
            output({
                error: true,
                input: distance,
                message: msg.error[6]
            });
            console.log(' ');
            return false;
        }

        return { name, start, end, distance };
    },

    create: (name, start, end, distance) => {
        console.log(' ');

        let valid = Trip.validate({ name, start, end, distance });

        if (valid === false) { return; }

        start = valid.start;
        end   = valid.end;

        let velocity = Calc.velocity({ start, end, distance });

        let prop = slug(name, '_').toLowerCase();
        let data = Object.assign({}, trips);

        data[prop] = data[prop] || [];
        data[prop].push({ start, end, distance, ...velocity });

        let filePath = updateJSON(data, '/store/trips.json');

        output({
            action  : 'Updated',
            message : filePath
        });

        output({
            action : 'Created',
            input: '\n\n'+beautify(JSON.stringify({ name, start, end, distance }), {format: 'json'}),
            message: msg.success[2],
        });

        console.log(' ');
    },

    report: (name) => {
        console.log(' ');

        let names = (typeof name === 'string') ? [name] : name;
            names = (!name) ? Object.keys(trips) : name;

        let results = [];

        names.forEach((name) => {
            let prop = slug(name, '_').toLowerCase();
            let items = trips[prop] || [];

            let result = Calc.average(items) || {};
            result['name'] = prop;

            results.push(result);

        });

        results = _.sortBy(results, 'miles');
        results.reverse();

        results.forEach((result) => {
            let { miles = 0, velocity, name } = result;

            let report =  (miles === 0)
                ? `${name}: 0 miles`
                : `${chalk.cyan(name)}: ${chalk.blue(miles)} miles @ ${chalk.blue(velocity)} mph`;

            output({
                message: report
            });
        });

        console.log(' ');
    }
}



module.exports = Trip;
