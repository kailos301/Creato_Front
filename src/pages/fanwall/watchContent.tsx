import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Title from "../../components/general/title";
import Button from "../../components/general/button";
import Dialog from "../../components/general/dialog";
import { fanwallAction } from "../../redux/actions/fanwallActions";
import { SET_PREVIOUS_ROUTE } from "../../redux/types";
import { BackIcon } from "../../assets/svg";
import "../../assets/styles/fanwall/watchContentStyle.scss";

const WatchContent = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { fanwallId } = useParams()
    const fanwallState = useSelector((state: any) => state.fanwall)
    const fanwall = fanwallState.fanwall
    const userState = useSelector((state: any) => state.auth)
    const user = userState.user
    const [isSignIn, setIsSignIn] = useState(false)
    const [isUnLock, setIsUnLock] = useState(false)
    const [isTopUp, setIsTopUp] = useState(false)

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
    const transUrl = (channel: any) => {
        if (channel) {
            let url = new URL(channel);
            let temp = url.pathname.split('/');
            return 'https://youtube.com/embed/' + temp[temp.length - 1];
        }
        else return 'https://youtube.com/embed/Ct9C8a33R0U';
    }

    useEffect(() => { window.scrollTo(0, 0) }, [location])

    return (
        <div className="watch-content-top-wrapper">
            <div className="header-part">
                <div onClick={() => { navigate("/fanwall/detail/" + fanwallId) }}><BackIcon color="black" /></div>
                <div className="page-title"><span>Watch Content</span></div>
                <div>
                </div>
            </div>
            <div className="watch-content-wrapper">
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
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                                navigate('/auth/signin');
                            }
                        }
                    ]}
                />
                <Dialog
                    display={isUnLock}
                    exit={() => { setIsUnLock(false) }}
                    wrapExit={() => { setIsUnLock(false) }}
                    title="Unlock Rewaards?"
                    context={"500 Donuts is required"}
                    buttons={[
                        {
                            text: "Cancel",
                            handleClick: () => { setIsUnLock(false) }
                        },
                        {
                            text: "Confirm",
                            handleClick: () => {
                                if (user.wallet >= 500) {
                                    dispatch(fanwallAction.unlockFanwall(fanwallId));
                                    setIsUnLock(false);
                                } else setIsTopUp(true);
                            }
                        }
                    ]}
                />
                <Dialog
                    display={isTopUp}
                    title="Top up now"
                    exit={() => { setIsTopUp(false) }}
                    wrapExit={() => { setIsTopUp(false) }}
                    context={`You need more donuts to\nsupport creators!`}
                    buttons={[
                        {
                            text: "Top up",
                            handleClick: () => {
                                dispatch({ type: SET_PREVIOUS_ROUTE, payload: `/dareme/fanwall/detail/${fanwallId}` });
                                navigate(`/myaccount/shop`);
                            }
                        }
                    ]}
                />
                <div className="watch-content-letter">
                    <span>Let's have a look at what you voted For!</span>
                </div>
                <iframe src={transUrl(fanwall.embedUrl)}
                    width={'100%'}
                    height={'400px'}
                    allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" >
                </iframe>
                <div className="watch-content-btn">
                    <Button
                        handleSubmit={() => {
                            if (checkLock()) {
                                if (user) setIsUnLock(true);
                                else setIsSignIn(true);
                            }
                        }}
                        color="primary"
                        fillStyle={"fill"}
                        width="300px"
                        shape="rounded"
                        text="Unlock Exclusive Rewards!"
                    />
                </div>
            </div>
        </div>
    );
}

export default WatchContent;