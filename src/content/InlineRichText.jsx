// Parse markdown-style formatting in text
function parseMarkdown(text) {
  if (typeof text !== 'string') {
    return [{ type: 'text', content: text }];
  }

  // Regex pattern to match: **bold**, *italic*, `code`, ~~strikethrough~~, [link](url)
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;
  const segments = text.split(pattern).filter(Boolean);

  return segments.map((segment) => {
    // Bold: **text**
    if (segment.startsWith('**') && segment.endsWith('**') && segment.length > 4) {
      return { type: 'bold', content: segment.slice(2, -2) };
    }

    // Italic: *text* or _text_
    if (
      (segment.startsWith('*') && segment.endsWith('*') && segment.length > 2) ||
      (segment.startsWith('_') && segment.endsWith('_') && segment.length > 2)
    ) {
      return { type: 'italic', content: segment.slice(1, -1) };
    }

    // Code: `text`
    if (segment.startsWith('`') && segment.endsWith('`') && segment.length > 2) {
      return { type: 'code', content: segment.slice(1, -1) };
    }

    // Strikethrough: ~~text~~
    if (segment.startsWith('~~') && segment.endsWith('~~') && segment.length > 4) {
      return { type: 'strikethrough', content: segment.slice(2, -2) };
    }

    // Link: [text](url)
    const linkMatch = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return { type: 'link', content: linkMatch[1], url: linkMatch[2] };
    }

    return { type: 'text', content: segment };
  });
}

function renderSegment(segment, idx, tokens) {
  switch (segment.type) {
    case 'bold':
      return (
        <strong key={`bold-${idx}`} style={{ fontWeight: 700, color: tokens.colors.primary }}>
          {segment.content}
        </strong>
      );

    case 'italic':
      return (
        <em key={`italic-${idx}`} style={{ fontStyle: 'italic' }}>
          {segment.content}
        </em>
      );

    case 'code':
      return (
        <span
          key={`code-${idx}`}
          style={{
            fontFamily: tokens.fonts.monospace,
            fontSize: '0.9em',
            color: tokens.colors.primary,
            backgroundColor: tokens.colors.surfaceAlt,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: '5px',
            padding: '0.08em 0.34em',
            margin: '0 0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          {segment.content}
        </span>
      );

    case 'strikethrough':
      return (
        <span key={`strike-${idx}`} style={{ textDecoration: 'line-through', opacity: 0.7 }}>
          {segment.content}
        </span>
      );

    case 'link':
      return (
        <a
          key={`link-${idx}`}
          href={segment.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: tokens.colors.accent,
            textDecoration: 'underline',
          }}
        >
          {segment.content}
        </a>
      );

    case 'text':
    default:
      return <span key={`text-${idx}`}>{segment.content}</span>;
  }
}

export function InlineRichText({ text, tokens }) {
  if (typeof text !== 'string') {
    return text;
  }

  const segments = parseMarkdown(text);
  return <>{segments.map((segment, idx) => renderSegment(segment, idx, tokens))}</>;
}
