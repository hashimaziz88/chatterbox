/**
 * This module provides a function to hash a password using the SHA-256 algorithm. It takes a password as input, encodes it as a byte array,
 *  and then computes the hash using the Web Crypto API. The resulting hash is returned as a hexadecimal string. This function is used for
 *  securely storing and comparing user passwords in the application.
 *
 * @param {*} password Passowrd string to be hashed using the SHA-256 algorithm.
 * @returns {string} The SHA-256 hash of the input password as a hexadecimal string.
 */
export const sha256 = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);

  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");

  return hashHex;
};
