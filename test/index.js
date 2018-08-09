const chai   = require('chai');
const chalk = require('chalk');
const should = chai.should();

const Calc   = require('../lib/calculate');
const Driver = require('../lib/driver');
const Trip   = require('../lib/trip');
const _      = require('underscore');
const prompt = require('prompt');
const data   = require('./data.json');


describe('Trip', function() {
    it ('Input validation', () => {

        let input = data.input;

        let errors = {
            expected: _.pluck(input, 'error'),
            actual: input.map((item) => Trip.validate(item).error)
        };

        errors.expected.join(',').should.equal(errors.actual.join(','));
    });

    it ('Velocity calculation', () => {

        let input = data.trips;

        let speeds = {
            expected: _.pluck(input, 'speed'),
            actual: input.map((item) => Calc.velocity(item).speed)
        };

        let durations = {
            expected: _.pluck(input, 'duration'),
            actual: input.map((item) => Calc.velocity(item).duration)
        };

        speeds.expected.join(',').should.equal(speeds.actual.join(','));
        durations.expected.join(',').should.equal(durations.actual.join(','));
    });
});
