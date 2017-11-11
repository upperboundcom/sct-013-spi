var sct013 = require('./index.js');


var options = {
    supplyVoltage:3300,
    speedHz:20000
    };

sct013.open(5, options, function (err) {

    if (err) {

        console.log("error: "+err);
    }

    console.log("Current monitoring started...");
    setInterval(function() {

        sct013.calcIrms(1480, function(reading) {
        
            console.log("Irms: "+reading);

        });
    },1000);
});

// if ctrl-C is pressed, free the resources and exit

process.on('SIGINT', function () {

    console.log("Caught SIGINT");
    sct013.close(function() {

        console.log("Current monitoring stopped.");
        process.exit();
    });

});
