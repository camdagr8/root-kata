#!/usr/bin/env node


/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
const pkg     = require('./package.json');
const Driver  = require('./lib/driver');
const Trip    = require('./lib/trip');
const program = require('commander');



/**
 * -----------------------------------------------------------------------------
 * Version
 * -----------------------------------------------------------------------------
 */
program.version(pkg.version, '-v, --version');

/**
 * -----------------------------------------------------------------------------
 * Driver interface
 * -----------------------------------------------------------------------------
 */
program.command('Driver <name>')
    .description('Create, read, update, and delete drivers.')
    .option('-o, --overwrite [overwrite]', 'overwrite the driver record if it already exists.')
    .option('-r, --rename [rename]', 'rename a driver.')
    .option('-l, --list', 'get the driver trips.')
    .option('-d, --delete [remove]', 'delete a driver.')
    .action(Driver.init);

/**
 * -----------------------------------------------------------------------------
 * Trip interface
 * -----------------------------------------------------------------------------
 */
program.command('Trip <name> <start> <end> <distance>')
    .description('Create a new trip.')
    .action(Trip.create);

program.command('Report [name]')
    .description('Get a report of speed and miles. Leaving the [name] blank will return a report for all Drivers.')
    .action(Trip.report);

/**
 * -----------------------------------------------------------------------------
 * Parse arguments
 * -----------------------------------------------------------------------------
 */
program.parse(process.argv);

// output the help if nothing is passed
if (!process.argv.slice(2).length) {
    program.help();
}
