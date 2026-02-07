
type Props = {
    text:React.ReactNode,
    index: number,
    className: string
}
const MatchItem = ({text,index,className}:Props) => {
    const overlays = [
        'bg-white/5',
        'bg-white/10',
        'bg-white/15',
        'bg-white/20',
        'bg-white/25',
        'bg-white/30',
        'bg-white/35',
        'bg-white/40',
    ];
    
    const offsets = [
        '-top-0',
        '-top-10',
        '-top-20',
        '-top-30',
        '-top-40',
        '-top-50',
    ];
    const zParams = [
        'z-50',
        'z-40',
        'z-30',
        'z-20',
        'z-10',
    ];

    const overlay = overlays[index];
    const offset = offsets[index];
    const z = zParams[index];


    return(
       <article 
            className={`absolute text-white lg:w-4/6 flex justify-center items-center ${className}  ${offset}  ${z}`}
       >
             <div
                className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${overlay}`}
            />
            <div className={`w-full h-[360px] lg:h-[480px] bg-black p-12 rounded-2xl flex items-center justify-center leading-[1.6] lg:leading-12 text-md lg:text-xl`}>
                {text}
            </div>
        </article>

    )
}

export default MatchItem