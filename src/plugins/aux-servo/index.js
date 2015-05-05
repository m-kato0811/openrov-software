var Settings = require('./settings');

function auxServo(name, deps) {
  console.log('Auxiliary servo plugin.');
  var settings = new Settings(deps);
  settings.register();

  var configureServo = function(servo){
    deps.rov.send('xsrv.cfg(' + servo.pin + ',' + servo.min + ',' + servo.max + ')');
    settings.saveServoConfig(servo);
  };

  var execute = function(command){
    deps.rov.send('xsrv.exe(' + command.pin + ',' + command.value + ')');
  };

  deps.rov.on('status', function(status){
    if ('xsrv.ext' in status) {
      deps.cockpit.emit('auxservo-executed', status['xsrv.ext']);
      delete status['xsrv.ext'];
    }
  });

  deps.cockpit.on('auxservo-config', function (config) {
    console.log('auxservo-config');
    configureServo(config);
  });

  deps.cockpit.on('auxservo-execute', function (command) {
    console.log('auxservo-execute');
    execute(command);
  });
}
module.exports = auxServo;