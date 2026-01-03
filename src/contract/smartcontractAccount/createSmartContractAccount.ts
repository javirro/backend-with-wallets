import { encodePacked, parseAbiItem, keccak256, decodeEventLog, parseAbi } from 'viem'

import factorySmartContractAbi from './factorySmartContractAccount.json'
import { FACTORY_SMART_CONTRACT_ACCOUNT } from '../addresses'
import { viemConfig } from '../config'

export const createSmartContractAccount = async (email: string): Promise<{ scaAddress: `0x${string}`; txHash: `0x${string}` }> => {
  const masterWalletClient = viemConfig.getMasterWalletClient()

  const emailEncoded = encodePacked(['string'], [email])
  const hasedEmail = keccak256(emailEncoded)

  const txHash = await masterWalletClient.writeContract({
    address: FACTORY_SMART_CONTRACT_ACCOUNT as `0x${string}`,
    abi: factorySmartContractAbi,
    functionName: 'createUserAccount',
    args: [hasedEmail]
  })

  await viemConfig.getPublicClient().waitForTransactionReceipt({ hash: txHash })
  console.log('Smart Contract Account created with tx hash:', txHash)

  // We have already created the smart contract account, we have transaction hash, but we do not have the address yet.
  const currentBlock = await viemConfig.getPublicClient().getBlockNumber()
  let newScaAddress = null
  while (!newScaAddress) {
    console.log('Fetching logs to get the smart contract account address...')
    const logs = await viemConfig.getPublicClient().getLogs({
      address: FACTORY_SMART_CONTRACT_ACCOUNT as `0x${string}`,
      fromBlock: BigInt(currentBlock) - BigInt(100),
      event: parseAbiItem('event UserAccountCreated(address indexed accountAddress,  bytes32 indexed userIdentifier, uint256 accountId)')
    })

    for (const log of logs) {
      const decoded = decodeEventLog({
        abi: parseAbi(['event UserAccountCreated(address indexed,  bytes32 indexed, uint256)']),
        data: log.data,
        topics: log.topics
      })
      const specificLogTopcis = decoded.args
      if (specificLogTopcis.includes(hasedEmail)) {
        newScaAddress = decoded.args[0]
        break
      }
    }
    if (!newScaAddress) {
      console.log('No logs found yet, waiting 5 seconds before retrying...')
      await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
  return { scaAddress: newScaAddress!, txHash }
}

createSmartContractAccount('random@example.com').catch((error) => {
  console.error('Error creating smart contract account:', error)
})
