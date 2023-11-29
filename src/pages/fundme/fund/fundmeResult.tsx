import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { fundmeAction } from "../../../redux/actions/fundmeActions"
import { fanwallAction } from "../../../redux/actions/fanwallActions"
import ContainerBtn from "../../../components/general/containerBtn"
import PyramidCard from "../../../components/general/PyramidCard"
import Missed from "../../../components/general/Missed"
import SuperfanPercentage from "../../../components/general/SuperfanPercentage"
import ListSuperFans from "../../../components/general/ListSuperFans"
import TopFan from "../../../components/general/TopFan"
import FundMeTarget from "../../../components/general/FundMeTarget"
import Dialog from "../../../components/general/dialog"
import { LanguageContext } from "../../../routes/authRoute"
import { CreatoCoinIcon, RewardIcon, SpreadIcon, BackIcon, NoOfPeopleIcon } from "../../../assets/svg"
import { SET_FUNDME_DETAIL_INITIAL } from "../../../redux/types"
import "../../../assets/styles/fundme/fund/fundmeResultStyle.scss"

const FundmeResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const contexts = useContext(LanguageContext)

  const { fundmeId } = useParams()
  const fundmeState = useSelector((state: any) => state.fundme)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)
  const [isStay, setIsStay] = useState(false)
  const [isReward, setIsReward] = useState(false)

  const { fundme } = fundmeState
  const { user } = userState
  const { prevRoute } = loadState

  const [pyramid, setPyramid] = useState(false)
  const [topFan, setTopFan] = useState(false)
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get("superfan")

  const showCard = () => {
    if (user) {
      const filters = fundme.voteInfo.filter((vote: any) => vote.voter._id === user.id && vote.superfan === true)
      if (filters.length > 0) {
        if (code === null) setPyramid(true)
        else {
          if (code === 'true') setPyramid(true)
          else setPyramid(false)
        }
      }
      else setPyramid(false)
    } else setPyramid(false)
    if (user && (user.id === fundme.owner._id || user.role === "ADMIN")) setTopFan(false)
    else setTopFan(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fundmeAction.getFundmeResult(fundmeId))
  }, [location, dispatch, fundmeId])
  useEffect(() => {
    if (flag) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
    }
  }, [time, flag])
  useEffect(() => {
    if (fundme.owner) {
      if (fundme.finished === false && code === null) {
        dispatch({ type: SET_FUNDME_DETAIL_INITIAL })
        navigate(`/fundme/details/${fundmeId}`)
      }
      setTime(fundme.time)
      setFlag(true)
      showCard()
    }
  }, [fundme])

  const displayTime = (left: any) => {
    let res: any
    if (left <= 0) {
      const passTime = Math.abs(left)
      res = contexts.ITEM_CARD.ENDED
      if (Math.floor(passTime / (3600 * 24 * 30)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 30)) + '' + (Math.floor(passTime / (3600 * 24 * 30)) === 1 ? contexts.ITEM_CARD.MONTH : contexts.ITEM_CARD.MONTHS)
      else if (Math.floor(passTime / (3600 * 24 * 7)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24 * 7)) + '' + (Math.floor(passTime / (3600 * 24 * 7)) === 1 ? contexts.ITEM_CARD.WEEK : contexts.ITEM_CARD.WEEKS)
      else if (Math.floor(passTime / (3600 * 24)) >= 1) res = res + ' ' + Math.floor(passTime / (3600 * 24)) + '' + (Math.floor(passTime / (3600 * 24)) === 1 ? contexts.ITEM_CARD.DAY : contexts.ITEM_CARD.DAYS)
      else if (Math.floor(passTime / 3600) >= 1) res = res + ' ' + Math.floor(passTime / 3600) + '' + (Math.floor(passTime / 3600) === 1 ? contexts.ITEM_CARD.HOUR : contexts.ITEM_CARD.HOURS)
      else if (Math.floor(passTime / 60) > 0) res = res + ' ' + Math.floor(passTime / 60) + '' + (Math.floor(passTime / 60) === 1 ? contexts.ITEM_CARD.MIN : contexts.ITEM_CARD.MINS)
      if (Math.floor(passTime / 60) > 0) res = res + contexts.ITEM_CARD.AGO
    } else {
      let hours: any = Math.floor(left / 3600)
      let mins = Math.floor((left % 3600) / 60)
      let secs = Math.floor((left % 3600) % 60)
      res = (hours < 10 ? `0${hours}` : hours) + ' : ' + (mins < 10 ? `0${mins}` : mins) + ' : ' + (secs < 10 ? `0${secs}` : secs)
    }
    return res
  }

  return (
    <div className="fundme-result-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{code === null ? contexts.HEADER_TITLE.FUNDME_RESULT : 'You Have Funded'}</span></div>
        <div onClick={() => { if (fundme.owner && user && (fundme.owner._id === user.id || user.role === "ADMIN")) navigate(`/fundme/${fundmeId}/voters`) }}>
          {(fundme.owner && user && (fundme.owner._id === user.id || user.role === "ADMIN")) && <NoOfPeopleIcon color="#938D8A" />}
        </div>
      </div>
      {fundme.owner &&
        <>
          <Dialog
            display={isReward}
            exit={() => { setIsReward(false) }}
            wrapExit={() => { setIsReward(false) }}
            subTitle={"SuperFans Only 🎊"}
            icon={
              {
                pos: 1,
                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
              }
            }
            context={`${fundme?.rewardText}\n\n`}
          />
          <Dialog
            display={isStay}
            wrapExit={() => { setIsStay(false); }}
            title={contexts.DIALOG.HEADER_TITLE.STAY_TUNED}
            context={contexts.DIALOG.BODY_LETTER.BEFORE_FANWALL}
            icon={{
              pos: 0,
              icon: <SpreadIcon color="#EFA058" width="60px" height="60px" />
            }}
          />
          <div className="fundme-result">
            <div className="fundme-result-header"
              style={{ maxWidth: ((pyramid === false && topFan === true && code !== null) || (pyramid === true && topFan === true) || topFan === false) ? '1100px' : '720px' }}
            >
              <div className="left-time-vote-info">
                <div className="left-time">
                  <span>{displayTime(time)}</span>
                </div>
                <div className="vote-info">
                  <CreatoCoinIcon color="black" />
                  <span>{fundme.wallet.toLocaleString()}</span>&nbsp;
                  <NoOfPeopleIcon color="black" />
                  <span>{fundme.voteInfo.length.toLocaleString()}</span>
                </div>
              </div>
              <div className="fundme-title">
                <span>{fundme.title}</span>
              </div>
            </div>
            <div className="fundme-result-detail">
              {pyramid === true &&
                <div className="fundme-card">
                  <PyramidCard
                    percentage={Math.round(fundme.voteInfo.filter((vote: any) => vote.superfan === true).length / fundme.voteInfo.length * 100)}
                    itemType="fundme"
                    owner={{
                      avatar: fundme.owner.avatar,
                      name: fundme.owner.name
                    }}
                  />
                </div>
              }
              {(pyramid === false && code === 'false') &&
                <div className="fundme-card">
                  <Missed
                    rewardText={fundme.rewardText}
                    item={{
                      id: fundmeId,
                      type: "fundme"
                    }}
                  />
                </div>
              }
              <div className="fundme-card">
                <FundMeTarget wallet={fundme.wallet} goal={fundme.goal} />
              </div>
              {topFan === false &&
                <div className="fundme-card">
                  <ListSuperFans voters={fundme.voteInfo.filter((vote: any) => vote.superfan === true).sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
                </div>
              }
              {topFan === true &&
                <div className="fundme-card">
                  <TopFan topfans={fundme.voteInfo.sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
                </div>
              }
              {topFan === false &&
                <div className="fundme-card">
                  <SuperfanPercentage percentage={fundme.voteInfo.filter((vote: any) => vote.superfan).length / fundme.voteInfo.length * 100} />
                </div>
              }
            </div>
            {(user && fundme.owner._id === user.id && fundme.finished === true) &&
              <>
                {fundme.fanwall === null ?
                  <div className="post-fanwall-btn" onClick={() => { dispatch(fanwallAction.postFanwall(fundme._id, "FundMe", navigate)) }}>
                    <ContainerBtn text={contexts.DAREME_FINISHED.POST_ON_FANWALL} styleType="fill" />
                  </div>
                  :
                  <div className="post-fanwall-btn">
                    <ContainerBtn text={"Edit Post"} styleType="fill" />
                  </div>
                }
              </>
            }
            {(user && fundme.owner._id !== user.id && fundme.finished === true) &&
              <div className="post-fanwall-btn" onClick={() => {
                if (fundme.fanwall === null) setIsStay(true)
                else navigate(`/fanwall/detail/${fundme.fanwall._id}`)
              }}>
                <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
              </div>
            }
          </div>
        </>
      }
    </div>
  )
}

export default FundmeResult