const Influx = require('influx');
const os = require('os');
const si = require('systeminformation');


const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'express_response_db',
    schema: [{
            measurement: 'cpu_load',
            fields: {
                duration: Influx.FieldType.FLOAT
            },
            tags: [
                'host'
            ]
        },
        {
            measurement: 'ram_load',
            fields: {
                total: Influx.FieldType.INTEGER,
                free: Influx.FieldType.INTEGER,
                used: Influx.FieldType.INTEGER,
                percentage: Influx.FieldType.FLOAT
            },
            tags: [
                'host'
            ]
        }
    ]
});
influx.getDatabaseNames()
    .then(names => {
        if (!names.includes('express_response_db')) {
            return influx.createDatabase('express_response_db');
        }
    })
    .catch(err => {
        console.error(`Error creating Influx database!`);
        console.error(err);
    });

setInterval(function () {
    si.currentLoad(function (data) {
        var duration = 100 - (data.currentload_idle);

        influx.writePoints([{
            measurement: 'cpu_load',
            tags: {
                host: os.hostname()
            },
            fields: {
                duration
            },
        }]).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
        })
    });
    si.mem(function (data) {
        var perc = (data.active / data.total) * 100;

        influx.writePoints([{
            measurement: 'ram_load',
            tags: {
                host: os.hostname()
            },
            fields: {
                total: data.total,
                free: data.free,
                used: data.use,
                percentage: perc
            },
        }]).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
        });
    });
}, 1000);