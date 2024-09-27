// load .env file
import dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/.env` })

// parse and validate configuration
import { config } from './config'

import {
  DataSourceOptions,
  LedgerClientOptions,
  ProcessorBuilder,
  ProcessorOptions,
  ServerBuilder,
  ServerOptions,
} from '@minka/bridge-sdk'

// import our adapters
import { SyncCreditBankAdapter } from './adapters/credit.adapter'
import { SyncDebitBankAdapter } from './adapters/debit.adapter'

import sleep from 'sleep-promise'

// set up data source configuration
const dataSource: DataSourceOptions = {
  host: config.TYPEORM_HOST,
  port: config.TYPEORM_PORT,
  database: config.TYPEORM_DATABASE,
  username: config.TYPEORM_USERNAME,
  password: config.TYPEORM_PASSWORD,
  connectionLimit: config.TYPEORM_CONNECTION_LIMIT,
  migrate: false,
}

// set up ledger configuration
const ledger: LedgerClientOptions = {
  ledger: {
    handle: config.LEDGER_HANDLE,
    signer: {
      format: 'ed25519-raw',
      public: config.LEDGER_PUBLIC_KEY,
    },
  },
  server: config.LEDGER_SERVER,
  bridge: {
    signer: {
      format: 'ed25519-raw',
      public: config.BRIDGE_PUBLIC_KEY,
      secret: config.BRIDGE_SECRET_KEY,
    },
    handle: 'bridge@mintbank.dev'
  },
}

// configure server for bridge service
const bootstrapServer = async () => {
  const server = ServerBuilder.init()
    .useDataSource({ ...dataSource, migrate: true })
    .useLedger(ledger)
    .build()

  const options: ServerOptions = {
    port: config.PORT,
    routePrefix: 'v2'
  }

  await server.start(options)
}


// configure processor for bridge-service
 const bootstrapProcessor = async (handle: string) => {
  const processor = ProcessorBuilder.init()
    .useDataSource(dataSource)
    .useLedger(ledger)
    .useCreditAdapter(new SyncCreditBankAdapter())
    .useDebitAdapter(new SyncDebitBankAdapter())
    .build()

  const options: ProcessorOptions = {
    handle,
  }

  await processor.start(options)
}



// configure Bridge SDK
const boostrap = async () => {
  const processors = ['proc-0']

  await bootstrapServer()

  // wait for migrations to execute
  await sleep(2000)

  for (const handle of processors) {
    await bootstrapProcessor(handle)
  }
}

boostrap()