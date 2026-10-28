import { useSiteMotion } from './useSiteMotion';
/** Montado depois das seções lazy: liga Lenis e as revelações quando todo o conteúdo existe. */
export default function SiteMotion({ reduced }: { reduced: boolean }) {
  useSiteMotion(reduced);
  return null;
}
