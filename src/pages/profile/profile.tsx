import { useState, useEffect, useContext, useLayoutEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { daremeAction } from "../../redux/actions/daremeActions"
import ProfileHeader from "../../components/profile/profileHeader"
import ProfileMenu from "../../components/profileMenu"
import ContainerBtn from "../../components/general/containerBtn"
import Dialog from "../../components/general/dialog"
import WelcomeDlg from "../../components/general/welcomeDlg"
import DareMeProfileCard from "../../components/profile/dareMeProfileCard"
import FundMeProfileCard from "../../components/profile/fundMeProfileCard"
import { Dare2Icon, HotIcon, AddIcon, RewardIcon, CreatoCoinIcon } from "../../assets/svg"
import CONSTANT from "../../constants/constant"
import { SET_PREVIOUS_ROUTE, SET_DIALOG_STATE } from "../../redux/types"
import { LanguageContext } from "../../routes/authRoute"
import "../../assets/styles/profile/profileStyle.scss"

const useWindowSize = () => {
  const [size, setSize] = useState(0)
  useLayoutEffect(() => {
    const updateSize = () => { setSize(window.innerWidth) }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

const Profile = () => {
  const { pathname } = useLocation()
  const width = useWindowSize()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const contexts = useContext(LanguageContext)
  const daremeState = useSelector((state: any) => state.dareme)
  const fundmeState = useSelector((state: any) => state.fundme)
  const userState = useSelector((state: any) => state.auth)
  const dlgState = useSelector((state: any) => state.load.dlgState)
  const { daremes } = daremeState
  const { fundmes } = fundmeState
  const { user } = userState
  const authuser = userState.users.length ? userState.users[0] : null
  const [openWelcomeDlg, setOpenWelcomeDlg] = useState(false)
  const [openWelcomeDlg2, setOpenWelcomeDlg2] = useState(false)
  const [isSame, setIsSame] = useState(false)

  const handleCreateDareMe = () => {
    dispatch({ type: SET_PREVIOUS_ROUTE, payload: location.pathname });
    navigate("/create");
  };

  useEffect(() => {
    window.scrollTo(0, 0)
    const personalisedUrl = pathname.substring(1);
    dispatch(daremeAction.getDaremesByPersonalisedUrl(personalisedUrl))
  }, [location, dispatch, pathname]);

  useEffect(() => {
    if (authuser) {
      if (user) {
        if (user.id === authuser._id) setIsSame(true);
        else setIsSame(false);
      } else setIsSame(false);
    }
  }, [authuser, user]);

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

  return (
    <div className="profile-wrapper">
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
      <div className="profile">
        <div className="profile-header">
          <ProfileHeader
            size={width > 880 ? "web" : "mobile"}
            property={isSame ? 'edit' : 'view'}
            handleCreateDareMe={handleCreateDareMe}
          />
        </div>
        <div className="profile-menu">
          <ProfileMenu menu={"dareme"} url={authuser ? authuser.personalisedUrl : ''} />
        </div>
        <div className="dare-cards">
          <div className="my-dareMe">
            <div className="title">
              <CreatoCoinIcon color="#EFA058" width={30} height={30} />
              {authuser &&
                <p>
                  {(user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.MY_DAREME : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_DAREME}`}
                </p>
              }
            </div>
            {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === true).length > 0)
              || (fundmes.length > 0 && fundmes.filter((fundme: any) => fundme.isUser === true).length > 0) ?
              <>
                {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === true).length > 0) &&
                  <div className="dare-card">
                    {daremes.filter((dareme: any) => dareme.isUser === true)
                      .map((dareme: any, index: any) => (
                        <div className="profile-dareme" key={index}>
                          <DareMeProfileCard
                            item={{
                              id: dareme._id,
                              title: dareme.title,
                              teaser: `${process.env.REACT_APP_SERVER_URL}/${dareme.teaser}`,
                              cover: `${process.env.REACT_APP_SERVER_URL}/${dareme.cover}`,
                              size: dareme.sizeType,
                              leftTime: dareme.time,
                              voters: dareme.voteInfo.length,
                              donuts: dareme.donuts
                            }}
                            handleSubmit={() => { dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser?.personalisedUrl}` }) }}
                          />
                        </div>
                      ))}
                  </div>
                }
                {(fundmes.length > 0 && fundmes.filter((fundme: any) => fundme.isUser === true).length > 0) &&
                  <div className="dare-card">
                    {fundmes.filter((fundme: any) => fundme.isUser === true)
                      .map((fundme: any, index: any) => (
                        <div className="profile-dareme" key={index}>
                          <FundMeProfileCard
                            item={{
                              id: fundme._id,
                              title: fundme.title,
                              teaser: `${process.env.REACT_APP_SERVER_URL}/${fundme.teaser}`,
                              cover: `${process.env.REACT_APP_SERVER_URL}/${fundme.cover}`,
                              size: fundme.sizeType,
                              leftTime: fundme.time,
                              voters: fundme.voteInfo.length,
                              donuts: fundme.donuts,
                              goal: fundme.goal
                            }}
                            handleSubmit={() => { dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/${authuser?.personalisedUrl}` }) }}
                          />
                        </div>
                      ))}
                  </div>
                }
              </>
              :
              <div className="no-data">
                {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ?
                  <div style={{ width: '330px', margin: '0px auto' }} onClick={() => { navigate("/create") }}>
                    <ContainerBtn text="Create" styleType="fill" icon={[<AddIcon color="white" />, <AddIcon color="white" />]} />
                  </div> :
                  <span>No DareMe/FundMe Yet...</span>
                }
              </div>
            }
          </div>
          <div className="i-dared">
            <div className="title">
              <HotIcon color="#EFA058" />
              {authuser &&
                <p>
                  {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ? contexts.PROFILE_LETTER.I_DARED : `${authuser.name} ${contexts.PROFILE_LETTER.OTHER_DARED}`}
                </p>
              }
            </div>
            {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === false).length > 0)
              || (fundmes.length > 0 && fundmes.filter((fundme: any) => fundme.isUser === false).length > 0) ?
              <>
                {(daremes.length > 0 && daremes.filter((dareme: any) => dareme.isUser === false).length > 0) &&
                  <div className="dare-card">
                    {daremes.filter((dareme: any) => dareme.isUser === false)
                      .map((dareme: any, index: any) => (
                        <div className="profile-dareme" key={index}>
                          <DareMeProfileCard
                            item={{
                              id: dareme._id,
                              title: dareme.title,
                              teaser: `${process.env.REACT_APP_SERVER_URL}/${dareme.teaser}`,
                              cover: `${process.env.REACT_APP_SERVER_URL}/${dareme.cover}`,
                              size: dareme.sizeType,
                              leftTime: dareme.time,
                              voters: dareme.voteInfo.length,
                              donuts: dareme.donuts
                            }}
                          />
                        </div>
                      ))}
                  </div>
                }
                {(fundmes.length > 0 && fundmes.filter((fundme: any) => fundme.isUser === false).length > 0) &&
                  <div className="dare-card">
                    {fundmes.filter((fundme: any) => fundme.isUser === false)
                      .map((fundme: any, index: any) => (
                        <div className="profile-dareme" key={index}>
                          <FundMeProfileCard
                            item={{
                              id: fundme._id,
                              title: fundme.title,
                              teaser: `${process.env.REACT_APP_SERVER_URL}/${fundme.teaser}`,
                              cover: `${process.env.REACT_APP_SERVER_URL}/${fundme.cover}`,
                              size: fundme.sizeType,
                              leftTime: fundme.time,
                              voters: fundme.voteInfo.length,
                              donuts: fundme.donuts,
                              goal: fundme.goal
                            }}
                          />
                        </div>
                      ))}
                  </div>
                }
              </>
              :
              <div className="no-data">
                {(authuser && user && user.personalisedUrl === authuser.personalisedUrl) ?
                  <div style={{ width: '330px', margin: '0px auto' }} onClick={() => { navigate('/') }}>
                    <ContainerBtn text="Create with Creator" styleType="fill" icon={[<Dare2Icon color="white" />, <Dare2Icon color="white" />]} />
                  </div> :
                  <span>No Activities Yet...</span>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile