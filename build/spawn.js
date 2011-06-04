module.exports = function (cmd, args, onExit) {
    var spawn = require('child_process').spawn,
        _cmd = spawn(cmd, args),
        sys = require('sys');
    _cmd.stdout.on('data', sys.print);
    _cmd.stderr.on('data', sys.print);
    if (onExit) {
        _cmd.on('exit', onExit);
    }
};
