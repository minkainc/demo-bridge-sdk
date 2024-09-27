
const { LedgerSdk } = require('@minka/ledger-sdk')
const { nanoid } = require('nanoid')

const encode = 'ed25519-raw';

const config = {
    LEDGER_SERVER: "",
    LEDGER_HANDLE: "",
    INTENT_PUBLIC_KEY: "",
    INTENT_PRIVATE_KEY:""
}

const sdk = new LedgerSdk({
    server: config.LEDGER_SERVER,
    ledger: config.LEDGER_HANDLE
})



async function run() {

    console.log("start")
    const { intent } = await sdk.intent
        .init()
        .data({
                "handle": nanoid(17),
                "claims": [
                    {
                        "action": "transfer",
                        "amount": 1000,
                        "source": {
                            "custom": {
                                "name": "Andrés Castaño",
                                "type": "individual",
                                "identificationType": "cc",
                                "identification": "15743215698",
                                "emailAddress":"andres@gmail.com",
                                "mobileNumber":"+573126549870"
                            },
                            "handle": "caho:121212@teslabank.io"
                        },
                        "symbol": {
                            "handle": "cop"
                        },
                        "target": {
                            "custom": {
                                "name": "Gloria Rubiano",
                                "type": "individual",
                                "identificationType": "cc",
                                "identification": "157454987698",
                                "emailAddress":"gloria@gmail.com",
                                "mobileNumber":"+573123350257"
                            },
                            "handle": "caho:424242@mintbank.dev"
                        }
                    }
                ],
                "schema": "transfer",
                "access": [
                    {
                        "action": "any",
                        "signer": {
                            "public": config.INTENT_PUBLIC_KEY
                        }
                    },
                    {
                        "action": "read",
                        "bearer": {
                            "$signer": {
                                "public": config.INTENT_PUBLIC_KEY
                            }
                        }
                    }
                ],
                "config": {
                    "commit": "auto"
                }
            } 
        )
        .hash()
        .sign([
            {
                keyPair: {
                    public: config.INTENT_PUBLIC_KEY,
                    format: encode,
                    secret: config.INTENT_PRIVATE_KEY,
                },
            },
        ])
        .send()

        console.log(`Intent created: ${JSON.stringify(intent, null, 2)}`);
}

run()