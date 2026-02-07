type Props = {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
}

const SectionHeadline = ({ eyebrow, title, subtitle }: Props) => {
  return (
    <header className="headline">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm">
          {eyebrow}
        </span>
      )}

      <div className="headline_title">
        {title} 
      </div>

      {subtitle &&
      <div className="headline_text">
        {subtitle}
      </div> 
      }
    </header>
  )
}

export default SectionHeadline