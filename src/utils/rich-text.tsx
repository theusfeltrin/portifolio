import React from 'react';
import { colors } from '../theme';

const syntaxColorMap = {
  accent: colors.accent,
  keyword: colors.keyword,
  number: colors.number,
  string: colors.string,
  variable: colors.variable,
  comment: colors.comment,
};

interface RichTextProps {
  text: string;
}

export function RichText({ text }: RichTextProps) {
  return (
    <>
      {text.split(/(<\/?\w+>)/g).map((part, index) => {
        const match = part.match(/^<(\w+)>$/);

        if (match) return null;

        const openTag = part.match(/^<(\w+)>/);
        const closeTag = part.match(/^<\/(\w+)>/);

        if (openTag) return null;
        if (closeTag) return null;

        const tagMatch = text
          .slice(0, text.indexOf(part))
          .match(/<(\w+)>[^<]*$/);

        if (!tagMatch) {
          return <span key={index}>{part}</span>;
        }

        const color =
          syntaxColorMap[tagMatch[1] as keyof typeof syntaxColorMap];

        return (
          <span key={index} style={{ color }}>
            {part}
          </span>
        );
      })}
    </>
  );
}
