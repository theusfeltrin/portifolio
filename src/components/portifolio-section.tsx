import { useTranslation } from 'react-i18next';
import {
  FaGithub,
  FaRegFileCode,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6';
import { colors } from '../theme/colors';

interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  tags: string[];
}

export function PortfolioSection() {
  const { t } = useTranslation();

  const projects = t('portfolio.projects', {
    returnObjects: true,
  }) as Project[];

  return (
    <section
      id="portfolio"
      className="min-h-screen px-4 py-16 md:py-20"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Section Title */}
        <div className="mb-10 md:mb-12">
          <div
            className="font-mono text-xs md:text-sm mb-2"
            style={{ color: colors.comment }}
          >
            <span style={{ color: colors.muted }}>
              {t('portfolio.section.index')}
            </span>{' '}
            // {t('portfolio.section.comment')}
          </div>

          <h2
            className="font-mono text-2xl md:text-3xl"
            style={{ color: colors.text }}
          >
            {t('portfolio.section.title')}
            <span style={{ color: colors.accent }}>()</span>
          </h2>
        </div>

        {/* Project Grid */}
        <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
}

const languageColors: Record<string, string> = {
  'Node.js': colors.comment,
  Go: colors.accent,
  Python: colors.number,
  TypeScript: colors.accent,
};

function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  const languageColor = languageColors[project.language] ?? colors.muted;

  return (
    <div
      className="rounded-sm p-5 transition-colors group"
      style={{
        backgroundColor: colors.panel,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* File */}
      <div className="flex items-center gap-2 mb-3">
        <FaRegFileCode className="w-4 h-4" style={{ color: colors.accent }} />
        <span
          className="font-mono text-sm md:text-base"
          style={{ color: colors.text }}
        >
          {project.name}
        </span>
      </div>

      {/* Description */}
      <p
        className="text-sm mb-4 leading-relaxed"
        style={{ color: colors.muted }}
      >
        {project.description}
      </p>

      {/* Language */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: languageColor }}
        />
        <span className="font-mono text-xs" style={{ color: colors.muted }}>
          {project.language}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 font-mono text-xs rounded-sm"
            style={{
              backgroundColor: colors.bg,
              color: colors.muted,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <ActionButton icon={<FaGithub />} label={t('portfolio.actions.code')} />
        <ActionButton
          icon={<FaArrowUpRightFromSquare />}
          label={t('portfolio.actions.live')}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition-colors"
      style={{ color: colors.accent }}
    >
      {icon}
      {label}
    </button>
  );
}
