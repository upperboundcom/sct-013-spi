var sct013 = require('./index.js');


var options = {
    supplyVoltage:5000,
    speedHz:20000
    };

var sensor = sct013.open(5, options, function (err) {

    if (err) {

        console.log("error: "+err);
    }
    setInterval(function() {

        sct013.calcIrms(1480, function(reading) {
        
            console.log("irms: "+reading);

        });
    },1000);
});

