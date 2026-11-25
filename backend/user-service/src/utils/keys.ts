import fs from 'node:fs';
import { importPKCS8, importSPKI } from 'jose';
import { AppError } from './AppError';

function readKey(envPathName: string): string {
    const path = process.env[envPathName];

    if (path) {
        return fs.readFileSync(path, 'utf-8');
    }

    throw new AppError(`${envPathName} is not set`, 401);
}

let privateKey: CryptoKey | undefined;
let publicKey: CryptoKey | undefined;

/**
 * RSA private key for signing JWTs
 */
export async function getPrivateKey(): Promise<CryptoKey> {
    if (!privateKey) {
        const pem = readKey('JWT_PRIVATE_KEY_PATH');
        privateKey = await importPKCS8(pem, 'RS256');
    }
    return privateKey;
}

/**
 * RSA public key for verifying JWTs
 */
export async function getPublicKey(): Promise<CryptoKey> {
    if (!publicKey) {
        const pem = readKey('JWT_PUBLIC_KEY_PATH');
        publicKey = await importSPKI(pem, 'RS256');
    }
    return publicKey;
}