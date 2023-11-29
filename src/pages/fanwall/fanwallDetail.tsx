import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fanwallAction } from "../../redux/actions/fanwallActions"
import FanwallVideoCard from "../../components/fanwall/videoCardFanwall"
import FawnallLike from "../../components/fanwall/fanwallLike"
import DareOption from "../../components/general/dareOption"
import Avatar from "../../components/general/avatar"
import Button from "../../components/general/button"
import Dialog from "../../components/general/dialog"
import WelcomeDlg from "../../components/general/welcomeDlg"
import CategoryBtn from "../../components/general/categoryBtn"
import SignDialog from "../../components/general/signDialog"
import { LanguageContext } from "../../routes/authRoute"
import { CreatoCoinIcon, MoreIcon, WinningIcon, RewardIcon, BackIcon } from "../../assets/svg"
import { SET_PREVIOUS_ROUTE, SET_FANWALL_TYPE, SET_DIALOG_STATE } from "../../redux/types"
import "../../assets/styles/fanwall/fanwallDetailsStyle.scss"

const FanwallDetails = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { fanwallId } = useParams()

  const fanwallState = useSelector((state: any) => state.fanwall)
  const userState = useSelector((state: any) => state.auth)
  const loadState = useSelector((state: any) => state.load)

  const { fanwall } = fanwallState
  const { user } = userState
  const { dlgState } = loadState

  const contexts = useContext(LanguageContext)

  const [totalDonuts, setTotalDonuts] = useState<any>(0)
  const [voters, setVoters] = useState<Array<any>>([])
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(0)
  const [moreInfo, setMoreInfo] = useState(false)
  const [winOption, setWinOption] = useState<any>(null)

  const [isSignIn, setIsSignIn] = useState(false)
  const [isUnLock, setIsUnLock] = useState(false)
  const [isTopUp, setIsTopUp] = useState(false)
  const [openDelPostDlg, setOpenDelPostDlg] = useState(false)
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)

  const displayProcess = (length: any) => {
    const interval = fanwall.fundme.goal ? (Number(fanwall.fundme.goal) / 20).toFixed(1) : 0
    const count = fanwall.fundme.goal ? Number(Math.floor(Number(fanwall.fundme.wallet) / Number(interval))) : 0
    const width = fanwall.fundme.wallet < interval ? Math.floor(Number(interval) / Number(fanwall.fundme.goal) * length) : Math.floor(Number(interval) * count / Number(fanwall.fundme.goal) * length)
    return width
  }

  const handleUnlock = () => {
    if (user) setIsUnLock(true);
    else setIsSignIn(true);
  }
  const handleLike = () => {
    if (user) {
      const likes = fanwall.likes.filter((like: any) => (like.liker + "" === user.id + ""))
      if (likes.length === 0) dispatch(fanwallAction.likeFanwall(fanwallId))
    } else setIsSignIn(true)
  }

  const checkLock = () => {
    if (user) {
      if (user.role === "ADMIN") return false
      if (user.id + "" === fanwall.writer._id + "") return false
      const voteInfo = fanwall.dareme ? fanwall.dareme.voteInfo : fanwall.fundme.voteInfo
      for (let i = 0; i < voteInfo.length; i++) if ((voteInfo[i].voter._id + "" === user.id + "") && voteInfo[i].superfan === true) return false
      for (let i = 0; i < fanwall.unlocks.length; i++) if (user.id + "" === fanwall.unlocks[i].unlocker + "") return false
      return true
    } else return true
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fanwallAction.getPostDetail(fanwallId))
  }, [fanwallId, dispatch])

  useEffect(() => {
    if (dlgState.type === 'welcome') {
      if (dlgState.state) {
        setOpenWelcomeDlg(true);
      }
    } else if (dlgState.type === 'welcome2') {
      if (dlgState.state) {
        setOpenWelcomeDlg2(true)
      }
    }
  }, [dlgState])

  useEffect(() => {
    if (fanwall.writer) {
      setWinOption(fanwall.dareme ? fanwall.dareme.options.filter((option: any) => option.option.win === true)[0] : null)
      setVoters(fanwall.dareme ? fanwall.dareme.voteInfo : fanwall.fundme.voteInfo)
      setTitle(fanwall.dareme ? fanwall.dareme.title : fanwall.fundme.title)
      setCategory(fanwall.dareme ? fanwall.dareme.category : fanwall.fundme.category)
      if (fanwall.dareme) setTotalDonuts(fanwall.dareme.options.filter((option: any) => option.option.status === 1).reduce((sum: any, option: any) => sum + option.option.donuts, 0))
    }
  }, [fanwall])

  return (
    <div className="fanwall-detail-main-wrapper">
      <div className="header-part">
        <div onClick={() => { navigate('/') }}><BackIcon color="black" /></div>
        <div className="page-title"><span>{contexts.HEADER_TITLE.POST_DETAILS}</span></div>
        <div></div>
      </div>
      {fanwall.writer &&
        <div className="fanwall-detail-wrapper">
          <Dialog
            display={openWelcomeDlg}
            title="Welcome to Creato"
            exit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            wrapExit={() => {
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
              setOpenWelcomeDlg(false);
            }}
            subcontext={true}
            icon={
              {
                pos: 1,
                icon: <RewardIcon color="#EFA058" width="60px" height="60px" />
              }
            }
            buttons={[
              {
                text: "Go",
                handleClick: () => {
                  setOpenWelcomeDlg(false);
                  dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } });
                  navigate('/')
                }
              }
            ]}
          />
          <WelcomeDlg
            display={openWelcomeDlg2}
            exit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            wrapExit={() => {
              setOpenWelcomeDlg2(false)
              dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
            }}
            buttons={[{
              text: contexts.WELCOME_DLG.OK,
              handleClick: () => {
                setOpenWelcomeDlg2(false)
                dispatch({ type: SET_DIALOG_STATE, payload: { type: "", state: false } })
                navigate('/')
              }
            }]}
          />
          <Dialog
            display={openDelPostDlg}
            exit={() => { setOpenDelPostDlg(false) }}
            wrapExit={() => { setOpenDelPostDlg(false) }}
            title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
            context={contexts.DIALOG.BODY_LETTER.DELETE_POST}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CANCEL,
                handleClick: () => { setOpenDelPostDlg(false); }
              },
              {
                text: contexts.DIALOG.BUTTON_LETTER.DELETE,
                handleClick: () => {
                  setOpenDelPostDlg(false);
                  dispatch(fanwallAction.deleteFanwall(fanwallId, navigate, `/${user.personalisedUrl}`));
                }
              }
            ]}
          />
          <SignDialog
            display={isSignIn}
            exit={() => { setIsSignIn(false) }}
            wrapExit={() => { setIsSignIn(false) }}
          />
          <Dialog
            display={isUnLock}
            exit={() => { setIsUnLock(false) }}
            wrapExit={() => { setIsUnLock(false) }}
            title={contexts.DIALOG.HEADER_TITLE.UNLOCK_REWARDS}
            context={contexts.DIALOG.BODY_LETTER.UNLOCK_FANWALL}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.CANCEL,
                handleClick: () => { setIsUnLock(false) }
              },
              {
                text: contexts.DIALOG.BUTTON_LETTER.CONFIRM,
                handleClick: () => {
                  if (user.wallet >= 500) {
                    setIsUnLock(false);
                    dispatch(fanwallAction.unlockFanwall(fanwallId));
                  } else {
                    setIsUnLock(false);
                    setIsTopUp(true);
                  }
                }
              }
            ]}
          />
          <Dialog
            display={isTopUp}
            title={contexts.DIALOG.HEADER_TITLE.TOP_UP_NOW}
            exit={() => { setIsTopUp(false) }}
            wrapExit={() => { setIsTopUp(false) }}
            context={contexts.DIALOG.BODY_LETTER.TOP_UP_NOW}
            buttons={[
              {
                text: contexts.DIALOG.BUTTON_LETTER.TOP_UP,
                handleClick: () => {
                  dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                  navigate(`/myaccount/shop`);
                }
              }
            ]}
          />
          <div className="fanwall-desktop-card">
            <div className="card-main-body">
              <FanwallVideoCard
                letters={fanwall.message}
                url={process.env.REACT_APP_SERVER_URL + "/" + fanwall.video}
                sizeType={fanwall.sizeType}
                coverImage={fanwall.cover ? `${process.env.REACT_APP_SERVER_URL}/${fanwall.cover}` : ""}
                lock={checkLock()}
                handleUnlock={handleUnlock}
              />
              <FawnallLike
                avatar={fanwall.writer.avatar.indexOf('uploads') === -1 ? fanwall.writer.avatar : `${process.env.REACT_APP_SERVER_URL}/${fanwall.writer.avatar}`}
                likes={fanwall.likes.length}
                username={fanwall.writer.name}
                handleLike={handleLike}
                isLiked={(user && fanwall.likes.filter((like: any) => (like.liker + "" === user.id + "")).length > 0) ? true : false}
                handleAvatar={() => { navigate(`/${fanwall.writer.personalisedUrl}`) }}
              />
            </div>
          </div>
          <div className="fanwall-info">
            <div className="dareme-vote-info">
              <div className="dareme-deadline">Ended</div>
              <div className="dareme-donuts">
                <CreatoCoinIcon color="black" />
                <div style={{ width: 'fit-content', marginLeft: '5px', marginRight: '5px' }}>{fanwall.dareme ? totalDonuts.toLocaleString() : fanwall.fundme.wallet.toLocaleString()}</div>
              </div>
            </div>
            <div className="dareme-title">
              <div className="title">{title}</div>
              <div className="more-info">
                <div onClick={() => { setMoreInfo(true) }} ><MoreIcon color="#EFA058" /></div>
                <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}}>
                  <div className="list" onClick={() => {
                    navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/fanwall/detail/${fanwallId}`);
                    setMoreInfo(false);
                  }}>
                    Copy link
                  </div>
                  {(user && user.id === fanwall.writer._id) &&
                    <>
                      <div className="list" onClick={() => {
                        if (fanwall.dareme) dispatch({ type: SET_FANWALL_TYPE, payload: 'dareme' });
                        else dispatch({ type: SET_FANWALL_TYPE, payload: 'fundme' });
                        navigate(`/dareme/fanwall/post/${fanwallId}`);
                      }}>
                        Edit
                      </div>
                      <div className="list" onClick={() => {
                        setMoreInfo(false);
                        setOpenDelPostDlg(true);
                      }}>
                        Delete
                      </div>
                    </>
                  }
                  <div className="list" onClick={() => { setMoreInfo(false) }}>Cancel</div>
                </div>
              </div>
            </div>
            <div className="dareme-category">
              <CategoryBtn text={fanwall.dareme ? contexts.DAREME_CATEGORY_LIST[category] : contexts.FUNDME_CATEGORY_LIST[category]} />
            </div>
            <div className="fanwall-mobile-card">
              <FanwallVideoCard
                letters={fanwall.message}
                url={process.env.REACT_APP_SERVER_URL + "/" + fanwall.video}
                lock={checkLock()}
                sizeType={fanwall.sizeType}
                coverImage={fanwall.cover ? `${process.env.REACT_APP_SERVER_URL}/${fanwall.cover}` : ""}
                handleUnlock={handleUnlock}
              />
            </div>
            {fanwall.fundme &&
              <div className="funding-goal">
                <div className="title">
                  <CreatoCoinIcon color="#EFA058" />
                  <label>{fanwall.fundme.wallet < fanwall.fundme.goal ? "Goal" : "Goal Reached!"}</label>
                </div>
                <div className="process-bar">
                  <div className="process-value" style={{ width: fanwall.fundme.wallet < fanwall.fundme.goal ? `${displayProcess(330)}px` : '330px' }}></div>
                </div>
                <div className="donuts-count">
                  <span><span className={fanwall.fundme.wallet >= fanwall.fundme.goal ? "over-donuts" : ""}>{fanwall.fundme.wallet.toLocaleString()}</span> / {fanwall.fundme.goal.toLocaleString()} Donuts</span>
                </div>
              </div>
            }
            {winOption &&
              <div className="win-option">
                <DareOption
                  canVote={false}
                  donuts={winOption.option.donuts}
                  voters={winOption.option.voters}
                  disabled={false}
                  leading={true}
                  dareTitle={winOption.option.title}
                  handleSubmit={() => { }}
                  username={winOption.option.writer.name}
                />
              </div>
            }
            <div className="fanwall-like-mobile" style={{ margin: '0px 15px' }}>
              <FawnallLike
                avatar={fanwall.writer.avatar.indexOf('uploads') === -1 ? fanwall.writer.avatar : `${process.env.REACT_APP_SERVER_URL}/${fanwall.writer.avatar}`}
                likes={fanwall.likes ? fanwall.likes.length : 0}
                username={fanwall.writer.name}
                handleLike={handleLike}
                isLiked={(user && fanwall.likes.filter((like: any) => (like.liker + "" === user.id + "")).length > 0) ? true : false}
              />
            </div>
            <div className="line-vector"></div>
            <div className="top-fans">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <WinningIcon color="black" />
                <div className="letter">Top Fans</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
                {voters.sort((first: any, second: any) => {
                  const firstCnt = first.donuts + first.canFree === false ? 1 : 0
                  const secondCnt = second.donuts + second.canFree === false ? 1 : 0
                  if (firstCnt > secondCnt) return -1
                  else if (firstCnt < secondCnt) return 1
                  else return 0
                }).map((vote: any, index: any) => {
                  if (index < 3) {
                    return <div className="top-fan-avatar" key={index} onClick={() => { navigate(`/${vote.voter.personalisedUrl}`); }}>
                      <Avatar
                        avatar={vote.voter.avatar.indexOf('uploads') === -1 ? vote.voter.avatar : `${process.env.REACT_APP_SERVER_URL}/${vote.voter.avatar}`}
                        size="mobile"
                        hover={true}
                        username={vote.voter.name}
                      />
                    </div>
                  }
                })}
              </div>
            </div>
            <div className="line-vector"></div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
              <Button
                fillStyle="fill"
                width="290px"
                text="Watch Content"
                color="primary"
                shape="rounded"
                handleSubmit={() => {
                  if (fanwall.dareme) navigate('/fanwall/detail/' + fanwallId + '/content');
                  else navigate('/fanwall/detail/' + fanwallId + '/content');
                }}
              />
            </div>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
              <Button
                fillStyle="outline"
                shape="rounded"
                width="290px"
                text={fanwall.dareme ? "See DareMe" : "See FundMe"}
                color="primary"
                handleSubmit={() => {
                  if (fanwall.dareme) navigate(`/dareme/result/${fanwall.dareme._id}`)
                  else navigate(`/fundme/result/${fanwall.fundme._id}`)
                }}
              />
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default FanwallDetails;