export default function Footer() {
  return (
    <footer className="footer">
      <div className="row">
        <div className="footer__top--wrapper">
          {[
            { title: "Actions", links: ["Summarist Magazine", "Cancel Subscription", "Help", "Contact us"] },
            { title: "Useful Links", links: ["Pricing", "Summarist Business", "Gift Cards", "Authors & Publishers"] },
            { title: "Company", links: ["About", "Careers", "Partners", "Code of Conduct"] },
            { title: "Other", links: ["Sitemap", "Legal Notice", "Terms of Service", "Privacy Policies"] },
          ].map((block) => (
            <div className="footer__block" key={block.title}>
              <div className="footer__link--title">{block.title}</div>
              <div>
                {block.links.map((link) => (
                  <div className="footer__link--wrapper" key={link}>
                    <a className="footer__link">{link}</a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="footer__copyright--wrapper">
          <div className="footer__copyright">Copyright &copy; 2023 Summarist.</div>
        </div>
      </div>
    </footer>
  );
}