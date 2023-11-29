import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CategoryBtn from "../../../components/general/categoryBtn";
import ContainerBtn from "../../../components/general/containerBtn";
import Hint from "../../../components/general/hint";
import Input from "../../../components/general/input";
import Dialog from "../../../components/general/dialog";
import Title from "../../../components/general/title";
import { SET_FUNDME } from "../../../redux/types";
import { LanguageContext } from "../../../routes/authRoute";
import { HotIcon } from "../../../assets/svg";
import "../../../assets/styles/fundme/create/rewards.scss";

const FundmeRewards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fundmeStore = useSelector((state: any) => state.fundme);
  const fundmeState = fundmeStore.fundme;
  const contexts = useContext(LanguageContext);
  const [openHint, setOpenHint] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(fundmeState.rewardText ? fundmeState.rewardText : "");
  const [reward, setReward] = useState(fundmeState.reward ? fundmeState.reward : 10);
  const [openSet, setOpenSet] = useState(false)
  const [open, setOpen] = useState<boolean>(false);
  const categoris: string[] = contexts.FUNDME_REWARDS;

  const handleSave = () => {
    if (Number(reward) === 1) setOpenSet(true)
    else {
      const state = { ...fundmeState, rewardText: title === "" ? null : title, reward: reward };
      dispatch({ type: SET_FUNDME, payload: state });
      navigate("/fundme/create");
    }
  };

  useEffect(() => { window.scrollTo(0, 0) }, []);

  return (
    <>
      <div className="title-header">
        <Title
          title={contexts.HEADER_TITLE.REWARDS_TITLE}
          back={() => {
            if (fundmeState.rewardText !== title) {
              if (fundmeState.rewardText === null && title === "") navigate("/fundme/create/");
              else setOpen(true);
            } else navigate("/fundme/create");
          }}
          hint={() => { setOpenHint(true) }}
        />
      </div>
      <div className="dareme-title-wrapper">
        <Dialog
          display={openSet}
          title="Oops!"
          exit={() => { setOpenSet(false) }}
          wrapExit={() => { setOpenSet(false) }}
          context={"At least 2 Donuts for SuperFans.🍩"}
        />
        <Dialog
          display={open}
          title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
          exit={() => { setOpen(false) }}
          wrapExit={() => { setOpen(false) }}
          context={`${contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}`}
          buttons={[
            {
              text: `${contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT}`,
              handleClick: () => {
                setOpen(false);
                handleSave();
              }
            }
          ]}
        />
        <Hint
          style={{ left: "calc(100% - 336px)" }}
          open={openHint}
          exit={() => { setOpenHint(false); }}
          color="#059669"
          title={contexts.HINT.TITLE.WHAT_IS_SUPERFAN}
          context={contexts.HINT.BODY_LETTER.WHAT_IS_SUPERFAN}
        />
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;{contexts.REVIEW_LETTER.DNUTS}</span>
        </div>
        <div className="donuts-number" style={{ marginTop: '20px' }}>
          <label>{contexts.REVIEW_LETTER.DONUTS_NUMBER}</label>
          <Input
            type="input"
            isNumber={true}
            title={reward}
            width={150}
            minnum={1}
            maxnum={100000}
            step={1}
            setTitle={setReward}
            setFocus={() => { }}
          />
        </div>
        <div className="audience-letter">{contexts.REVIEW_LETTER.AUDIENCE_LETTER}</div>
        <div className="headerSet">
          <HotIcon color="#EFA058" />
          <span>&nbsp;{contexts.REVIEW_LETTER.REWARDS}</span>
        </div>
        <div className="title-input">
          <Input
            type="input"
            placeholder={contexts.REVIEW_LETTER.EXCLUSIVE_CHAT}
            wordCount={40}
            title={title}
            setTitle={setTitle}
            setFocus={() => { }}
          />
        </div>
        <div className="categories">
          {categoris.map((category, i) => (
            <div key={i} className="category" onClick={() => setTitle(category)}>
              <CategoryBtn color="primary" text={category} />
            </div>
          ))}
        </div>
        <div className="save-btn" onClick={handleSave}>
          <ContainerBtn disabled={false} styleType="fill" text={contexts.GENERAL_LETTER.SAVE} />
        </div>
      </div>
    </>
  );
};

export default FundmeRewards;
