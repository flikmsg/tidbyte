const express = require('express'),
    bodyParser = require('body-parser')
    app = express(),
    port = process.env.PORT || 3000,
    redis = process.env.REDIS || undefined,
    RedisManager = require('./RedisManager'),
    redisManager = redis ? new RedisManager(redis) : undefined,
    asyncFalse = async () => true,
    parseRoute = require('./parseRoute'),
    proxy = require('./proxy'),
    updatekey = process.env.UPDATEKEY || "insecure",
    updateFile = process.env.UPDATEFILE || "update.sh"
    update = require('./update')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

if(!redis)
    console.info("Skipping redis connection as REDIS environment variable was not passed...")
else redisManager.connect()


app.get('/proxy', (req, res) => 
    res.status(404).json({ server: "tidbyte", success: false, status: 404, reason: "no value provided", comment: "Use GET /proxy/:url or POST /proxy with url in request body" }))

if(updatekey !== "insecure") app.get(`/update/${updatekey}`, update)
else console.info("Update key not set.")

app.get('/proxy/:url*', (req, res) => 
    proxy(req, res, req.params.url, redisManager ? redisManager.memory : undefined))

app.get('/:url*', (req, res) => 
    parseRoute(req, res, req.params.url, redisManager ? redisManager.memory : undefined))


app.use('*', (req, res) => 
    res.status(404).json({ server: "tidbyte", success: false, status: 404, reason: "no value provided", comment: "Use GET /:url or POST / with url in request body" }))

app.listen(port, () => console.log("Listening on port %s", port))