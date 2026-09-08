import {
  COAST_DEFAULT_SRC,
  COAST_SIZES,
  coastSrcSet,
} from "../../constants/images";

type CoastCliffProps = {
  priority?: boolean;
};

export function CoastCliff({ priority = false }: CoastCliffProps) {
  return (
    <img
      src={COAST_DEFAULT_SRC}
      srcSet={coastSrcSet()}
      sizes={COAST_SIZES}
      width={560}
      height={840}
      alt=""
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : undefined}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
