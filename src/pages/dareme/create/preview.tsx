import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { daremeAction } from "../../../redux/actions/daremeActions";
import VideoCardDesktop from "../../../components/dareme/videoCardDesktop";
import VideoCardMobile from "../../../components/dareme/videoCardMobile";
import AvatarLink from "../../../components/dareme/avatarLink";
import ContainerBtn from "../../../components/general/containerBtn";
import DareOption from "../../../components/general/dareOption";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import CategoryBtn from "../../../components/general/categoryBtn";
import Gif from "../../../components/general/gif";
import { LanguageContext } from "../../../routes/authRoute";
import { CreatoCoinIcon, RewardIcon } from '../../../assets/svg';
import { SET_TEASER_FILE, SET_COVER_FILE, SET_DIALOG_STATE, SET_DAREME_DETAIL_INITIAL } from "../../../redux/types";
import CreateDaremeGif from '../../../assets/img/create_dareme.gif';
import "../../../assets/styles/dareme/create/previewStyle.scss";

const Preview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contexts = useContext(LanguageContext);
  const daremeStore = useSelector((state: any) => state.dareme);
  const userState = useSelector((state: any) => state.auth);
  const dlgState = useSelector((state: any) => state.load.dlgState);
  const dareState = daremeStore.dareme;
  const [openPublishDlg, setOpenPublishDlg] = useState<boolean>(false);
  const [openCopyLink, setOpenCopyLink] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [createDaremeGif, setCreateDaremeGif] = useState(false);
  const user = userState.user;
  const [options, setOptions] = useState<Array<any>>([]);

  const SaveDareInfo = () => {
    dispatch(daremeAction.publishDareme());
  };

  const onPublish = () => {
    setOpenPublishDlg(false)
    setIsCopied(false)
    SaveDareInfo()
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch({ type: SET_DIALOG_STATE, payload: { type: '', state: false } });
  }, []);

  useEffect(() => {
    if (dlgState.type === 'create_dareme' && dlgState.state === true) {
      setOpenCopyLink(true);
      setCreateDaremeGif(true);
    }
  }, [dlgState]);

  useEffect(() => {
    if (createDaremeGif) setTimeout(() => { setCreateDaremeGif(false) }, 5500);
  }, [createDaremeGif]);

  useEffect(() => {
    const tempOptions = [
      {
        voters: 0,
        donuts: 0,
        option: dareState.options[0] ? dareState.options[0].option.title : '',
        owner: user.name,
        canVote: true,
      },
      {
        voters: 0,
        donuts: 0,
        option: dareState.options[1] ? dareState.options[1].option.title : '',
        owner: user.name,
        canVote: true,
      },
    ];
    setOptions(tempOptions);
  }, [dareState.options]);

  return (
    <>
      <div className="title-header">
        {createDaremeGif &&
          <Gif gif={CreateDaremeGif} />
        }
        <Title
          title={contexts.GENERAL_LETTER.PREVIEW}
          back={() => {
            dispatch({ type: SET_TEASER_FILE, payload: null });
            dispatch({ type: SET_COVER_FILE, payload: null });
            navigate("/dareme/create");
          }}
        />
      </div>
      <Dialog
        title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
        display={openPublishDlg}
        context={contexts.DIALOG.BODY_LETTER.PUBLISH_ITEM}
        exit={() => { setOpenPublishDlg(false) }}
        wrapExit={() => { setOpenPublishDlg(false) }}
        buttons={[
          {
            text: contexts.PUBLISH,
            handleClick: () => { onPublish() }
          }
        ]}
      />
      <Dialog
        display={openCopyLink}
        title="Congratulations!"
        exit={() => {
          setOpenCopyLink(false);
          dispatch({ type: SET_DAREME_DETAIL_INITIAL })
          navigate(`/${user.personalisedUrl}`);
        }}
        wrapExit={() => {
          setOpenCopyLink(false);
          dispatch({ type: SET_DAREME_DETAIL_INITIAL })
          navigate(`/${user.personalisedUrl}`);
        }}
        context={"Game on!\nSpread the words now."}
        buttons={[
          {
            text: isCopied ? "Copied" : "Copy link",
            handleClick: () => {
              navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/dareme/details/${dareState._id}`);
              setIsCopied(true);
            }
          }
        ]}
        avatars={dareState.cover ? [`${process.env.REACT_APP_SERVER_URL}/${dareState.cover}`] : []}
        sizeType={dareState.sizeType}
        social
        shareType={"create"}
        daremeTitle={dareState.title}
        daremeId={dareState._id}
        ownerName={user.name}
      />
      <div className="preview-dareme-wrapper">
        <div className="desktop-header-info">
          <div className="time-info">
            <div className="left-time">
              {dareState.deadline} {contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.DAYS} {contexts.GENERAL_COMPONENT.MOBILE_VIDEO_CARD.LEFT}
            </div>
            <div className="vote-info">
              <CreatoCoinIcon color="black" />
              <span>0</span>
            </div>
          </div>
          <div className="title-category">
            <div className="dare-title">
              <span>{dareState.title}</span>
            </div>
            <div className="dare-category">
              <CategoryBtn text={contexts.DAREME_CATEGORY_LIST[dareState.category - 1]} color="primary" />
            </div>
          </div>
        </div>
        <div className="main-body">
          <div className="preview-desktop-videoCardDesktop">
            <VideoCardDesktop
              url={dareState.teaser ? `${process.env.REACT_APP_SERVER_URL}/${dareState.teaser}` : ""}
              sizeType={dareState.sizeType}
              coverImage={dareState.cover ? `${process.env.REACT_APP_SERVER_URL}/${dareState.cover}` : ""}
            />
            <AvatarLink
              username={user.name}
              avatar={user.avatar}
              ownerId={user.id}
              handleAvatar={() => { navigate(`/${user.personalisedUrl}`) }}
              daremeId={dareState._id}
            />
          </div>
          <div className="preview-information">
            <div className="preview-videoCardMobile">
              <VideoCardMobile
                url={dareState.teaser ? `${process.env.REACT_APP_SERVER_URL}/${dareState.teaser}` : ""}
                donuts={0}
                category={contexts.DAREME_CATEGORY_LIST[dareState.category - 1]}
                time={dareState.deadline}
                title={dareState.title}
                sizeType={dareState.sizeType}
                coverImage={dareState.cover ? `${process.env.REACT_APP_SERVER_URL}/${dareState.cover}` : ""}
                handleSubmit={() => { }}
              />
              <AvatarLink
                username={user.name}
                avatar={user.avatar}
                ownerId={user.id}
                handleAvatar={() => { navigate(`/${user.personalisedUrl}`) }}
              />
            </div>
            <div className="dare-creator">
              <div className="dare-btn" style={{ marginTop: '30px' }}>
                <ContainerBtn
                  disabled={false}
                  styleType="outline"
                  text={contexts.FUNDME_LETTER.SEE_SUPERFAN_REWARD}
                  icon={[<RewardIcon color="#EFA058" />, <RewardIcon color="white" />]}
                />
              </div>
              <div className="select-dare-option">
                <span></span>{contexts.CREATE_DAREME_LETTER.SELECT_DARE_OPTION}<span></span>
              </div>
              <div className="dare-btn">
                <div>
                  <ContainerBtn
                    disabled={false}
                    styleType="fill"
                    text={contexts.DAREME_DETAILS.HAVE_IDEA}
                  />
                </div>
              </div>
              <div className="or-style">{contexts.GENERAL_LETTER.OR}</div>
            </div>
            <div className="dare-options">
              {
                options.map((option: any, index: any) =>
                  <div className="dare-option" key={index}>
                    <DareOption
                      leading={false}
                      donuts={option.donuts}
                      voters={0}
                      canVote={option.canVote}
                      dareTitle={option.option}
                      username={option.owner}
                      disabled={false}
                      handleSubmit={() => { }}
                    />
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div className="publish-back">
        <div className="back-btn" onClick={() => {
          dispatch({ type: SET_TEASER_FILE, payload: null });
          dispatch({ type: SET_COVER_FILE, payload: null });
          navigate("/dareme/create");
        }}>
          <ContainerBtn text={contexts.CREATE_DAREME_LETTER.BACK_TO_EDIT_MODE} styleType="outline" />
        </div>
        <div className="publish-btn" onClick={() => { setOpenPublishDlg(true) }}>
          <ContainerBtn text={contexts.PUBLISH} styleType="fill" />
        </div>
      </div>
    </>
  );
};

export default Preview;
