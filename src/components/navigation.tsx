"use client";

import { Menu, X } from "lucide-react";
import * as React from "react";

const navigationItems = [
  { href: "#artists", label: "BEWONERS" },
  { href: "#courses", label: "CURSUSSEN" },
  { href: "#agenda", label: "AGENDA" },
  { href: "#over-ons", label: "OVER ONS" },
  { href: "#contact", label: "CONTACT" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">
            Ateliers Kersenboomgaard
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-6 md:flex">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-md px-4 py-2 text-sm tracking-wide text-gray-600 uppercase transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:bg-gray-100/50 focus:text-gray-900 focus:outline-none"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md p-2 hover:bg-gray-100/50 focus:bg-gray-100/50 focus:outline-none md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-900" />
            ) : (
              <Menu className="h-6 w-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="mt-4 border-t border-gray-200/50 pt-4 pb-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="rounded-md px-4 py-3 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
