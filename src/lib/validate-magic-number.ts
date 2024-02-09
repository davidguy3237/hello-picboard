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

const check = (headers: number[]) => {
  return (buffers: Uint8Array, options = { offset: 0 }) => {
    return headers.every((header, index) => {
      return header === buffers[options.offset + index];
    });
  };
};

const isPNGMagicNumber = check([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const isJPEGMagicNumber = check([0xff, 0xd8, 0xff]);

export const isValidImageFile = async (file: File) => {
  const buffers = await readBuffer(file, 0, 8);
  const uint8Array = new Uint8Array(buffers);

  const isPNG = file.type === "image/png" && isPNGMagicNumber(uint8Array);
  const isJPEG = file.type === "image/jpeg" && isJPEGMagicNumber(uint8Array);

  return isPNG || isJPEG;
};
