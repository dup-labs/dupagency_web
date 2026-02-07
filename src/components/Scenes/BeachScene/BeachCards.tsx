import Image from "next/image"
import BeachCard from "./BeachCard"

import IconMap from './assets/icon_mapear.png'
import IconTalk from './assets/icon_alinhar.png'
import IconRocket from './assets/icon_avancar.png'

const BeachCards = () => {
  return (
    <div className="cards_container gap-2 lg:gap-0 relative w-[90%] h-[90%] lg:w-[1224px] lg:h-[642px] flex flex-col lg:flex-row rounded-[20px]">
      <BeachCard
        position="left"
        title="Mapear"
        text="Entendemos o problema antes de propor qualquer solução. Isso economiza tempo, dinheiro e evita decisões erradas lá na frente."
        image={IconMap}
      />
      <BeachCard
        position="center"
        title="Alinhar"
        text="Definimos tudo com clareza: escopo, prioridades e expectativas. Sem ruído, sem promessa vaga, sem vai e volta desnecessário."
        image={IconTalk}
      />
      <BeachCard
        position="right"
        title="Avançar"
        text="Executamos com ritmo e responsabilidade. O projeto anda, as entregas acontecem e o foco permanece no que importa."
        image={IconRocket}
      />
    </div>
  )
}
export default BeachCards