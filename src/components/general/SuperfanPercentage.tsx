import { LikeIcon } from "../../assets/svg"
import "../../assets/styles/SuperfanPercentageStyle.scss"

const SuperfanPercentage = (props: any) => {
  const { percentage } = props
  return (
    <div className="superfan-percentage-wrapper">
      <div className="header-title">
        <LikeIcon color="#DE5A67" width={25} height={25} />&nbsp;<span>SuperFans</span>
      </div>
      <div className="superfan-chart">
        <div className="chat-white">
          <div className="chat-outline">
            <div className="real-value"
              style={{
                background: `conic-gradient(
                  rgb(255, 255, 255) ${Math.round(percentage)}%,
                  rgba(245, 245, 244, 0.2) ${Math.round(percentage)}%
                )`
              }}
            >
              <div className="center-circle">
                <div className="percentage-superfan">
                  <span className="percentage">{Math.round(percentage)}%</span>
                  <span className="superfan">SuperFans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="superfans-letter">
        <span>
          Amazing! {Math.round(percentage)}% of the supporters are entitled as SuperFans to enjoy exclusive rewards!
        </span>
      </div>
    </div>
  )
}

export default SuperfanPercentage