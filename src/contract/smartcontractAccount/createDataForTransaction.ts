import { encodeFunctionData, Hex } from "viem"
import depositEscrowAbi from '../depositEscrowAbi.json'

export const createDataForTransaction = (beneficiary: string, maxValidationTime: number): Hex => {
  const data = encodeFunctionData({
    abi: depositEscrowAbi,
    functionName: 'deposit',
    args: [beneficiary, maxValidationTime]
  })
  return data
}