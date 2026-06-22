/** Verified Unsplash URLs — royalty-free, group cycling & running. */
const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const LANDING_IMAGES = {
  /** Local hero — cyclists on a forest road in fog. */
  hero: "/images/marketing/hero-cycling.png",
  /** Local closing — cyclists riding into fog on a forest road. */
  closing: "/images/marketing/closing-cycling.png",
  /** Local spotlight — cyclists on a forest road in fog. */
  spotlight: "/images/marketing/closing-cycling.png",
  grid: {
    /** Indoor cycling studio — group on trainers. */
    indoor: img("photo-1534438327276-14e5300c3a48", 1000),
    /** Group running on a city street. */
    outdoor: img("photo-1774178290349-6ca5ea0db428", 1000),
  },
  regions: {
    /** Group of cyclists on a road. */
    paris: img("photo-1511994298241-608e28f14fde", 600),
    /** Group of runners. */
    london: img("photo-1774178290349-6ca5ea0db428", 600),
    /** Group of cyclists on a road. */
    barcelona: img("photo-1517649763962-0c623066013b", 600),
    /** Group of cyclists riding together. */
    amsterdam: img("photo-1662502756649-2da74e514d58", 600),
  },
} as const;
