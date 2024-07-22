const readBuffer = (file: File, start = -0, end = 2) => {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(start, end));
  });
};

const check = (headers: (number | undefined)[]) => {
  return (buffers: Uint8Array, options = { offset: 0 }) => {
    return headers.every((header, index) => {
      return header === undefined || header === buffers[options.offset + index];
    });
  };
};

const isPNGMagicNumber = check([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const isJPEGMagicNumber = check([0xff, 0xd8, 0xff]);
const isWEBPMagicNumber = check([
  0x52,
  0x49,
  0x46,
  0x46,
  undefined,
  undefined,
  undefined,
  undefined,
  0x57,
  0x45,
  0x42,
  0x50,
]);
const isAVIFMagicNumber = check([
  0x00, 0x00, 0x00, 0x1c, 0x66, 0x74, 0x79, 0x70, 0x61, 0x76, 0x69, 0x66,
]);

export const isValidImageFile = async (file: File) => {
  const buffers = await readBuffer(file, 0, 12);
  const uint8Array = new Uint8Array(buffers);

  const isPNG = file.type === "image/png" && isPNGMagicNumber(uint8Array);
  const isJPEG = file.type === "image/jpeg" && isJPEGMagicNumber(uint8Array);
  const isWEBP = file.type === "image/webp" && isWEBPMagicNumber(uint8Array);
  const isAVIF = file.type === "image/avif" && isAVIFMagicNumber(uint8Array);

  return isPNG || isJPEG || isWEBP || isAVIF;
};
