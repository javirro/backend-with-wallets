import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { envs } from '../constants'

class ViemConfig {

  private publicClient
  private masterWalletClient

  constructor() {
    // Config public client
    this.publicClient = createPublicClient({
      transport: http(),
      chain: sepolia
    })
    // Config master wallet client
    const masterPk = envs.MASTER_PRIVATE_KEY.startsWith('0x') ? envs.MASTER_PRIVATE_KEY : `0x${envs.MASTER_PRIVATE_KEY}`
    const account = privateKeyToAccount(masterPk as `0x${string}`)
    this.masterWalletClient = createWalletClient({
      transport: http(),
      chain: sepolia,
      account
    })
  }

  getPublicClient() {
    return this.publicClient
  }

  getMasterWalletClient() {
    return this.masterWalletClient
  }
}

export const viemConfig = new ViemConfig()