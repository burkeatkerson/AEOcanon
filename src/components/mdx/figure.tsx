import Image from "next/image";

/**
 * Captioned image for MDX. `alt` is required (accessibility + schema parity).
 * Pass width/height to avoid layout shift; falls back to a responsive block.
 */
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className="my-8">
      <div className="border-border overflow-hidden rounded-lg border">
        <Image
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 675}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      {caption ? (
        <figcaption className="text-muted-foreground mt-2 text-center text-sm">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
