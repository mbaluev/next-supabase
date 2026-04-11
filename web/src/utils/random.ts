import cryptoJS from 'crypto';

export const randomInt = (min: number, max: number) => {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues !== 'undefined') {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    min = Math.ceil(min);
    max = Math.floor(max);
    const randomNumber = randomBuffer[0] / (0xffffffff + 1);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  } else {
    return cryptoJS.randomInt(min, max);
  }
};

export const random = () => {
  const pow = 8;
  const max = Math.pow(10, pow) - 1;
  return randomInt(0, max) / Math.pow(10, pow);
};

export const randomDecimal = (precision: number) => {
  return Math.floor(Math.random() * (10 * precision - precision) + precision) / precision;
};
