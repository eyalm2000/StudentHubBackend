import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ivLength = 12;
const authTagLength = 16;

export function encrypt(text: string, secretKeyHex: string): string {
    if (!secretKeyHex || secretKeyHex.length !== 64) { // 32 bytes = 64 hex characters
        throw new Error('Invalid encryption key: Must be a 64-character hex string (representing 32 bytes).');
    }
    try {
        const secretKey = Buffer.from(secretKeyHex, 'hex');
        const iv = crypto.randomBytes(ivLength);
        const cipher = crypto.createCipheriv(algorithm, secretKey, iv) as crypto.CipherGCM;

        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        const authTag = cipher.getAuthTag();

        return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;

    } catch (error: any) {
        console.error("Encryption failed:", error);
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

export function decrypt(encryptedData: string, secretKeyHex: string): string {
    if (!secretKeyHex || secretKeyHex.length !== 64) {
       throw new Error('Invalid encryption key: Must be a 64-character hex string (representing 32 bytes).');
   }
   if (!encryptedData || typeof encryptedData !== 'string') {
       throw new Error('Invalid encrypted data format.');
   }

   try {
       const parts = encryptedData.split(':');
       if (parts.length !== 3) {
           throw new Error('Invalid encrypted data format. Expected iv:encrypted:authTag');
       }

       const [ivHex, encrypted, authTagHex] = parts;

       const secretKey = Buffer.from(secretKeyHex, 'hex');
       const iv = Buffer.from(ivHex, 'hex');
       const authTag = Buffer.from(authTagHex, 'hex');

       if (iv.length !== ivLength) throw new Error("Invalid IV length");
       if (authTag.length !== authTagLength) throw new Error("Invalid auth tag length");


       const decipher = crypto.createDecipheriv(algorithm, secretKey, iv) as crypto.DecipherGCM;
       decipher.setAuthTag(authTag);

       let decrypted = decipher.update(encrypted, 'base64', 'utf8');
       decrypted += decipher.final('utf8');

       return decrypted;

   } catch (error: any) {
       console.error("Decryption failed:", error);
       throw new Error(`Decryption failed: ${error.message}`);
   }
}