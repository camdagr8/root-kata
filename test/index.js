const chai   = require('chai');
const chalk = require('chalk');
const should = chai.should();

const Calc   = require('../lib/calculate');
const Driver = require('../lib/driver');
const Trip   = require('../lib/trip');
const prompt = require('prompt');


describe('Trip', function() {
    it ('Input validation', () => {

        let name = 'Paul';
        let start = '05:00';
        let end = '06:00';
        let distance = 60;

        let validate = Trip.validate({ name, start, end, distance });

        validate.should.not.equal(false);
    });

    it ('Velocity calculation', () => {
        let result = Calc.velocity({start: '00:00', end: '01:00', distance: 60});

        let { speed, duration } = result;

        speed.should.equal(60);
        duration.should.equal(1);
    });
});
