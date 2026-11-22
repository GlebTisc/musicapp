import fs from 'node:fs';
import { importPKCS8, importSPKI } from 'jose';
import { AppError } from './AppError';

function readKey(envPathName: string, envBase64Name: string): string {
    const path = process.env[envPathName];
    if (path) {
        return fs.readFileSync(path, 'utf-8');
    }
    const b64 = process.env[envBase64Name];
    if (b64) {
        return Buffer.from(b64, 'base64').toString('utf-8');
    }
    throw new AppError(`Neither ${envPathName} nor ${envBase64Name} is set`, 401);
}

let privateKey: CryptoKey | undefined;
let publicKey: CryptoKey | undefined;

/**
 * RSA private key for signing JWTs
 */
export async function getPrivateKey(): Promise<CryptoKey> {
    if (!privateKey) {
        const pem = readKey('JWT_PRIVATE_KEY_PATH', 'JWT_PRIVATE_KEY_B64');
        privateKey = await importPKCS8(pem, 'RS256');
    }
    return privateKey;
}

/**
 * RSA public key for verifying JWTs
 */
export async function getPublicKey(): Promise<CryptoKey> {
    if (!publicKey) {
        const pem = readKey('JWT_PUBLIC_KEY_PATH', 'JWT_PUBLIC_KEY_B64');
        publicKey = await importSPKI(pem, 'RS256');
    }
    return publicKey;
}