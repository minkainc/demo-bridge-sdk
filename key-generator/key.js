const crypto = require('crypto')

const DER_SECRET_PREFIX = '302e020100300506032b657004220420'
const DER_PUBLIC_PREFIX = '302a300506032b6570032100'

function generateLedgerKeyPair() {
	// Generate random ed25519 keys
	const keyPairDer = crypto.generateKeyPairSync('ed25519')
	
	// Export secret and public keys in der format
	const secretDer = keyPairDer.privateKey
		.export({ format: 'der', type: 'pkcs8' })
		.toString('hex')
	const publicDer = keyPairDer.publicKey
		.export({ format: 'der', type: 'spki' })
		.toString('hex')
	
	const secretRaw = Buffer.from(
		secretDer.slice(DER_SECRET_PREFIX.length),
		'hex',
	).toString('base64')
	const publicRaw = Buffer.from(
		publicDer.slice(DER_PUBLIC_PREFIX.length),
		'hex',
	).toString('base64')

	return {
		format: 'ed25519-raw',
		secret: secretRaw,
		public: publicRaw,
	}
}

// Generate keys
const keyPair = generateLedgerKeyPair()

// Print keys
console.log(JSON.stringify(keyPair, null, 2))