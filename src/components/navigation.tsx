import { useState } from 'react';
import { FaList, FaX } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme';
import logo from '../assets/logo-mf.png';

export function Navigation() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.portfolio'), href: '#portfolio' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm"
      style={{
        backgroundColor: `${colors.panel}f2`,
        borderBottom: `1px solid ${colors.border}`,
        height: 52,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center"
        >
          <img
            src={logo}
            alt="MF Logo"
            className="h-8 w-auto"
            draggable={false}
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="font-mono text-sm transition-colors"
              style={{ color: colors.muted }}
            >
              <span style={{ color: colors.accent }} className="mr-1">
                0{index + 1}.
              </span>
              <span
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.accent)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.muted)
                }
              >
                {item.label}
              </span>
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="md:hidden transition-colors"
          style={{ color: colors.muted }}
        >
          {isMenuOpen ? <FaX size={20} /> : <FaList size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          className="md:hidden px-4 py-4 space-y-3"
          style={{
            backgroundColor: colors.panel,
            borderTop: `1px solid ${colors.border}`,
          }}
        >
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block font-mono text-sm py-2 transition-colors"
              style={{ color: colors.muted }}
            >
              <span style={{ color: colors.accent }} className="mr-2">
                0{index + 1}.
              </span>
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
