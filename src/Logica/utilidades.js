

export const GRADOS = [
  "1° Primaria",
  "2° Primaria",
  "3° Primaria",
  "4° Primaria",
  "5° Primaria",
  "6° Primaria",
];
export const AVATARES = ["🚀", "🦄", "🦖", "🤖", "🌟", "👾", "🦁", "🦉"];

/**
 * Convierte una URL de video (especialmente YouTube) a formato de embed seguro.
 * @param {string} url - URL original del video.
 * @returns {string|null} URL de embed o null.
 */
export const obtenerUrlEmbed = (url) => {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      const videoId =
        urlObj.searchParams.get("v") || urlObj.pathname.split("/").pop();
      if (videoId && videoId.length > 5) {
        return `https://www.youtube-nocookie.com/embed/${videoId}`;
      }
    }
    return url;
  } catch (e) {
    return url;
  }
};

/**
 * Genera un código de sala aleatorio.
 * @returns {string} Código de sala de 6 caracteres.
 */
export const generarCodigoSala = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
