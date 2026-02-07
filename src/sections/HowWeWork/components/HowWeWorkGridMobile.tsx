import HowWeWorkCard from "../HowWeWorkCard";
import HowWeWorkHeadline from "../HowWeWorkheadline";

const HowWeWorkGridMobile = ({IconGym,IconLock,IconMegaphone,IconTarget,IconTravel,IconTrophy}:any) => {
    return(
        <div data-layout="mobile" className="lg:hidden grid grid-cols-2 gap-x-2 gap-y-2">
            {/* LINHA 1 — 1 ITEM */}
            <div className="col-span-2 mb-8">
                <HowWeWorkHeadline />
            </div>

            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-xl text-right font-bold">Resposta rapida. <br />
                            <span className="text-brand-gradient inline-block">Sem Sumir</span>
                        </h3>
                    }
                    icon={IconTravel}
                    iconSize={100}
                    className=" flex items-end p-4"
                    iconClassName="absolute -left-2 -top-2"
                    
                />
            </div>

            {/* LINHA 2 — 4 ITENS */}

            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-xl font-bold">Clareza, <br />
                            <span className="text-brand-gradient inline-block">sempre!</span>
                        </h3>
                    }
                    icon={IconTarget}
                    iconSize={250}
                    className="flex items-end p-4"
                    iconClassName="absolute -left-4 -top-6"
                />
            </div>

            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-xl font-bold">Sem <br />discurso <br />
                            <span className="text-brand-gradient inline-block">técnico</span>
                            <br />desnecessário
                        </h3>
                    }
                    icon={IconMegaphone}
                    iconSize={160}
                    className="flex items-end p-4"
                    iconClassName="absolute -right-4 -top-4"
                />
            </div>

            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-xl font-bold">Feito e <br />
                            <span className="text-brand-gradient inline-block">validado!</span>
                            <br /> Sem vai e volta
                        </h3>
                    }
                    icon={IconTrophy}
                    iconSize={220}
                    className=" pt-4 flex items-top p-4"
                    iconClassName="absolute -right-10 -bottom-2"
                />
            </div>

            {/* LINHA 3 — 2 ITENS (NÃO 100%) */}
            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-xl font-bold text-end">
                            <span className="text-brand-gradient inline-block">Qualidade</span>
                            <br />como foco <br />
                            <span className="text-brand-gradient inline-block">principal </span>
                        </h3>
                    }
                    icon={IconLock}
                    iconSize={350}
                    className="flex items-top justify-end p-4"
                    iconClassName="absolute -left-10 top-22"
                />
            </div>

            <div className="col-span-1 h-68">
                <HowWeWorkCard 
                    title={
                        <h3 className="text-lg font-bold text-end leading-none">Menos complexidade, <br />
                            <span className="text-brand-gradient inline-block">mais resultado!</span>
                        </h3>
                    }
                    icon={IconGym}
                    iconSize={380}
                    className="flex items-end justify-end p-4"
                    iconClassName="absolute -right-6 top-2"
                />
            </div>
        </div>
    )
}

export default HowWeWorkGridMobile