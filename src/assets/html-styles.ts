export const htmlTemplate = ({
  body,
  title = 'TNO Scenario generator',
  desc = "Output from TNO's scenario generator",
  css = '',
}: {
  body: string;
  title?: string;
  desc?: string;
  css?: string;
}): string => `
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="author" content="TNO">

  <meta property="og:title" content="${title}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://tnocs.github.io/scenario-generator/">
  <meta property="og:description" content="${desc}">

  ${css}
</head>

<body>
  <!-- your content here... -->
  ${body}
</body>
</html>
`;

export const cssTable = `<style>
td, th {
  border: 1px solid black;
  padding: 0.5rem;
}
th {
  background-color:#999;
}
table {
  font-family: Calibri;
  font-size: 8pt;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0.5rem;
}
</style>`;
