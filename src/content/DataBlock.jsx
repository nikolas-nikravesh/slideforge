import { Box, CodePane, codePaneThemes } from 'spectacle';

export function DataBlock({ data }) {
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  return (
    <Box
      style={{
        borderLeft: '2px solid rgba(201, 168, 76, 0.25)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}
    >
      <CodePane language="json" theme={codePaneThemes.vsDark}>
        {jsonString}
      </CodePane>
    </Box>
  );
}
