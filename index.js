const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const core = require('@actions/core');
const github = require('@actions/github');

try {
    const TWILIO_PHONE_NUMBER = core.getInput('phone');
    const NEEDLE = core.getInput('text');
    const RETRIES = core.getInput('retries');

    getMessages(TWILIO_PHONE_NUMBER, NEEDLE)
        .then(message => {
            console.log(`Found message`, message)
            core.setOutput("found", message);
        })

} catch (error) {
    core.setFailed(error.message);
}


function getMessages(TWILIO_PHONE_NUMBER, NEEDLE) {
    return new Promise((resolve, reject) => {
        console.log(`Contacting Twilio API for messages sent to ${TWILIO_PHONE_NUMBER}`)
        client.messages.list({
            to: TWILIO_PHONE_NUMBER,
            limit: 20
        })
            .then(messages => {
                let message = false

                messages.some(m => {
                    if (m.body.search(NEEDLE) !== -1) {
                        message = m
                        return true
                    }
                })
                resolve(message)
            })
            .catch(err => reject(err))
    })
}

