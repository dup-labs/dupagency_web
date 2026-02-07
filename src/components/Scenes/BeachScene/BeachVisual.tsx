
import BeachCards from "./BeachCards";
import BeachHeadline from "./Beachheadline";

const BeachVisual = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center flex-col h-dvh">
      <div
        className="headerContainer max-w-full lg:max-w-1/2 lg:mb-10 text-center"
      >
        <BeachHeadline />
      </div>
      <BeachCards />
    </div>
  )
}

export default BeachVisual