import crypto from 'crypto'
import { envs } from '../constants'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits
const SALT_LENGTH = 64
const TAG_LENGTH = 16
const MASTER_KEY = envs.ENCRYPT_MASTER_KEY

const deriveKey = (salt: Buffer) => {
  return crypto.pbkdf2Sync(
    MASTER_KEY,
    salt,
    100000, // iterations
    KEY_LENGTH,
    'sha256'
  )
}
/**
 * Encrypt a private key
 * @param privateKey - The private key to encrypt
 * @param masterKey - Master encryption key (from env)
 * @returns Encrypted data with salt, iv, tag, and ciphertext
 */
export function encryptPrivateKey(privateKey: string): string {
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH)
  const iv = crypto.randomBytes(IV_LENGTH)

  // Derive encryption key
  const key = deriveKey(salt)

  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  // Encrypt the private key
  let encrypted = cipher.update(privateKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Get authentication tag
  const tag = cipher.getAuthTag()

  // Combine salt, iv, tag, and encrypted data
  const result = Buffer.concat([salt, iv, tag, Buffer.from(encrypted, 'hex')])

  // Return as base64 string for storage
  return result.toString('base64')
}

/**
 * Decrypt a private key
 * @param encryptedData - The encrypted data from database
 * @returns Decrypted private key
 */
export function decryptPrivateKey(encryptedData: string): string {
  // Convert from base64
  const buffer = Buffer.from(encryptedData, 'base64')

  // Extract components
  const salt = buffer.subarray(0, SALT_LENGTH)
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
  const tag = buffer.subarray(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + TAG_LENGTH)
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH)

  // Derive the same key
  const key = deriveKey(salt)

  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)

  // Decrypt
  let decrypted = decipher.update(encrypted.toString('hex'), 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}
