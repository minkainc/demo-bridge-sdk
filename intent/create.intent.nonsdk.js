const  stringify  = require('safe-stable-stringify')
const  crypto  = require('node:crypto')
const { nanoid } = require('nanoid')
const  axios  = require('axios')


const HASHING_ALGORITHM = 'sha256'

const config = {
  LEDGER_SERVER: "",
    LEDGER_HANDLE: "",
    // Key pair que se usará para firmar.
    INTENT_PUBLIC_KEY: "",
    INTENT_PRIVATE_KEY:""
}




// Intent que se va a crear
const data = {
  "handle": nanoid(17),
  "claims": [
      {
          "action": "transfer",
          "amount": 1000,
          "source": {
              "custom": {
                  "name": "Andrés test",
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



function createHash(data) {
  const serializedData = stringify(data)
  return crypto
    .createHash(HASHING_ALGORITHM)
    .update(serializedData)
    .digest('hex')
}

function createSignatureDigest(
  dataHash,
  signatureCustom,
) {
  // Serialize the custom data, if it exists
  const serializedCustomData = signatureCustom ?
    stringify(signatureCustom) :
    ''

  // Create a hash by concatenating the data hash
  // with serialized custom data
  return crypto
    .createHash(HASHING_ALGORITHM)
    .update(dataHash + serializedCustomData)
    .digest('hex')
}

/**
 * ASN1 prefix which precedes the private key in DER ASN.1 format.
 * Contains identifiers for Ed25519 together with meta bytes
 * for length and others.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc8410
 * @see https://datatracker.ietf.org/doc/html/rfc5208
 * @see example https://lapo.it/asn1js/#MCowBQYDK2VwAyEAYNUhOe_8hqFet7VdDSO4372OFw0whAWJ8VAlPPXAPGY
 */
const ASN1_PRIVATE_PREFIX = '302e020100300506032b657004220420'

function importPrivateKey(secret) {
  const keyHex = `${ASN1_PRIVATE_PREFIX}${Buffer.from(secret, 'base64').toString('hex')}`
  return crypto.createPrivateKey({
    format: 'der',
    type: 'pkcs8',
    key: Buffer.from(keyHex, 'hex'),
  })
}


function signHash(hash, publicKey, secretKey) {
  const custom = {
    moment: (new Date).toISOString(),
  }
  const digest = createSignatureDigest(
    hash,
    custom,
  )

  const digestBuffer = Buffer.from(digest, 'hex')
  const key = importPrivateKey(secretKey)

  const result = crypto.sign(undefined, digestBuffer, key).toString('base64')

  return {
    method: 'ed25519-v2',
    public: publicKey,
    digest,
    result,
    custom,
  }
}

const hash = createHash(data)
const signature = signHash(hash, config.INTENT_PUBLIC_KEY, config.INTENT_PRIVATE_KEY)

console.log({
  hash, signature
})

console.log(`URL: ${config.LEDGER_SERVER}/intents`)
console.log(`header: 'x-ledger': ${config.LEDGER_HANDLE}`);


const intent = {
  hash,
  data,
  meta: {
    proofs: [signature]
  }
};
console.log(`Body: ${JSON.stringify(intent, null, 2)}`);


/*
axios.post(`${config.LEDGER_SERVER}/intents`, {
  hash,
  data,
  meta: {
    proofs: [signature]
  }
}, {
  headers: {
    'x-ledger': config.LEDGER_HANDLE
  }
}).then(res => {
  console.log(res.data)
}).catch(err => {
  console.error(err.response.data)
})*/