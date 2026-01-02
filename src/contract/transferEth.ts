import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { envs } from '../constants'

export const checkEtherBalance = async (address: string) => {
  const publicClient = createPublicClient({
    transport: http(),
    chain: sepolia
  })

  const weiBalance: bigint = await publicClient.getBalance({ address: address as `0x${string}` })
  const ethBalance = Number(weiBalance) / 1e18
  return { weiBalance, ethBalance }
}


export const transferEth = async ( toAddress: string, amountInEth: number) => {
  const masterPk = envs.MASTER_PRIVATE_KEY.startsWith('0x') ? envs.MASTER_PRIVATE_KEY : `0x${envs.MASTER_PRIVATE_KEY}`
  const account = privateKeyToAccount(masterPk as `0x${string}`)

  const publicClient = createPublicClient({
    transport: http(),
    chain: sepolia
  })
  const walletClient = createWalletClient({
    transport: http(),
    chain: sepolia,
    account
  })

  const amountInWei = BigInt(amountInEth * 1e18)

  const txHash = await walletClient.sendTransaction({
    to: toAddress as `0x${string}`,
    value: amountInWei
  })

  await publicClient.waitForTransactionReceipt({ hash: txHash })
  console.log('Transferred', amountInEth, 'ETH to', toAddress, 'with tx hash:', txHash)
  return txHash

}