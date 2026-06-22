type LandingMediaProps = {
  src: string;
  alt?: string;
  priority?: boolean;
  wrapperClassName?: string;
};

export function LandingMedia({
  src,
  alt = "",
  priority,
  wrapperClassName = "",
}: LandingMediaProps) {
  return (
    <div className={wrapperClassName ? `lp-media ${wrapperClassName}` : "lp-media"}>
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    </div>
  );
}
