import { createWalletClient, Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import abi from '../depositEscrowAbi.json'
import { DEPOSIT_ESCROW_ADDRESS } from '../addresses'


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

  const txHash = await walletClient.writeContract({
    address: DEPOSIT_ESCROW_ADDRESS as `0x${string}`,
    abi: abi,
    functionName: 'deposit',
    args: [randomBeneficiary as `0x${string}`, maxValidationTime],
    value: BigInt(amount)

  })

  await viemConfig.getPublicClient().waitForTransactionReceipt({ hash: txHash })
  console.log('Transaction executed with hash:', txHash)
  return txHash
}
