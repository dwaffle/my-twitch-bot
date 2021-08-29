require('dotenv').config();
const request = require('request')
const token = process.env.TWITCH_ACCESS_TOKEN
const username = process.env.TWITCH_BOT_USERNAME
const channel = process.env.TWITCH_USERNAME
var AT = ''

function getToken (url, callback){

    const options = {
        url: process.env.GET_TOKEN,
        json: true,
        body: {
            client_id: "68t6at3yozhns9qcih46yg8sckb5f3",
            client_secret: "61qyelhqrlzwo4zb774gcoigmbtztu",
            grant_type: 'client_credentials'
        }
    }

    request.post(options, (err, res, body) => {
        if(err){
            return console.log(err)
        }
        console.log(res.body)
        callback(res)
    })
}

getToken("https://id.twitch.tv/oauth2/token", (res) => {
    AT = res.body.access_token;
    return AT
})

module.exports = {
    getToken,
    AT
}