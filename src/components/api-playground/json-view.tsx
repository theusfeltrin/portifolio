import { colors } from '../../theme';

// strings (incluindo chaves seguidas de ":"), literais e números
const TOKEN_PATTERN =
  /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

// o x-user-id funciona como segredo do usuário: não exibir
function redact(key: string, value: unknown) {
  return key === 'user_id' ? '[redacted]' : value;
}

function tokenColor(token: string): string {
  if (token.startsWith('"')) {
    return token.endsWith(':') ? colors.variable : colors.string;
  }
  if (token === 'true' || token === 'false' || token === 'null') {
    return colors.keyword;
  }
  return colors.number;
}

export function JsonView({ value }: { value: unknown }) {
  const json = JSON.stringify(value, redact, 2);

  return (
    <pre
      className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all"
      style={{ color: colors.text }}
    >
      {json.split(TOKEN_PATTERN).map((part, index) =>
        // split com grupo de captura: índices ímpares são os tokens
        index % 2 === 1 ? (
          <span key={index} style={{ color: tokenColor(part) }}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </pre>
  );
}
