import HowWeWorkCard from "../HowWeWorkCard";
import HowWeWorkHeadline from "../HowWeWorkheadline";

const HowWeWorkGridDesktop = ({IconGym,IconLock,IconMegaphone,IconTarget,IconTravel,IconTrophy}:any) => {
    return(
        <div data-layout="desktop" className="hidden lg:grid grid-cols-20 gap-x-6 gap-y-10">
            {/* LINHA 1 — 1 ITEM */}
            <div className="col-span-12 col-start-9 h-32">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-3xl font-bold">Resposta rapida. <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">Sem Sumir</span>
                        </h3>
                    }
                    icon={IconTravel}
                    iconSize={150}
                    className="pl-36 flex items-center"
                    iconClassName="absolute -left-10 -top-4"
                    
                />
            </div>

            {/* LINHA 2 — 4 ITENS */}
            <div className="col-span-8 h-88">
                <HowWeWorkHeadline />
            </div>

            <div className="col-span-4 h-88">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-5xl font-bold">Clareza, <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">sempre!</span>
                        </h3>
                    }
                    icon={IconTarget}
                    iconSize={250}
                    className="pl-4 pb-4 flex items-end"
                    iconClassName="absolute -left-4 -top-6"
                />
            </div>

            <div className="col-span-4 h-88">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-4xl font-bold">Sem <br />discurso <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">técnico</span>
                            <br />desnecessário
                        </h3>
                    }
                    icon={IconMegaphone}
                    iconSize={219}
                    className="pl-4 pb-4 flex items-end"
                    iconClassName="absolute -right-8 top-6"
                />
            </div>

            <div className="col-span-4 h-88">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-5xl font-bold">Feito e <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">validado!</span>
                            <br /> Sem vai e volta
                        </h3>
                    }
                    icon={IconTrophy}
                    iconSize={220}
                    className="pl-4 pt-4 flex items-top"
                    iconClassName="absolute -right-10 -bottom-6"
                />
            </div>

            {/* LINHA 3 — 2 ITENS (NÃO 100%) */}
            <div className="col-span-8 col-start-5 h-88">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-7xl font-bold text-end">
                            <span className="text-brand-gradient inline-block pl-1 pr-1">Qualidade</span>
                            <br />como foco <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">principal </span>
                        </h3>
                    }
                    icon={IconLock}
                    iconSize={350}
                    className="pr-12 flex items-center justify-end"
                    iconClassName="absolute -left-10 top-22"
                />
            </div>

            <div className="col-span-8 h-88">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-5xl font-bold text-end">Menos complexidade, <br />
                            <span className="text-brand-gradient inline-block pl-1 pr-1">mais resultado!</span>
                        </h3>
                    }
                    icon={IconGym}
                    iconSize={380}
                    className="pr-10 pt-10 flex items-top justify-end"
                    iconClassName="absolute -left-6 -bottom-22"
                />
            </div>
        </div>
    )
}

export default HowWeWorkGridDesktop