// import { Injectable } from '@angular/core';
// import {AES_GCM, bytes_to_string, Pbkdf2HmacSha256, string_to_bytes} from 'asmcrypto.js';
// import {AES256} from '@ionic-native/aes-256';
//
// @Injectable()
// export class CryptoProvider {
//     private aesKey: Uint8Array;
//     private iterations = 4096;
//     private nonceLen = 12;
//
//     constructor(private aes256: AES256) {
//         this.generateSecureKeyAndIV(); // To generate the random secureKey and secureIV
//     }
//
//     makeEncrypt(password: string) {
//         this.deriveAesKey(password);
//
//         return bytes_to_string(
//             this.encrypt(
//                 string_to_bytes(password)
//             )
//         );
//     }
//
//     makeDecrypt(encryptedPassword: string) {
//         const encryptedStringToBytes = string_to_bytes(encryptedPassword);
//         const encryptedBytes = this.decrypt(encryptedStringToBytes);
//
//         return bytes_to_string(encryptedBytes);
//     }
//
//     protected decrypt(buffer: Uint8Array): Uint8Array {
//         const parts = this.separateNonceFromData(buffer);
//
//         return AES_GCM.decrypt(parts.data, this.aesKey, parts.nonce);
//     }
//
//     protected encrypt(data: Uint8Array): Uint8Array {
//         const nonce = new Uint8Array(this.nonceLen);
//         this.getRandomValues(nonce);
//
//         const encrypted = AES_GCM.encrypt(data, this.aesKey, nonce);
//
//         return this.joinNonceAndData(nonce, new Uint8Array(encrypted));
//     }
//
//     separateNonceFromData(buf: Uint8Array): { nonce: Uint8Array, data: Uint8Array } {
//         const nonce = new Uint8Array(this.nonceLen);
//         const data = new Uint8Array(buf.length - this.nonceLen);
//         buf.forEach((byte, i) => {
//             if (i < this.nonceLen) {
//                 nonce[i] = byte;
//             } else {
//                 data[i - this.nonceLen] = byte;
//             }
//         });
//         return {nonce, data};
//     }
//
//     deriveAesKey(password: string): void {
//         const stringToBytesPassword = string_to_bytes(password);
//
//         this.aesKey = Pbkdf2HmacSha256(
//             stringToBytesPassword,
//             stringToBytesPassword,
//             this.iterations,
//             32
//         );
//     }
//
//     getRandomValues(buf: Uint32Array | Uint8Array): void {
//         // if (window.crypto && window.crypto.getRandomValues) {
//         //     window.crypto.getRandomValues(buf);
//         //     return;
//         // }
//         //
//         // // @ts-ignore
//         // if (window.msCrypto && window.msCrypto.getRandomValues) {
//         //     // @ts-ignore
//         //     window.msCrypto.getRandomValues(buf);
//         //     return;
//         // }
//         // throw new Error('No secure random number generator available.');
//     }
//
//     joinNonceAndData(nonce: Uint8Array, data: Uint8Array): Uint8Array {
//         const buf = new Uint8Array(nonce.length + data.length);
//         nonce.forEach((byte, i) => buf[i] = byte);
//         data.forEach((byte, i) => buf[i + nonce.length] = byte);
//         return buf;
//     }
// }
//
//
//
//
// import { Injectable } from '@angular/core';
//
// import { TextEncoder } from 'text-encoding';
// import { Jose, JoseJWE, Encrypter, Decrypter } from 'jose-jwe/jose-jwe-jws';
//
// @Injectable()
// export class CryptoProvider {
//
//     private encoder = new TextEncoder();
//     private encrypter: Encrypter;
//     private decrypter: Decrypter;
//     private alg: string = 'AES-GCM';
//     private keyUsage: string[] = ['encrypt', 'decrypt'];
//
//     constructor(private storage: Storage) {
//         console.log('Hello CryptoProvider Provider');
//     }
//
//     encodeString(text: string): Uint8Array {
//         return this.encoder.encode(text);
//     }
//
//     generateKey(password: string): PromiseLike<CryptoKey> {
//         const passwordUtf8 = this.encodeString(password);
//         return crypto.subtle.importKey('raw', passwordUtf8, {name: 'PBKDF2'}, false, ['deriveKey']).then((baseKey) => {
//             const params = {
//                 name: 'PBKDF2',
//                 salt: passwordUtf8,
//                 iterations: 5000,
//                 hash: 'SHA-256'
//             } as Pbkdf2Params;
//
//             return crypto.subtle.deriveKey(params, baseKey, {name: this.alg, length: 256}, false, this.keyUsage);
//         });
//     }
//
//     createNewKey(password: string): PromiseLike<void | CryptoKey> {
//         return this.generateKey(password).then((key) => {
//             this.initCryptographer(key);
//         });
//     }
//
//     // recreateKeyFromPassword(password: string): Promise<void> {
//     //     return this.storage.get('salt').then((salt) => {
//     //         return this.generateKey(password, salt).then((key) => {
//     //             this.initCryptographer(key);
//     //         });
//     //     });
//     // }
//
//     initCryptographer(key: CryptoKey): void {
//         const cryptographer = new Jose.WebCryptographer();
//         cryptographer.setKeyEncryptionAlgorithm('dir');
//         this.encrypter = new JoseJWE.Encrypter(cryptographer, key);
//         this.decrypter = new JoseJWE.Decrypter(cryptographer, key);
//     }
//
//     removeKey(): void {
//         this.encrypter = null;
//         this.decrypter = null;
//     }
//
//     // returns JWE: HEADER.KEY.IV.TEXT.INTEGRITY
//     makeEncrypt(plaintext: string): PromiseLike<string> {
//         return new Promise((resolve) => {
//            this.createNewKey(plaintext).then(() => {
//                resolve(this.encrypter.encrypt(plaintext));
//            });
//         });
//     }
//
//     makeDecrypt(ciphertext: string): PromiseLike<string> {
//         return this.decrypter.decrypt(ciphertext);
//     }
//
// }

import { Injectable } from '@angular/core';
import Forge from 'node-forge';

@Injectable()
export class CryptoProvider {

    public constructor() { }

    public generateSalt(password) {
        return Forge.util.encode64(password);
    }

    public generateIv(password) {
        return Forge.util.encode64(password);
    }

    public encrypt(message: string, password: string, salt: any, iv: any) {
        const key = Forge.pkcs5.pbkdf2(password, Forge.util.decode64(salt), 4096, 16);
        const cipher = Forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: Forge.util.decode64(iv)});
        cipher.update(Forge.util.createBuffer(message));
        cipher.finish();

        return Forge.util.encode64(cipher.output.getBytes());
    }

    public decrypt(cipherText: string, password: string, salt: string, iv: string) {
        const key = Forge.pkcs5.pbkdf2(password, Forge.util.decode64(salt), 4096, 16);
        const decipher = Forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: Forge.util.decode64(iv)});
        decipher.update(Forge.util.createBuffer(Forge.util.decode64(cipherText)));
        decipher.finish();

        return decipher.output.toString();
    }


    makeEncrypt(password: string) {
        const salt = this.generateSalt(password);
        const iv = this.generateIv(password);

        return this.encrypt(password, password, salt, iv);
    }

    makeDecrypt(encryptedPassword: string, userString: string) {
        const salt = this.generateSalt(userString);
        const iv = this.generateIv(userString);

        return this.decrypt(encryptedPassword, userString, salt, iv);
    }
}
