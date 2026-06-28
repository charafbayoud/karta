import { StravaPartnerLogo } from "./StravaPartnerLogo";

const IMAGE_PARTNERS = [
  { name: "Zwift", logo: "/images/partners/zwift.svg" },
  { name: "Garmin", logo: "/images/partners/garmin.svg" },
  { name: "Wahoo", logo: "/images/partners/wahoo.svg" },
  { name: "Hammerhead", logo: "/images/partners/hammerhead.svg" },
] as const;

export function SocialProofBar() {
  return (
    <section className="lp-proof" aria-label="Trusted platforms">
      <div className="lp-container lp-proof-inner">
        <p className="lp-proof-label">Works with</p>
        <ul className="lp-proof-logos">
          <li>
            <img src={IMAGE_PARTNERS[0].logo} alt={IMAGE_PARTNERS[0].name} className="lp-proof-logo" />
          </li>
          <li>
            <StravaPartnerLogo />
          </li>
          {IMAGE_PARTNERS.slice(1).map((partner) => (
            <li key={partner.name}>
              <img src={partner.logo} alt={partner.name} className="lp-proof-logo" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
