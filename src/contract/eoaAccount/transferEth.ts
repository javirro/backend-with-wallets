import { viemConfig } from '../config'

export const checkEtherBalance = async (address: string) => {
  const weiBalance: bigint = await viemConfig.getPublicClient().getBalance({ address: address as `0x${string}` })
  const ethBalance = Number(weiBalance) / 1e18
  return { weiBalance, ethBalance }
}

export const transferEth = async (toAddress: string, amountInEth: number) => {
  const amountInWei = BigInt(amountInEth * 1e18)

  const masterWalletClient = viemConfig.getMasterWalletClient()

  const txHash = await masterWalletClient.sendTransaction({
    to: toAddress as `0x${string}`,
    value: amountInWei
  })

  await viemConfig.getPublicClient().waitForTransactionReceipt({ hash: txHash })
  console.log('Transferred', amountInEth, 'ETH to', toAddress, 'with tx hash:', txHash)
  return txHash
}
