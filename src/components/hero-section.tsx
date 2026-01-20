import { useTranslation } from 'react-i18next';
import {
  FaNodeJs,
  FaGolang,
  FaPython,
  FaDeskpro,
  FaReact,
  FaRegFile,
} from 'react-icons/fa6';
import { BiLogoTypescript } from 'react-icons/bi';
import { RiContactsLine } from 'react-icons/ri';
import { colors } from '../theme';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 pt-24">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:gap-12">
          <div className="flex-1 font-mono">
            {/* Code header */}
            <div className="mb-10">
              <div className="text-sm mb-2" style={{ color: colors.comment }}>
                {t('hero.file')}
              </div>

              <div
                className="text-2xl md:text-4xl leading-relaxed"
                style={{ color: colors.text }}
              >
                <div>
                  <span style={{ color: colors.keyword }}>const</span>{' '}
                  <span style={{ color: colors.number }}>developer</span> ={' '}
                  {'{'}
                </div>

                <div className="pl-6">
                  <span style={{ color: colors.variable }}>name</span>:{' '}
                  <span style={{ color: colors.string }}>
                    "{t('hero.name')}"
                  </span>
                  ,
                </div>

                <div className="pl-6">
                  <span style={{ color: colors.variable }}>role</span>:{' '}
                  <span style={{ color: colors.string }}>
                    "{t('hero.role')}"
                  </span>
                  ,
                </div>

                <div>
                  {'}'}
                  <span
                    className="ml-1 inline-block animate-blink"
                    style={{ color: colors.text }}
                  >
                    |
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p
              className="max-w-2xl mb-10 leading-relaxed"
              style={{ color: colors.muted }}
            >
              {t('hero.description')}
            </p>

            {/* Tech stack */}
            <div className="mb-12">
              <div className="text-base mb-3" style={{ color: colors.comment }}>
                {t('hero.techStack')}
              </div>

              <div className="flex flex-wrap gap-3">
                <TechBadge color="comment">
                  <FaNodeJs />
                  <span>Node.js</span>
                </TechBadge>
                <TechBadge color="accent">
                  <BiLogoTypescript />
                  <span>TypeScript</span>
                </TechBadge>
                <TechBadge color="keyword">
                  <FaReact />
                  <span>React</span>
                </TechBadge>
                <TechBadge color="accent">
                  <FaGolang />
                  <span>Go</span>
                </TechBadge>
                <TechBadge color="number">
                  <FaPython />
                  <span>Python</span>
                </TechBadge>
                <TechBadge color="comment">
                  <FaDeskpro />
                  <span>PostgreSQL</span>
                </TechBadge>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#portfolio"
                className="px-6 py-3 flex justify-center items-center rounded-sm text-center font-mono transition active:scale-95 gap-2"
                style={{
                  backgroundColor: colors.accent,
                  color: '#fff',
                }}
              >
                <FaRegFile />
                <span>{t('hero.ctaPortfolio')}</span>
              </a>

              <a
                href="#contact"
                className="px-6 py-3 flex justify-center items-center rounded-sm text-center font-mono transition gap-2"
                style={{
                  border: `1px solid ${colors.border}`,
                  color: colors.text,
                }}
              >
                <RiContactsLine />
                <span>{t('hero.ctaContact')}</span>
              </a>
            </div>
          </div>

          <div className="hidden md:block md:w-80">
            <PhotoFrame />
          </div>
        </div>
      </div>
    </section>
  );
}

interface TechBadgeProps {
  children: React.ReactNode;
  color: keyof typeof colors;
}

function TechBadge({ children, color }: TechBadgeProps) {
  return (
    <span
      className="px-4 py-2 border rounded-sm text-base font-mono flex items-center justify-center gap-2"
      style={{
        borderColor: colors[color],
        color: colors[color],
      }}
    >
      {children}
    </span>
  );
}

function PhotoFrame() {
  return (
    <div className="relative">
      <div
        className="absolute -inset-4 opacity-30"
        style={{ border: `1px solid ${colors.accent}` }}
      />
      <div
        className="absolute -inset-2 opacity-20"
        style={{ border: `1px solid ${colors.accent}` }}
      />

      <div
        className="relative aspect-square overflow-hidden"
        style={{
          backgroundColor: colors.panel,
          border: `2px solid ${colors.border}`,
        }}
      >
        {/* Code overlay decoration - top */}
        <div
          className="absolute top-0 inset-x-0 px-3 py-2 font-mono text-xs flex items-center gap-2"
          style={{
            backgroundColor: colors.panel,
            borderBottom: `1px solid ${colors.border}`,
            color: colors.comment,
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.comment }}
          />
          profile.jpg
        </div>

        <img
          src="https://github.com/theusfeltrin.png"
          alt="Matheus T. Feltrin"
          className="w-full h-full object-cover mt-10"
        />
        {/* Code overlay decoration - bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-3"
          style={{
            backgroundColor: colors.panelOpc,
          }}
        >
          <div className="font-mono text-xs">
            <span style={{ color: colors.keyword }}>export default </span>
            <span style={{ color: colors.number }}>Developer() ;</span>
          </div>
        </div>
      </div>

      <div
        className="absolute -bottom-3 -right-3 w-16 h-16"
        style={{
          borderRight: `2px solid ${colors.accent}`,
          borderBottom: `2px solid ${colors.accent}`,
        }}
      />
    </div>
  );
}
