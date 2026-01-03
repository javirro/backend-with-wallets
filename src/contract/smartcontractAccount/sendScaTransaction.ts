import { createDataForTransaction } from './createDataForTransaction'
import smartContractAccountAbi from './smartContractAccount.json'
import { DEPOSIT_ESCROW_ADDRESS } from '../addresses'
import { viemConfig } from '../config'

export const sendScaTransaction = async (scaAddress: string, depositEscrowAddress: string, beneficiary: string, maxValidationTime: number) => {
  const depositData = createDataForTransaction(beneficiary, maxValidationTime)

  const masterWalletClient = viemConfig.getMasterWalletClient()
  const etherAmount = 0.00001 * 1e18 // in wei

  const txHash = await masterWalletClient.writeContract({
    address: scaAddress as `0x${string}`,
    abi: smartContractAccountAbi,
    functionName: 'execute',
    args: [depositEscrowAddress as `0x${string}`, BigInt(etherAmount), depositData]
  })

  await viemConfig.getPublicClient().waitForTransactionReceipt({ hash: txHash })
  console.log('SCA Transaction executed with hash:', txHash)
  return txHash
}

sendScaTransaction('0xd7f26b3827d6Ee2FC7c26aDeDa4b83098f4AA2A0', DEPOSIT_ESCROW_ADDRESS, '0x0000000000000000000000000000000000000001', 86400).catch((error) => {
  console.error('Error executing SCA transaction:', error)
})
