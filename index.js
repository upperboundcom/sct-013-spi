var mcpadc = require('mcp-spi-adc');
var sensor;
var ICAL = 111.1;
var offsetI = 512;
var sumI;
var options;

exports.open = function(channel, opts, callback) {

    options = opts;
    sensor = mcpadc.open(channel, options, function(err) {
        if (err) {
            console.log("error: "+ err);
            throw err;
        }
        
        callback(err);       
    });

};

// Returns root mean square for current

exports.calcIrms = function (samples, callback) {

    var fileredI;
    var irms,  sqI;

    for (var n = 0; n < samples; n++) {

        sensor.read(function(err, reading) {

            var sampleI=reading.value;
            // Digital low pass filter extracts the 2.5 V or 1.65 V dc offset,
            //  then subtract this - signal is now centered on 0 counts.
            offsetI = (offsetI + (sampleI-offsetI)/1024);
            filteredI = sampleI - offsetI;

            // Root-mean-square method current
             // 1) square current values
            var sqI = filteredI * filteredI;
            // 2) sum
            sumI += sqI;

        });
    }

    var I_RATIO = ICAL *((options.supplyVoltage/1000.0) / (1024));
    irms = I_RATIO * Math.sqrt(sumI / samples);

    //Reset accumulators
    sumI = 0;

    callback(irms);
};

// Closes the ADC port

exports.close = function(callback) {

    sensor.close(callback);
}

exports.options = options;
