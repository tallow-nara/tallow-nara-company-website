import { readFileSync, writeFileSync } from 'node:fs'

import ts from 'typescript'

for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, 'utf8')
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const ranges = new Map()

  const collect = (node) => {
    for (const range of ts.getLeadingCommentRanges(text, node.getFullStart()) ?? []) ranges.set(range.pos, range)
    for (const range of ts.getTrailingCommentRanges(text, node.end) ?? []) ranges.set(range.pos, range)
    ts.forEachChild(node, collect)
  }
  collect(source)
  for (const range of ts.getLeadingCommentRanges(text, source.endOfFileToken.getFullStart()) ?? []) ranges.set(range.pos, range)

  let output = text
  for (const { pos, end } of [...ranges.values()].sort((a, b) => b.pos - a.pos)) {
    const lineStart = output.lastIndexOf('\n', pos - 1) + 1
    const lineEnd = output.indexOf('\n', end)
    const ownLine = !output.slice(lineStart, pos).trim() && !output.slice(end, lineEnd === -1 ? undefined : lineEnd).trim()
    output = ownLine
      ? output.slice(0, lineStart) + output.slice(lineEnd === -1 ? output.length : lineEnd + 1)
      : output.slice(0, pos).trimEnd() + output.slice(end)
  }

  writeFileSync(file, output.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, ''))
}
