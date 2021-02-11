const logger = require('../util/logger');
const {
  getMethod,
  getUrl,
  getReferrer,
  getOrigin,
  getUserAgent,
  getIp
} = require('../util/request');

const loggerMiddleware = (req, res, next) => {
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
  next();
};

module.exports = loggerMiddleware;
