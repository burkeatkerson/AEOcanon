import Image from "next/image";

/** Captioned image for MDX. `alt` required (accessibility + schema parity). */
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
      <div className="border-line overflow-hidden rounded-xl border">
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
        <figcaption className="text-muted mt-2.5 text-center font-sans text-[12.5px]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
