import { createPublicClient, createWalletClient, Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import abi from './abi.json'

const contractAddress = '0x494D6E966b9f1485EC3d7778C90e20d2a2b1464c'

export const executeTransaction = async (decryptedPrivateKey: string) => {
  const randomBeneficiary = '0x0000000000000000000000000000000000000001'
  const amount = 0.00001 * 1e18 // in wei
  const maxValidationTime =  86400 // 24 hours in seconds
  const formattedPk = decryptedPrivateKey.startsWith('0x') ? decryptedPrivateKey : `0x${decryptedPrivateKey}`
  const account = privateKeyToAccount(formattedPk as Hex)

  const walletClient = createWalletClient({
    transport: http(),
    chain: sepolia,
    account
  })

  const publicClient = createPublicClient({
    transport: http(),
    chain: sepolia
  })

  const txHash = await walletClient.writeContract({
    address: contractAddress as `0x${string}`,
    abi: abi,
    functionName: 'deposit',
    args: [randomBeneficiary as `0x${string}`, maxValidationTime],
    value: BigInt(amount)

  })

  await publicClient.waitForTransactionReceipt({ hash: txHash })
  console.log('Transaction executed with hash:', txHash)
  return txHash
}
