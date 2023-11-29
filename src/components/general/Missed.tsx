import { useNavigate } from "react-router-dom"
import { RewardIcon } from "../../assets/svg"
import "../../assets/styles/MissedStyle.scss"
import Button from "./button"

const Missed = (props: any) => {
  const { rewardText, item } = props
  const navigate = useNavigate()

  return (
    <div className="missed-wrapper">
      <div className="header-title">
        <span>You Have Missed </span>
      </div>
      <div className="missed-part">
        <div className="top-letter">
          <span>SuperFans can enjoy the followings</span>
        </div>
        <div className="reward-info"
          style={{
            background: item.type === "dareme" ? 'linear-gradient(136.21deg, #FFDD94 0%, #FFC38D 27.6%, #FEB389 53.35%, #FDA384 74.31%, #F68B77 100%)' :
              'linear-gradient(121.78deg, #14C3C9 0%, #14AFC9 29.13%, #14A5C9 54.17%, #1490C9 97.1%)'
          }}
        >
          <div className="reward-title">
            <RewardIcon color="white" />&nbsp;&nbsp;<span>Reward for SuperFans</span>
          </div>
          <div className="divider"></div>
          <div className="reward-text">
            <span>{rewardText}</span>
          </div>
        </div>
        <div className="top-letter">
          <span>and exclusive content creation from your favourite creators!</span>
        </div>
        <div className="dare-again">
          <Button
            text={"Dare Again"}
            fillStyle="fill"
            color="primary"
            width={180}
            shape="rounded"
            handleSubmit={() => { 
              if(item.type === "dareme") navigate(`/dareme/details/${item.id}`) 
              else navigate(`/fundme/details/${item.id}`) 
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Missed