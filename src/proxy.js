const { getMetadata } = require('page-metadata-parser'),
    { JSDOM } = require('jsdom')
    request = require('request'),
    userAgent = process.env.USERAGENT || `tidbyteBot (like TwitterBot)`

module.exports = async function(req, res, url, cache) {
    if(cache) {
        let mem = await cache(url)
        if(mem) return succeed(res, mem)
    }
    try {
        return succeed(res, await req(url))
    }catch(e) {
        return fail(res, "Internal server error")
    }
}

function req(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            if(err)
                return reject(err)
            return resolve({response, body})
        })
    })
}

function succeed(res, data) {
    return res.status(200).json({
        server: "tidbyte", 
        success: true,
        status: 200,
        data,
        notice: "Remember to get images securely, see /proxy"
    })
}

function fail(res, reason, status=500) {
    return res.status(status).json({
        server: "tidbyte", 
        success: false,
        status, reason
    })
}