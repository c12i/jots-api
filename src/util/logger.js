const P = require('pino');

const {
  getMethod,
  getUrl,
  getReferrer,
  getOrigin,
  getUserAgent,
  getIp
} = require('./request');

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

const requestLogger = (req, res) => {
  req.on('error', err => {
    logger.error(`Error: ${err.message}`, err.stack);
  });
  res.on('error', err => {
    logger.error(`Error: ${err.message}`, err.stack);
  });
  res.on('finish', () => {
    const startTime = process.hrtime();
    const diff = process.hrtime(startTime);
    const message = {
      url: `${getMethod(req)} ${getUrl(req)}`,
      referrer: getReferrer(req),
      origin: getOrigin(req) || '-',
      userAgent: getUserAgent(req),
      remoteAddress: getIp(req),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      requestRunTime: `${(diff[0] * 1e3 + diff[1] * 1e-6).toFixed(4)} ms`
    };
    logger.info(JSON.stringify(message));
  });
};

module.exports = { logger, requestLogger };
