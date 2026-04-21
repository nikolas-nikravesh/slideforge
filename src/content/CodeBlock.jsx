import { Box, CodePane, codePaneThemes } from 'spectacle';

export function CodeBlock({ code, language = 'javascript', fontSize }) {
  const wrapperClass = fontSize ? 'code-block-custom-size' : '';

  return (
    <>
      {fontSize && (
        <style>{`
          .code-block-custom-size pre,
          .code-block-custom-size code,
          .code-block-custom-size * {
            font-size: ${fontSize} !important;
          }
        `}</style>
      )}
      <Box
        style={{
          borderLeft: '2px solid rgba(201, 168, 76, 0.25)',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '100%',
        }}
      >
        <div className={wrapperClass}>
          <CodePane language={language} theme={codePaneThemes.vsDark}>
            {code}
          </CodePane>
        </div>
      </Box>
    </>
  );
}
