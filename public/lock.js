(function (root) {
  var iterations = 200000;

  function bytesToBase64(bytes) {
    var binary = '';
    bytes.forEach(function (byte) {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    var binary = atob(value);
    return Uint8Array.from(binary, function (char) {
      return char.charCodeAt(0);
    });
  }

  async function deriveKey(password, salt, rounds) {
    var base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: rounds, hash: 'SHA-256' },
      base,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt'],
    );
  }

  async function encryptPayload(password, payload) {
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var key = await deriveKey(password, salt, iterations);
    var encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      new TextEncoder().encode(JSON.stringify(payload)),
    );
    return JSON.stringify({
      v: 1,
      iter: iterations,
      salt: bytesToBase64(salt),
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(encrypted)),
    });
  }

  async function decryptPayload(password, envelopeText) {
    var envelope;
    try {
      envelope = JSON.parse(envelopeText);
    } catch (error) {
      throw new Error('这篇加密文章损坏了。');
    }
    try {
      var key = await deriveKey(password, base64ToBytes(envelope.salt), envelope.iter || iterations);
      var plain = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: base64ToBytes(envelope.iv) },
        key,
        base64ToBytes(envelope.data),
      );
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (error) {
      throw new Error('密码不对。');
    }
  }

  root.dorothyLock = { encryptPayload: encryptPayload, decryptPayload: decryptPayload };
})(typeof window !== 'undefined' ? window : globalThis);
