const Background = () => {
  return (
    <div 
        id='global-bg'
        className="fixed h-dvh lg:h-screen w-screen bg-gray-800 top-0 left-0 -z-1 transition-all duration-600 ease-in-out"
        style={{ backgroundColor: 'var(--background)' }}
    ></div>
  )
}

export default Background