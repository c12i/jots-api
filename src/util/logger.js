const P = require('pino');

const logger = P({
  name: 'notedly',
  messageKey: 'message',
  timestamp: P.stdTimeFunctions.isoTime,
  prettyPrint: {
    levelFirst: true,
    colorize: true,
    ignore: 'pid',
    crlf: false
  },
  prettifier: require('pino-pretty')
});

module.exports = logger;
