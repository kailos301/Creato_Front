import { useEffect, useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { daremeAction } from "../../../redux/actions/daremeActions"
import { fanwallAction } from "../../../redux/actions/fanwallActions"
import ContainerBtn from "../../../components/general/containerBtn"
import Dialog from "../../../components/general/dialog"
import VoteResult from "../../../components/general/VoteResult"
import TopFan from "../../../components/general/TopFan"
import ListSuperFans from "../../../components/general/ListSuperFans"
import Missed from "../../../components/general/Missed"
import PyramidCard from "../../../components/general/PyramidCard"
import SuperfanPercentage from "../../../components/general/SuperfanPercentage"
import RefundDlg from "../../../components/dareme/refundDlg"
import { LanguageContext } from "../../../routes/authRoute"
import { CreatoCoinIcon, SpreadIcon, BackIcon, NoOfPeopleIcon } from "../../../assets/svg"
import { SET_DAREME_DETAIL_INITIAL, SET_DIALOG_STATE } from "../../../redux/types"
import "../../../assets/styles/dareme/dare/daremeResultStyle.scss"

const DaremeResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const contexts = useContext(LanguageContext)
  const { daremeId } = useParams();
  const daremeState = useSelector((state: any) => state.dareme)
  const loadState = useSelector((state: any) => state.load)
  const userState = useSelector((state: any) => state.auth)

  const { dareme, refundDonuts } = daremeState
  const { user } = userState
  const { dlgState } = loadState

  const [isStay, setIsStay] = useState(false)
  // const [isWinOptionDlg, setIsWinOptionDlg] = useState(false)
  // const [isCopyLinkDlg, setIsCopyLinkDlg] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [refund, setRefund] = useState(false)
  const [isRefund, setIsRefund] = useState(false)
  const [isMyDonuts, setIsMyDonuts] = useState(false)
  const [isSupport, setIsSupport] = useState(false)
  const [isCopyLink, setIsCopyLink] = useState(false)

  const [pyramid, setPyramid] = useState(false)
  const [topFan, setTopFan] = useState(false)
  const [time, setTime] = useState(0)
  const [flag, setFlag] = useState(false)
  const [timerId, setTimerId] = useState<any>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const code = searchParams.get("superfan")

  const showCard = () => {
    if (user) {
      const filters = dareme.voteInfo.filter((vote: any) => vote.voter._id === user.id && vote.superfan === true && user.role !== "ADMIN")
      if (filters.length > 0) {
        if (code === null) setPyramid(true)
        else {
          if (code === 'true') setPyramid(true)
          else setPyramid(false)
        }
      }
      else setPyramid(false)
    } else setPyramid(false)
    if (user && (user.id === dareme.owner._id || user.role === "ADMIN")) setTopFan(false)
    else setTopFan(true)
  }

  useEffect(() => {
    if (flag) {
      if (timerId) clearInterval(timerId)
      let id = setInterval(() => { setTime((time: any) => time - 1) }, 1000)
      setTimerId(id)
    }
  }, [time, flag])
  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(daremeAction.getDaremeResult(daremeId))
  }, [location, dispatch, daremeId])

  useEffect(() => {
    if (dareme.owner) {
      if (dareme.finished === false && code === null) {
        dispatch({ type: SET_DAREME_DETAIL_INITIAL })
        navigate(`/dareme/details/${daremeId}`)
      }
      setTime(dareme.time)
      setFlag(true)
      showCard()
    }
  }, [dareme])

  useEffect(() => {
    if (dlgState.state) {
      if (dlgState.type === 'refund_donuts') setRefund(true)
    }
  }, [dlgState])

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
    <div className="dareme-result-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate(loadState.prevRoute) }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{code === null ? contexts.HEADER_TITLE.DAREME_RESULT : 'You Have Voted'}</span></div>
        <div onClick={() => { if (dareme.owner && user && (dareme.owner._id === user.id || user.role === "ADMIN")) navigate(`/dareme/${daremeId}/voters`) }}>
          {(dareme.owner && user && (dareme.owner._id === user.id || user.role === "ADMIN")) && <NoOfPeopleIcon color="#938D8A" />}
        </div>
      </div>
      {(dareme.owner) &&
        <div className="dareme-result">
          <RefundDlg
            confirm={true}
            display={isSupport}
            wrapExit={() => { setIsSupport(false) }}
            exit={() => { setIsSupport(false) }}
            title={'Confirm:'}
            dareme={dareme}
            refund={refundDonuts ? refundDonuts : 0}
            buttons={[
              {
                text: 'Back',
                handleClick: () => {
                  setIsSupport(false)
                  setRefund(true)
                }
              },
              {
                text: 'Send',
                handleClick: () => {
                  setIsCopied(false)
                  setIsSupport(false)
                  setIsCopyLink(true)
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
                  dispatch(daremeAction.supportRefund(daremeId))
                }
              }
            ]}
          />
          <RefundDlg
            display={refund}
            wrapExit={() => {
              setRefund(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
            }}
            exit={() => {
              setRefund(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
            }}
            title={'Winning Dare:'}
            dareme={dareme}
            refund={refundDonuts ? refundDonuts : 0}
            buttons={[
              {
                text: 'No',
                handleClick: () => {
                  setRefund(false)
                  setIsRefund(true)
                }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  setRefund(false)
                  setIsSupport(true)
                }
              }
            ]}
          />
          <Dialog
            display={isRefund}
            wrapExit={() => { setIsRefund(false); }}
            exit={() => { setIsRefund(false); }}
            title={'Confirm:'}
            context={'Donuts will be refunded to you.'}
            buttons={[
              {
                text: 'No',
                handleClick: () => {
                  setIsRefund(false)
                }
              },
              {
                text: 'Yes',
                handleClick: () => {
                  setIsRefund(false)
                  setIsMyDonuts(true)
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } })
                  dispatch(daremeAction.refundDonuts(refundDonuts, daremeId))
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLink}
            title={'I supported:'}
            avatars={[
              dareme.owner.avatar.indexOf('uploads') === -1 ? dareme.owner.avatar : `${process.env.REACT_APP_SERVER_URL}/${dareme.owner.avatar}`,
              user ? user.avatar.indexOf('uploads') === -1 ? user.avatar : `${process.env.REACT_APP_SERVER_URL}/${user.avatar}` : ""
            ]}
            exit={() => { setIsCopyLink(false) }}
            wrapExit={() => { setIsCopyLink(false) }}
            context={`Congratulations! You have supported ${dareme.owner.name} on ${dareme.title}`}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/dareme/result/${daremeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"vote"}
            daremeTitle={dareme.title}
          />
          <Dialog
            display={isMyDonuts}
            wrapExit={() => { setIsMyDonuts(false); }}
            exit={() => { setIsMyDonuts(false); }}
            title={'Confirm:'}
            context={`${refundDonuts} Donuts has been returned to you.`}
            buttons={[
              {
                text: 'Check My Donuts',
                handleClick: () => {
                  setIsMyDonuts(false)
                  navigate(`/myaccount/wallet`)
                }
              }
            ]}
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
          {/* <Dialog
            display={isWinOptionDlg}
            exit={() => { setIsWinOptionDlg(false) }}
            wrapExit={() => { setIsWinOptionDlg(false) }}
            title="DareMe"
            context={contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_BEFORE + " " + optionTitle + " " + contexts.DIALOG.BODY_LETTER.CONFIRM_WIN_OPTION_AFTER}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  setIsCopied(false);
                  setIsWinOptionDlg(false);
                  dispatch(daremeAction.winDareOption(winOptionId, daremeId));
                  setIsCopyLinkDlg(true);
                }
              }
            ]}
          />
          <Dialog
            display={isCopyLinkDlg}
            title={contexts.DIALOG.HEADER_TITLE.CONGRAT}
            wrapExit={() => { setIsCopyLinkDlg(false) }}
            context={optionTitle + " " + contexts.DIALOG.BODY_LETTER.WIN_CONG}
            buttons={[
              {
                text: isCopied ? contexts.DIALOG.BUTTON_LETTER.COPIED : contexts.DIALOG.BUTTON_LETTER.COPY_LINK,
                handleClick: () => {
                  navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/dareme/details/${daremeId}`);
                  setIsCopied(true);
                }
              }
            ]}
            social
            ownerName={dareme.owner.name}
            daremeId={daremeId}
            shareType={"win"}
            daremeTitle={dareme.title}
          /> */}
          <div className="dareme-result-header"
            style={{ maxWidth: ((pyramid === false && topFan === true && code !== null) || (pyramid === true && topFan === true) || topFan === false) ? '1100px' : '720px' }}
          >
            <div className="left-time-vote-info">
              <div className="left-time">
                <span>{displayTime(time)}</span>
              </div>
              <div className="vote-info">
                <CreatoCoinIcon color="black" />
                <span>{dareme.donuts.toLocaleString()}</span>&nbsp;
                <NoOfPeopleIcon color="black" />
                <span>{dareme.voteInfo.length.toLocaleString()}</span>
              </div>
            </div>
            <div className="dareme-title">
              <span>{dareme.title}</span>
            </div>
          </div>
          <div className="dareme-result-detail">
            {pyramid === true &&
              <div className="detail-card">
                <PyramidCard
                  percentage={Math.round(dareme.voteInfo.filter((vote: any) => vote.superfan === true).length / dareme.voteInfo.length * 100)}
                  itemType="dareme"
                  owner={{
                    avatar: dareme.owner.avatar,
                    name: dareme.owner.name
                  }}
                />
              </div>
            }
            {(pyramid === false && code === 'false') &&
              <div className="detail-card">
                <Missed
                  rewardText={dareme.rewardText}
                  item={{
                    id: daremeId,
                    type: "dareme"
                  }}
                />
              </div>
            }
            <div className="detail-card">
              <VoteResult options={dareme.options.sort((first: any, second: any) => {
                if (first.option.donuts < second.option.donuts) return 1
                else if (first.option.donuts > second.option.donuts) return -1
                else {
                  if (first.option.voters < second.option.voters) return 1
                  else return -1
                }
              })} />
            </div>
            {topFan === false &&
              <div className="detail-card">
                <ListSuperFans voters={dareme.voteInfo.filter((vote: any) => vote.superfan === true).sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
              </div>
            }
            {topFan === true &&
              <div className="detail-card">
                <TopFan topfans={dareme.voteInfo.sort((first: any, second: any) => first.donuts < second.donuts ? 1 : first.donuts > second.donuts ? -1 : 0)} />
              </div>
            }
            {topFan === false &&
              <div className="detail-card">
                <SuperfanPercentage percentage={dareme.voteInfo.filter((vote: any) => vote.superfan).length / dareme.voteInfo.length * 100} />
              </div>
            }
          </div>
          {(user && dareme.owner._id === user.id && dareme.finished === true) &&
            <>
              {dareme.fanwall === null ?
                <div className="post-fanwall-btn" onClick={() => { dispatch(fanwallAction.postFanwall(dareme._id, "DareMe" ,navigate)) }}>
                  <ContainerBtn text={contexts.DAREME_FINISHED.POST_ON_FANWALL} styleType="fill" />
                </div>
                :
                <div className="post-fanwall-btn">
                  <ContainerBtn text={"Edit Post"} styleType="fill" />
                </div>
              }
            </>
          }
          {(user && dareme.owner._id !== user.id && dareme.finished === true) &&
            <div className="post-fanwall-btn" onClick={() => {
              if (dareme.fanwall === null) setIsStay(true)
              else navigate(`/fanwall/detail/${dareme.fanwall._id}`)
            }}>
              <ContainerBtn text={contexts.DAREME_FINISHED.VIEW_ON_FANWALL} styleType="fill" />
            </div>
          }
        </div>
      }
    </div>
  )
}

export default DaremeResult