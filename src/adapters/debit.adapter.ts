import {
    AbortResult,
    CommitResult,
    IBankAdapter,
    ResultStatus,
    PrepareResult,
    TransactionContext
  } from '@minka/bridge-sdk'
  import { LedgerErrorReason } from '@minka/bridge-sdk/errors'
  
  import * as extractor from '../extractor'
  import core from '../core'
  
  export class SyncDebitBankAdapter extends IBankAdapter {
    prepare(context: TransactionContext): Promise<PrepareResult> {
      console.log('RECEIVED POST /v2/debits test')
  
      let result: PrepareResult
      let transaction

      try {
        const extractedData = extractor.extractAndValidateData(this.getEntry(context))
  
        transaction = core.hold(
          extractedData.address.account,
          extractedData.amount,
          `${context.entry.handle}-hold`,
        )
  
        if (transaction.status !== 'COMPLETED') {
          throw new Error(transaction.errorReason)
        }
  
        result = {
          status: ResultStatus.Prepared,
          coreId: transaction.id.toString(),
        }
      } catch (e: any) {
        result = {
          status: ResultStatus.Failed,
          error: {
            reason: LedgerErrorReason.BridgeUnexpectedCoreError,
            detail: e.message,
            failId: undefined,
          },
        }
      }
  
      return Promise.resolve(result)
    }
  
    abort(context: TransactionContext): Promise<AbortResult> {
      console.log('RECEIVED POST /v2/debits/abort')
  
      let result: AbortResult
      let transaction

    try {
      const extractedData = extractor.extractAndValidateData(this.getEntry(context))

      if (context.previous!.job.state.result.status === ResultStatus.Prepared) {
        transaction = core.release(
          extractedData.address.account,
          extractedData.amount,
          `${context.entry.handle}-release`,
        )

        if (transaction.status !== 'COMPLETED') {
          throw new Error(transaction.errorReason)
        }
      }

      result = {
        status: ResultStatus.Aborted,
        coreId: transaction!.id.toString(),
      }
    } catch (e) {
      result = {
        status: ResultStatus.Aborted,
      }
    }
  
      return Promise.resolve(result)
    }
  
    commit(context: TransactionContext): Promise<CommitResult> {
      console.log('RECEIVED POST /v2/debits/commit')
  
      let result: CommitResult
      let transaction

      try {
        const extractedData = extractor.extractAndValidateData(this.getEntry(context))
  
        transaction = core.release(
          extractedData.address.account,
          extractedData.amount,
          `${context.entry.handle}-release`,
        )
  
        if (transaction.status !== 'COMPLETED') {
          throw new Error(transaction.errorReason)
        }
  
        transaction = core.debit(
          extractedData.address.account,
          extractedData.amount,
          `${context.entry.handle}-debit`,
        )
  
        if (transaction.status !== 'COMPLETED') {
          throw new Error(transaction.errorReason)
        }
  
        result = {
          status: ResultStatus.Committed,
          coreId: transaction.id.toString(),
        }
      } catch (e) {
        result = {
          status: ResultStatus.Suspended,
        }
      }
  
      return Promise.resolve(result)
    }

    getEntry(context: TransactionContext):{schema:string,target:string, source:string, amount:number,symbol:string}{
        return {
            schema: context.entry.schema,
            target: context.entry.target!.handle,
            source: context.entry.source!.handle,
            amount: context.entry.amount,
            symbol: context.entry.symbol.handle
            }
    }
  }