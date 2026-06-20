import { getRiderCount } from "@/lib/auth/profile";

export async function SocialProof() {
  const count = await getRiderCount();
  const label =
    count === null
      ? "Join riders already on KARTA"
      : `Join ${count.toLocaleString("en-US")} riders already on KARTA`;

  return (
    <section className="v2-social-proof">
      <p>{label}</p>
    </section>
  );
}
