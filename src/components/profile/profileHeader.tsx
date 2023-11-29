import { useEffect, useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { LanguageContext } from "../../routes/authRoute"
import Button from "../general/button"
import Avatar from "../general/avatar"
import {
  AddIcon,
  EditIcon,
  // FacebookIcon,
  HotIcon,
  InstagramIcon,
  MoreIcon,
  NotificationOutlineIcon,
  NotificationSubscribedIcon,
  // TwitterIcon,
  YoutubeIcon,
  TipIcon,
  CreatoCoinIcon,
  InviteIcon,
  WinningIcon
} from "../../assets/svg"
import { SET_PROFILE_DATA } from "../../redux/types"
import { subscribeUser } from '../../api'
import Dialog from "../general/dialog"
import { SET_PREVIOUS_ROUTE } from "../../redux/types"
import "../../assets/styles/profile/components/profileHeaderStyle.scss"

const useOutsideAlerter = (ref: any, moreInfo: any) => {
  const [more, setMore] = useState(moreInfo);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      setMore(moreInfo);
      if (ref.current && !ref.current.contains(event.target)) {
        if (moreInfo) setMore(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, moreInfo]);
  return more;
}

interface profileProps {
  property?: string; //edit view
  size?: string; // mobile web
  handleCreateDareMe?: any;
}

const ProfileHeader = (props: profileProps) => {
  const navigate = useNavigate()
  const userStore = useSelector((state: any) => state.auth);
  const dispatch = useDispatch()
  const authuser = userStore.users[0]
  const { user } = userStore
  const contexts = useContext(LanguageContext)
  const daremeStore = useSelector((state: any) => state.dareme)
  const { daremes } = daremeStore
  const [categoryText, setCategoryText] = useState("")
  const [moreInfo, setMoreInfo] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [isSignIn, setIsSignIn] = useState(false)
  const wrapRef = useRef<any>(null)
  const res = useOutsideAlerter(wrapRef, moreInfo)

  useEffect(() => {
    if (authuser && authuser.categories.length) {
      let categories = authuser.categories
      let texts = ""
      categories.sort((a: any, b: any) => { return a > b ? 1 : a < b ? -1 : 0 })
      categories.forEach((categoryIndex: any, index: any) => {
        texts += contexts.CREATOR_CATEGORY_LIST[categoryIndex]
        if (index < categories.length - 1) texts += "/"
      })
      setCategoryText(texts)
    }
  }, [authuser, contexts.CREATOR_CATEGORY_LIST, daremes])

  useEffect(() => {
    if (user && authuser) {
      authuser.subscribed_users.forEach((item: any) => {
        if (item + "" === user.id + "") setSubscribed(true)
      })
    }
  }, [user, authuser]);

  const formalNumber = (num: Number) => {
    if (num <= 999) return num
    return num.toLocaleString('en-US')
  }

  const roundNumber = (num: number) => {
    if (num <= 9999)
      return formalNumber(num);
    else if (num <= 99999) {
      return (Math.round(num / 100) / 10).toString() + "K";
    }
    else if (num <= 999999) {
      return (Math.round(num / 1000)).toString() + "K";
    }
    else {
      return (Math.round(num / 100000) / 10).toString() + "M";
    }
  }

  const subscribedUser = async () => {
    try {
      if (user) {
        const result = await subscribeUser(authuser._id)
        if (result.data.success) setSubscribed(!subscribed)
      } else setIsSignIn(true);
    } catch (err) {
      console.log({ err })
    }
  }

  const tipping = () => {
    if (user) navigate(`/${authuser.personalisedUrl}/tip`)
    else navigate('/tipmethod')
  }

  useEffect(() => {
    if (!res) setMoreInfo(res);
  }, [res]);

  return (
    <div
      className="profile-header"
      style={{ height: `${props.size === "mobile" ? ((authuser?.itemCnt + authuser?.superfans + authuser?.fanwallCnt) === 0) ? "150px" : "190px" : "200px"}` }}
    >
      <Dialog
        display={isSignIn}
        exit={() => { setIsSignIn(false) }}
        wrapExit={() => { setIsSignIn(false) }}
        title="Sign in now"
        context={"Support your favourite creators!"}
        buttons={[
          {
            text: "Sign in",
            handleClick: () => {
              dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/ ${authuser.personalisedUrl}` });
              navigate('/auth/signin')
            }
          }
        ]}
      />
      <div className="avatar">
        <Avatar
          size={props.size}
          avatarStyle="horizontal"
          avatar={authuser ? authuser.avatar.indexOf('uploads') === -1 ? authuser.avatar : `${process.env.REACT_APP_SERVER_URL}/${authuser.avatar}` : ''}
        />
        <div className="name-category">
          <span className="name">{authuser ? authuser.name : ''}</span>
          <span className="category">{categoryText}</span>
        </div>
      </div >
      <div className="ellipsis-icon" onClick={() => { setMoreInfo(true); }}>
        <MoreIcon color="black" />
      </div>
      {
        authuser &&
        <div className="rating-container" style={{ left: props.size === "mobile" ? '35px' : '150px' }}>
          {authuser?.itemCnt > 0 ?
            <div className="rating-item">
              <div className="count-letter"><span>{roundNumber(authuser.itemCnt ? authuser.itemCnt : 0)}</span></div>
              <div className="type-letter"><CreatoCoinIcon color="#EFA058" width={18} /><span>DareMe/FundMe</span></div>
            </div> : <div></div>
          }
          {authuser?.superfans > 0 ?
            <div className="rating-item">
              <div className="count-letter"><span>{roundNumber(authuser.superfans ? authuser.superfans : 0)}</span></div>
              <div className="type-letter"><WinningIcon color="#EFA058" width={16} /><span>&nbsp;SuperFans</span></div>
            </div> : <div></div>
          }
          {authuser?.fanwallCnt > 0 ?
            <div className="rating-item">
              <div className="count-letter"><span>{roundNumber(authuser.fanwallCnt ? authuser.fanwallCnt : 0)}</span></div>
              <div className="type-letter"><HotIcon color="#EFA058" width={15} /><span>&nbsp;FanWall Post</span></div>
            </div>
            : <div></div>
          }
        </div>
      }
      <div className="icons">
        {props.property === "view" ? (
          <>
            <div style={{ marginRight: '10px' }}>
              {(authuser && authuser.tipFunction) &&
                <Button
                  handleSubmit={tipping}
                  color="primary"
                  shape="pill"
                  fillStyle="fill"
                  icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                />
              }
            </div>
            <div style={{ marginRight: '10px' }}>
              {subscribed ?
                <Button
                  handleSubmit={subscribedUser}
                  color="primary"
                  shape="pill"
                  fillStyle="fill"
                  icon={[<NotificationSubscribedIcon color="white" />, <NotificationSubscribedIcon color="white" />, <NotificationSubscribedIcon color="white" />]}
                />
                :
                <Button
                  handleSubmit={subscribedUser}
                  color="primary"
                  shape="pill"
                  fillStyle="fill"
                  icon={[<NotificationOutlineIcon color="white" />, <NotificationOutlineIcon color="white" />, <NotificationOutlineIcon color="white" />]}
                />
              }
            </div>
            {/* <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
            <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div> */}
          </>
        ) : (
          <>
            <div className="pen-icon" onClick={() => {
              if (user) {
                dispatch({
                  type: SET_PROFILE_DATA, payload: {
                    category: user.category,
                    avatarFile: null,
                    displayName: user.name,
                    creatoUrl: `www.creatogether.io/${user.personalisedUrl}`
                  }
                })
                navigate(`/myaccount/edit`)
              }
            }}>
              <EditIcon color="white" /><span>&nbsp;Edit</span>
            </div>
            <div className="pen-icon" onClick={() => { if (user) navigate(`/myaccount/setting/invitefriends`) }}>
              <InviteIcon color="white" width={25} height={15} /><span>&nbsp;Invite</span>
            </div>
            {/* <div style={{ marginLeft: '15px' }}><YoutubeIcon color="#E17253" /></div>
            <div style={{ marginLeft: '5px' }}><InstagramIcon color="#E17253" /></div> */}
          </>
        )}
      </div>
      <div className="create-btn">
        {(user && authuser && user.id === authuser._id) ?
          <Button
            handleSubmit={props.handleCreateDareMe}
            color="primary"
            shape="pill"
            fillStyle="fill"
            icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
          /> : <></>
        }
      </div>
      <div className="drop-down-list" style={moreInfo === true ? { visibility: 'visible', opacity: 1 } : {}} ref={wrapRef}>
        <div className="list" onClick={() => {
          navigator.clipboard.writeText(`www.creatogether.io/${authuser.personalisedUrl}`);
          setMoreInfo(false);
        }}>{contexts.PROFILE_LETTER.COPY_PROFILE_LINK}</div>
        <div className="list" onClick={() => { setMoreInfo(false) }}>{contexts.PROFILE_LETTER.CANCEL}</div>
      </div>
    </div >
  )
}

export default ProfileHeader
