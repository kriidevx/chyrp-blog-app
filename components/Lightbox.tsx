'use client';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function Lightbox({ src, alt }: { src: string, alt?: string }) {
  return (
    <Zoom>
      <img src={src} alt={alt || ""} className="max-w-full rounded shadow cursor-zoom-in" />
    </Zoom>
  );
}
