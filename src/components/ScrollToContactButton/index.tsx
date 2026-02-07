'use client'

type Props = {
  label: string
  className?: string
}

const ScrollToContactButton = ({ label, className }: Props) => {
  const handleClick = () => {
    document.getElementById('contact')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm ${className}`}
    >
      {label}
    </button>
  )
}

export default ScrollToContactButton