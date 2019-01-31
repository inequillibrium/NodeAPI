const Influx = require('influx');
const os = require('os');
const si = require('systeminformation');
const http = require('http');

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
        },
        {
            measurement: 'bots_running',
            fields: {
                total: Influx.FieldType.INTEGER
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
    /*var options = {
        host: '192.168.1.220',
        prot: 80,
        path: '/api/bot/list',
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Basic aitXNDFPcFhjSHY4SW45dnQvUTJ4K1VtVVBzTzVicEFnMFZtWmtGZmp0MGJxa3dwaUs4MTQyUVVXR1k='
        }
    }
    var x = http.request(options, function (res) {
        var body = '';
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            var parsed = JSON.parse(body);
            var total = parsed.length;

            influx.writePoints([{
                measurement: 'bots_running',
                tags: {
                    host: os.hostname()
                },
                fields: {
                    total: total
                },
            }]).catch(err => {
                console.error(`Error saving data to InfluxDB! ${err.stack}`)
            });

        });
    });
    x.end();*/

}, 1000);

// j+W41OpXcHv8In9vt/Q2x+UmUPs=:ts3ab:O5bpAg0VmZkFfjt0bqkwpiK8142QUWGY
// j+W41OpXcHv8In9vt/Q2x+UmUPsO5bpAg0VmZkFfjt0bqkwpiK8142QUWGY
// aitXNDFPcFhjSHY4SW45dnQvUTJ4K1VtVVBzTzVicEFnMFZtWmtGZmp0MGJxa3dwaUs4MTQyUVVXR1k=