'use client'

import { initLenis } from '@/lib/lenis'

const Header = () => {
    
    const lenis = initLenis()
    
    const scrollToTop = () => {
      lenis?.scrollTo(0)
    }

    return(
       <header className="w-full max-w-[98%] left-[1%] fixed top-0 z-50 py-4">
        <h1 onClick={scrollToTop} className="relative text-3xl inline-block px-4 py-2 rounded-lg bg-white/1 backdrop-blur-[10px] cursor-pointer">
            <span className=""
                style={{color: 'var(--foreground)'}}
            >dup<strong className="font-semibold">.agency</strong></span>
        </h1>
       </header>

    )
}

export default Header