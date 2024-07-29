export const getImageFromBase64 = (base64 = '', type = 'png') => `data:image/${type};base64,${base64}`;
