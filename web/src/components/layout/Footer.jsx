import { Link } from "react-router-dom";
import { VscSend } from "react-icons/vsc";
import { TiSocialFacebook, TiSocialInstagram, TiSocialLinkedin, TiSocialTwitter,
} from "react-icons/ti";
import { accountLinks, quickLinks } from "../data/navigation";



const Footer = () => {
  return (
    <footer className="bg-card  border-t  border-border  mt-20 " >
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Newsletter */}
          <div>
            <Link to={"/"} className="text-2xl font-bold text-foreground pb-1">
              Shop
              <span className="text-primary">
                mandu
              </span>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Get 10% off your first order and stay updated with
              the latest products and offers.
            </p>

            <div className="relative mt-5">
              <input
                type="email"
                placeholder="Enter your email"
                className=" w-full h-12 pl-4 pr-14 rounded-xl border border-border bg-background outline-none transition focus:border-primary focus:ring-4 focus:ring-primary-light"
              />

              <button
                className=" absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center transition cursor-pointer"
              >
                <VscSend size={24} />
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <button
                className=" w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer
                "
              >
                <TiSocialFacebook size={22} />
              </button>

              <button
                className=" w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer
                "
              >
                <TiSocialInstagram size={22} />
              </button>

              <button
                className="  w-10 h-10  rounded-full  border  border-border  flex items-center justify-center  hover:bg-primary  hover:text-white  transition  cursor-pointe"   >
                <TiSocialLinkedin size={22} />
              </button>

              <button
                className="w-10 h-10 rounded-full borderborder-border flex items-center justify-center hover:bg-primary hover:text-white transition cursor-pointer">
                <TiSocialTwitter size={22} />
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Support
            </h3>

            <div className="mt-4 space-y-3 text-muted-foreground">
              <p>Kathmandu, Nepal</p>
              <p>support@shopmandu.com</p>
              <p>+977 9800000000</p>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {accountLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className=" text-muted-foreground hover:text-primary transition ">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className=" text-muted-foreground hover:text-primary transition">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className=" mt-12 pt-6 border-t  border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 ShopMandu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;