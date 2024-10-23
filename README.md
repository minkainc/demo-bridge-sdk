# Running Local Bridge
### Prepare Environment
1. Get all dependencies. To do this, run the following commands:

```bash
npm install -g typescript ts-node
```
```bash
npm install
```

### Database
The `src/db` folder contains a yaml file with the database configuration required by the service. Install Docker (https://docs.docker.com/get-docker/) and run the following command in the folder:

```bash
docker compose up
``` 
### Running the Local Bridge 

The service is started by executing the main.ts file:
```bash
ts-node src/main.ts
``` 
If you want to avoid having to restart the service after each change, you can install a tool like `nodemon` that will monitor project changes and automatically restart the service. You can install `nodemon` with:
```bash
npm install -g nodemon
```

and finally run the service with the command:
```bash
nodemon src/main.ts
```

### Variable Substitution
To configure the keys, you should replace the values in the `.env` file as follows:

```bash
LEDGER_HANDLE=[ledger name]
LEDGER_SERVER=[server where the ledger is located]
LEDGER_PUBLIC_KEY=[ledger's public key] 
BRIDGE_PUBLIC_KEY=[public key of the bridge you are configuring]
BRIDGE_SECRET_KEY=[private key of the bridge you are configuring]
```

To obtain the ledger's public key, run:
```bash
minka signer show system
```
If you used the CLI to generate the bridge's public and private keys, you can use the following command to get the information:
```bash
minka signer show [signer] -s
```

# Running Script to Generate Intent

To generate intents, you can use the `src/intent/create.intent.js` file. For this, you will need to update the configuration information where a key with permissions to create an intent is required. This means a signer that belongs to the circle from where the debit is made - owner@domain - (in this case, the script initiates a payment from the Tesla bank).

To run the script, you can use the information from the `teslabank` signer. To obtain the public and private key information, log in with `teslabank` and then run:

```bash
minka signer show teslabank -s
```
With this information, you can update the `INTENT_PUBLIC_KEY` and `INTENT_PRIVATE_KEY` values:
```bash
const config = {
    LEDGER_SERVER: [ledger server],
    LEDGER_HANDLE: [ledger name],
    INTENT_PUBLIC_KEY: "",
    INTENT_PRIVATE_KEY:""
}
```
Now you can run the command:
```bash
node src/intent/create.intent.js
```
