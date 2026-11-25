const PLACEHOLDER = /(\[\[ISI:.*?\]\])/

export function TemplateText({ text }: { text: string | null | undefined }) {
  if (!text) return null

  return text.split(PLACEHOLDER).map((part, index) => {
    const match = part.match(/^\[\[ISI:\s*(.*?)\]\]$/)
    if (!match) return part
    return (
      <span key={index} className="template-chip">
        {match[1]} menyusul
      </span>
    )
  })
}
