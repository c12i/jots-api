const getIp = req => {
    return req.ip || (req.connection && req.connection.remoteAddress) || '-'
}

const getUrl = req => {
    return req.originalUrl || req.url || req.baseUrl || '-'
}

const getPath = req => {
    return getUrl(req).split('?')[0]
}

const getAction = req => {
    return getUrl(req).split('/')[1]
}

const getHttpVersion = req => {
    return `${req.httpVersionMajor}.${req.httpVersionMinor}`
}

const getResponseHeader = (res, field) => {
    if (!res.headersSent) {
        return undefined
    }

    const header = res.getHeader(field)

    return Array.isArray(header) ? header.join(', ') : header || '-'
}

const getReferrer = req => {
    const referer = req.headers.referer || req.headers.referrer || '-'

    if (typeof referer === 'string') {
        return referer
    }

    return referer[0]
}

const getOrigin = req => {
    const { origin } = req.headers

    if (!origin || typeof origin === 'string') {
        return origin
    }

    return origin[0]
}

const getMethod = req => {
    return req.method
}

const getUserAgent = req => {
    return req.headers['user-agent'] || '-'
}

const getBody = req => {
    return req.body || {}
}

const getRequestUser = req => {
    return req.user
}

module.exports = {
    getRequestUser,
    getBody,
    getUserAgent,
    getMethod,
    getOrigin,
    getReferrer,
    getResponseHeader,
    getHttpVersion,
    getAction,
    getPath,
    getUrl,
    getIp
}
