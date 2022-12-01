import * as Forge from 'node-forge';

export class CryptoProvider {

    static generateSalt(password: string) {
        return Forge.util.encode64(password);
    }

    static generateIv(password: string) {
        return Forge.util.encode64(password);
    }

    static encrypt(message: string, password: string, salt: any, iv: any) {
        const key = Forge.pkcs5.pbkdf2(password, Forge.util.decode64(salt), 4096, 16);
        const cipher = Forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: Forge.util.decode64(iv)});
        cipher.update(Forge.util.createBuffer(message));
        cipher.finish();

        return Forge.util.encode64(cipher.output.getBytes());
    }

    static decrypt(cipherText: string, password: string, salt: string, iv: string) {
        const key = Forge.pkcs5.pbkdf2(password, Forge.util.decode64(salt), 4096, 16);
        const decipher = Forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: Forge.util.decode64(iv)});
        decipher.update(Forge.util.createBuffer(Forge.util.decode64(cipherText)));
        decipher.finish();

        return decipher.output.toString();
    }

    static hashPassword(password: string) {
        return password;
        // return BcryptJS.hashSync(this.makeEncrypt(password));
    }

    static comparePassword(password: string, hashPassword: string) {
        return password === hashPassword;
        // return BcryptJS.compareSync(this.makeEncrypt(password), hashPassword);
    }

    static makeEncrypt(password: string) {
        const salt = this.generateSalt(password);
        const iv = this.generateIv(password);

        return this.encrypt(password, password, salt, iv);
    }

    static makeDecrypt(encryptedPassword: string, userString: string) {
        const salt = this.generateSalt(userString);
        const iv = this.generateIv(userString);

        return this.decrypt(encryptedPassword, userString, salt, iv);
    }
}
