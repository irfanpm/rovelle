import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/modules/shared/components/BrandLogo";
export default function AuthLayout({children}:{children:React.ReactNode}) {
  return <div className="auth-layout"><div className="auth-art"><Image src="/images/rovelle/campaign.webp" alt="Rovelle floral jewellery campaign" fill sizes="50vw"/><div className="auth-art-copy">A Little Elegance.<br/>Beautifully You.</div></div><div className="auth-content"><Link href="/" aria-label="Rovelle Jewels home"><BrandLogo/></Link><div>{children}</div><Link href="/" className="auth-home">← Return to Rovelle</Link></div></div>;
}
