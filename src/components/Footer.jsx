import footerArtwork from "../assets/figma/Footer.svg";

const footerLinks = [
  { label: "Home", href: "#/", className: "footer-home" },
  { label: "Store", href: "#/zodiac", className: "footer-store" },
  { label: "About us", href: "#/about", className: "footer-about" },
  { label: "Contact", href: "#/contact", className: "footer-contact" },
  { label: "S.F AI", href: "#/chat", className: "footer-sfai" },
  { label: "FAQ", href: "#/support", className: "footer-faq" },
  { label: "Payment method", href: "#/support", className: "footer-payment" },
  { label: "Return & Refund", href: "#/support", className: "footer-return" },
  { label: "Privacy Policy", href: "#/support", className: "footer-privacy" },
  { label: "Shipping Information", href: "#/support", className: "footer-shipping" },
  { label: "support@safekid.com", href: "mailto:support@safekid.com", className: "footer-email" },
  { label: "+(84) 123 456 789", href: "tel:+84123456789", className: "footer-phone" },
  { label: "Ho Chi Minh City, Vietnam", href: "#/contact", className: "footer-address" },
];

export default function Footer() {
  return (
    <footer className="site-footer figma-footer">
      <img className="footer-artwork" src={footerArtwork} alt="" />
      <a className="footer-brand-link" href="#/" aria-label="SafeKid home" />
      <nav className="footer-links" aria-label="Footer links">
        {footerLinks.map(({ label, href, className }) => (
          <a className={className} href={href} key={className}>{label}</a>
        ))}
      </nav>
      <div className="footer-social-links" aria-label="Social media">
        <span className="footer-social-x" role="img" aria-label="X" />
        <span className="footer-social-instagram" role="img" aria-label="Instagram" />
        <span className="footer-social-youtube" role="img" aria-label="YouTube" />
        <span className="footer-social-linkedin" role="img" aria-label="LinkedIn" />
      </div>
    </footer>
  );
}
