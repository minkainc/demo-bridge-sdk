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

### Default Configurations
The bridge comes configured with default values that may need adjustments according to your use case:

- **Supported Wallets**: The bridge is configured to work only with the following wallets:
  - mintbank.dev

- **Supported Schemas**: The allowed schemas are:
  - caho
  - ccte
  - dbmo
  - svgs

- **Supported Symbols/Currencies**:
  - usd (with a factor of 100)
  - cop

These configurations can be found in the `src/extractor.ts` file and can be modified according to your implementation needs.

### Simulated Banking Core
The project includes a simulated banking core in `src/core.ts` that comes with the following predefined accounts:

- **Account '1'**: Account with no balance
- **Account '424242'**: Account with available balance of 70
  - Initial balance: 100,000,000
  - Debit: 10
  - On hold: 20
- **Account '3'**: Account with no available balance
  - Initial balance: 300
  - Debit: 200
  - On hold: 100
- **Account '4'**: Inactive account
  - Initial balance: 200
  - Debit: 20

To test with different accounts or balances, you can modify the Ledger class constructor in `src/core.ts`.

### Variable Substitution
To configure the keys, you should replace the values in the `.env` file as follows:

```bash
LEDGER_HANDLE=[ledger name]
LEDGER_SERVER=[server where the ledger is located]
LEDGER_PUBLIC_KEY=[ledger's public key] 
BRIDGE_PUBLIC_KEY=[public key of the bridge you are configuring]
BRIDGE_SECRET_KEY=[private key of the bridge you are configuring]
CLIENT_ID=[client id]
CLIENT_SECRET=[client secret]
```
Note: 
   `CLIENT_ID` and `CLIENT_SECRET` are the credentials of the client that will be used to authenticate requests to the 

To obtain the ledger's public key, run:
```bash
minka signer show system
```
If you used the CLI to generate the bridge's public and private keys, you can use the following command to get the information:
```bash
minka signer show [signer] -s
```
