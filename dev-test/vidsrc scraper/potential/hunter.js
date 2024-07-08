async function decodeHunter(encoded, mask, charCodeOffset, delimiterOffset) {
    const delimiter = mask[delimiterOffset];
    const chunks = encoded.split(delimiter).filter((chunk) => chunk);
    const decoded = chunks
      .map((chunk) => {
        const charCode = chunk.split('').reduceRight((c, value, index) => {
          return c + mask.indexOf(value) * delimiterOffset ** (chunk.length - 1 - index);
        }, 0);
        return String.fromCharCode(charCode - charCodeOffset);
      })
      .join('');
    return decoded;
  }
  
  module.exports = { decodeHunter };
  