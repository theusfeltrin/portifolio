import { useTranslation } from 'react-i18next';
import { colors } from '../theme';
import { RichText } from '../utils';

export function AboutSection() {
  const { t } = useTranslation();

  const introLines = t('about.intro', { returnObjects: true }) as string[];
  const expertise = t('about.expertise', { returnObjects: true }) as string[];

  return (
    <section id="about" className="px-4 py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="mb-8 md:mb-10 font-mono">
          <div
            className="text-xs md:text-sm mb-2"
            style={{ color: colors.comment }}
          >
            <span style={{ color: colors.muted }}>01.</span> //{' '}
            {t('about.section')}
          </div>

          <h2 className="text-2xl md:text-3xl" style={{ color: colors.text }}>
            {t('about.title')}
            <span style={{ color: colors.accent }}>.md</span>
          </h2>
        </div>

        {/* Content */}
        <div
          className="rounded-sm p-6 md:p-8"
          style={{
            backgroundColor: colors.panel,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Comment-style intro */}
          <div
            className="font-mono text-sm md:text-base mb-6 leading-relaxed"
            style={{ color: colors.comment }}
          >
            /**
            <br />
            {introLines.map((line, i) => (
              <span key={i}>
                &nbsp;* {line}
                <br />
              </span>
            ))}
            &nbsp;*/
          </div>

          {/* Main content */}
          <div
            className="space-y-4 leading-relaxed"
            style={{ color: colors.text }}
          >
            <p>
              <RichText text={t('about.p1')} />
            </p>

            <p>
              <RichText text={t('about.p2')} />
            </p>

            {/* Expertise block */}
            <div className="pt-4 font-mono text-xs md:text-sm">
              <div style={{ color: colors.text }}>
                <span style={{ color: colors.keyword }}>const</span>{' '}
                <span style={{ color: colors.variable }}>expertise</span> = [
              </div>

              <div className="pl-4 md:pl-6" style={{ color: colors.string }}>
                {expertise.map((item) => (
                  <div key={item}>"{item}",</div>
                ))}
              </div>

              <div style={{ color: colors.text }}>];</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
