import { categories } from "@/constants/categories";
import { perks } from "@/constants/perks";
import { quicklinks } from "@/constants/quicklinks";
import { socials } from "@/constants/socials";
import { ArrowRight, Mail, MapPin, Phone, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import cartzy from "../../public/cartzy1.png";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

export default function Footer() {
  return (
    <footer className="relative bg-white text-gray-800 overflow-hidden border-t border-gray-300 mt-10">
      <div className="relative border-b border-gray-300 bg-green-50">
        <div className="max-w-7xl mx-auto py-5 grid grid-cols-4 gap-4">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div key={perk.title} className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {perk.title}
                  </p>
                  <p className="text-xs text-gray-500">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Image
                  src={cartzy}
                  alt="cartzy"
                  height={52}
                  width={52}
                  className="-m-2"
                />
                <span className="text-2xl font-black tracking-tight bg-linear-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                  cartzy
                  <sup className="align-super text-[10px] leading-none ml-1">
                    <Badge className="bg-green-100 text-green-600 border-green-200 text-[10px] font-semibold">
                      FRESH
                    </Badge>
                  </sup>
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Bengaluru's freshest grocery delivery. From local farms to your
                doorstep in under 30 minutes — every single day.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-600 mb-2">
                Get fresh deals
              </p>
              <form
              // onSubmit={handleSearch}
              >
                <ButtonGroup className="w-full">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-800 placeholder:text-gray-400 focus-visible:border-green-400 transition-colors"
                  />
                  <Button className="bg-green-500 hover:bg-green-600 active:scale-95 transition-all duration-150 cursor-pointer">
                    <ArrowRight />
                  </Button>
                </ButtonGroup>
              </form>
            </div>

            <div className="flex gap-2">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="p-2.5 rounded-lg bg-gray-100 hover:bg-green-100 border border-gray-200 hover:border-green-300 text-gray-500 hover:text-green-600 transition-all"
                  aria-label={s.label}
                >
                  <Image src={s.icon} alt={s.label} height={16} width={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 ml-4 w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {quicklinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1.5 group transition-colors"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-green-500" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 ml-4 w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">
              Categories
            </h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="text-sm text-gray-500 hover:text-green-600 flex items-center gap-1.5 group transition-colors"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-green-500 text-nowrap" />
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 w-fit relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full cursor-default">
              Contact Us
            </h3>
            <div className="flex flex-col gap-2">
              {[
                {
                  icon: <MapPin className="w-4 h-4 shrink-0" />,
                  text: "Marathalli, Bengaluru, Karnataka 560037",
                },
                {
                  icon: <Phone className="w-4 h-4 shrink-0" />,
                  text: "+91 87868 68890",
                },
                {
                  icon: <Mail className="w-4 h-4 shrink-0" />,
                  text: "support@cartzy.in",
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 group">
                  <span className="mt-0.5 text-green-500">{item.icon}</span>
                  <p className="text-sm text-gray-500 group-hover:text-gray-800 transition-colors leading-snug">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2 p-3 rounded-xl bg-green-50 border border-green-100">
              <p className="text-xs font-semibold text-green-600 mb-0.5">
                Support Hours
              </p>
              <p className="text-xs text-gray-500">
                Mon &ndash; Sun · 7:00 AM &ndash; 11:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-gray-300 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} cartzy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-green-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-green-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/refund"
              className="hover:text-green-600 transition-colors"
            >
              Refund Policy
            </Link>
          </div>
          <p className="text-xs text-gray-400">
            Made with ❤️ by{" "}
            <span className="text-green-500 font-medium">@Rajat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
