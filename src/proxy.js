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
        return req.pipe(request(url)).pipe(res)
    }catch(e) {
        return fail(res, "Internal server error")
    }
}
function succeed(res, data) {
    return res.pipe
}

function fail(res, reason, status=500) {
    return res.status(status).json({
        server: "tidbyte", 
        success: false,
        status, reason
    })
}