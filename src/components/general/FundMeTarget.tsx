import { useContext } from "react"
import { LanguageContext } from "../../routes/authRoute"
import { CreatoCoinIcon } from "../../assets/svg"
import "../../assets/styles/FundMeTargetStyle.scss"

const FundMeTarget = (props: any) => {
  const { wallet, goal } = props
  const contexts = useContext(LanguageContext)

  const displayProcess = (length: any) => {
    const interval = goal ? (Number(goal) / 20).toFixed(1) : 0
    const count = goal ? Number(Math.floor(Number(wallet) / Number(interval))) : 0
    const width = wallet < interval ? Math.floor(Number(interval) / Number(goal) * length) : Math.floor(Number(interval) * count / Number(goal) * length)
    return width
  }

  return (
    <div className="fundme-target-wrapper">
      <div className="header-title">
        <span>FundMe Target</span>
      </div>
      <div className="fundme-target-part">
        <div className="chart-bar">
          <div className="back-circle"></div>
          <div className="current-bar" style={{ clipPath: `inset(${200 - displayProcess(200)}px 0px 0px 0px)` }}></div>
          <div className="white-part"></div>
          <div className="white-part-hori-rect"></div>
          <div className="white-part-hori-rect1"></div>
        </div>
        <div className="funding-goal">
          <div className="title">
            <CreatoCoinIcon color="#EFA058" />
            <label>{wallet < goal ? contexts.CREATE_FUNDME_LETTER.FUNDING_GOAL : contexts.CREATE_FUNDME_LETTER.GOAL_REACHED}</label>
          </div>
          <div className="process-bar">
            <div className="process-value" style={{ width: wallet < goal ? `${displayProcess(270)}px` : `270px` }}></div>
          </div>
          <div className="donuts-count">
            <span><span className={wallet >= goal ? "over-donuts" : ""}>{wallet.toLocaleString()}</span> / {goal.toLocaleString()} {contexts.GENERAL_LETTER.DONUTS}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundMeTarget