const moment = require('moment');
const _ = require('underscore');

const Calc = {
    velocity: ({ start, end, distance }) => {
        let stime    = moment(start, 'HH:mm');
        let etime    = moment(end, 'HH:mm');
        let duration = etime.diff(stime, 'hours', true);
        let speed    = Math.round(Math.round(Number(distance)) / duration);

        return { speed, duration };
    },
    average: (items) => {

        // Filter bad speeds
        items = items.filter((item) => {
            let { speed } = item;
            return (speed <= 100 && speed >= 5);
        });

        let distances = _.pluck(items, 'distance').map(item => Number(item));

        let miles = distances.reduce((total, distance) => {
            return total + Number(Math.round(distance));
        }, 0);

        let duration = _.pluck(items, 'duration').reduce((total, duration) => {
            return total + Number(duration);
        }, 0);

        let velocity = Math.round(miles/duration);

        return { miles, velocity };
    }
};

module.exports = Calc;
