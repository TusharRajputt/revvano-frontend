import { Link } from 'react-router-dom';

/**
 * The exact रेvvano + lotus mark, extracted pixel-for-pixel from the brand
 * artwork and recolored to the exact specified hex values (#32220D on
 * #F6F0DF). Always shown on its own matching cream backing so it stays
 * pixel-accurate regardless of the surrounding page's light/dark theme.
 */
export function BrandCornerMark() {
  return (
    <Link
      to="/"
      aria-label="रेvvano"
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[60] block rounded-full shadow-md overflow-hidden"
      style={{ backgroundColor: '#F6F0DF' }}
    >
      <img
        src="/brand/revvano-lotus-logo.png"
        alt="रेvvano"
        className="h-9 sm:h-11 w-auto px-3 py-1.5"
      />
    </Link>
  );
}
