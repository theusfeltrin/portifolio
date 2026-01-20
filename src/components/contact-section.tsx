import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaGithub,
  FaLinkedin,
  FaRegPaperPlane,
  FaRegEnvelope,
} from 'react-icons/fa6';
import { colors } from '../theme/colors';

export function ContactSection() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      className="px-4 py-16 md:py-20 pb-24"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Title */}
        <div className="mb-10 md:mb-12">
          <div
            className="font-mono text-xs md:text-sm mb-2"
            style={{ color: colors.comment }}
          >
            <span style={{ color: colors.muted }}>03.</span>{' '}
            {t('contact.subtitle')}
          </div>

          <h2
            className="font-mono text-2xl md:text-3xl"
            style={{ color: colors.text }}
          >
            {t('contact.title')}
            <span style={{ color: colors.accent }}>.send()</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <div
            className="rounded-sm p-6"
            style={{
              backgroundColor: colors.panel,
              border: `1px solid ${colors.border}`,
            }}
          >
            <div
              className="font-mono text-xs mb-4"
              style={{ color: colors.comment }}
            >
              {t('contact.formHeader')}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {(['name', 'email', 'message'] as const).map((field) => (
                <div key={field}>
                  <label
                    htmlFor={field}
                    className="block font-mono text-xs mb-2"
                    style={{ color: colors.muted }}
                  >
                    <span style={{ color: colors.accent }}>$</span>{' '}
                    {t(`contact.fields.${field}.label`)}
                  </label>

                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      rows={5}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={t(`contact.fields.${field}.placeholder`)}
                      className="w-full rounded-sm px-3 py-2 font-mono text-sm resize-none focus:outline-none"
                      style={{
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      required
                    />
                  ) : (
                    <input
                      id={field}
                      name={field}
                      type={field === 'email' ? 'email' : 'text'}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={t(`contact.fields.${field}.placeholder`)}
                      className="w-full rounded-sm px-3 py-2 font-mono text-sm focus:outline-none"
                      style={{
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      required
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm rounded-sm transition active:scale-95 cursor-pointer"
                style={{ backgroundColor: colors.accent, color: '#fff' }}
              >
                <FaRegPaperPlane className="w-4 h-4" />
                {t('contact.submit')}
              </button>
            </form>
          </div>

          {/* Social */}
          <div className="space-y-6">
            <div
              className="rounded-sm p-6"
              style={{
                backgroundColor: colors.panel,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="font-mono text-xs mb-4"
                style={{ color: colors.comment }}
              >
                {t('contact.socialHeader')}
              </div>

              <div className="space-y-3">
                <SocialLink
                  icon={<FaGithub />}
                  label="GitHub"
                  value="@theusfeltrin"
                  href="https://github.com/theusfeltrin"
                />
                <SocialLink
                  icon={<FaLinkedin />}
                  label="LinkedIn"
                  value="/in/matheusfeltrin"
                  href="https://www.linkedin.com/in/matheus-trindade-feltrin/"
                />
                <SocialLink
                  icon={<FaRegEnvelope />}
                  label="Email"
                  value="matheus@email.com"
                  href="mailto:matheus@email.com"
                />
              </div>
            </div>

            <div
              className="rounded-sm p-6"
              style={{
                backgroundColor: colors.panel,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="font-mono text-xs mb-3"
                style={{ color: colors.comment }}
              >
                {t('contact.availability.title')}
              </div>

              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.muted }}
              >
                {t('contact.availability.text')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface SocialLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}

function SocialLink({ icon, label, value, href }: SocialLinkProps) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-sm transition group"
      style={{ backgroundColor: colors.bg }}
    >
      <div style={{ color: colors.accent }}>{icon}</div>

      <div className="flex-1">
        <div className="font-mono text-xs" style={{ color: colors.muted }}>
          {label}
        </div>
        <div className="font-mono text-sm" style={{ color: colors.text }}>
          {value}
        </div>
      </div>
    </a>
  );
}
