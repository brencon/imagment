// src/path-generator.js
export const generateOutputPath = (url) => {
  const { hostname, pathname } = new URL(url);
  const urlPath = pathname.split('/').slice(1).join('-').replace(/\.[^/.]+$/, '');
  return `${hostname}-${urlPath}`;
};