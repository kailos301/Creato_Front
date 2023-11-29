import { useState, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "./general/button"
import { TipIcon, Dare2Icon, ProfileIcon, AddIcon, RetrieveIcon, ExpandIcon } from "../assets/svg"
import CreatePart from "../assets/img/create_part.png"
import TippingPart from "../assets/img/tipping_part.png"
import FanwallPart from "../assets/img/fanwall_part.png"
import "../assets/styles/letStartedStyle.scss"

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

const LetStarted = (props: any) => {
  const navigate = useNavigate()
  const width = useWindowSize()
  const { user, types, setTypes } = props
  const [hover1, setHover1] = useState(false)
  const [hover2, setHover2] = useState(false)
  const [hover3, setHover3] = useState(false)

  return (
    <div className="let-start-wrapper">
      <div className={types[0] === true ? "open-status" : "close-status"}
        onClick={() => {
          const typesTemp = [...types]
          if (typesTemp[0] === false) {
            typesTemp[0] = true
            if (width > 700) {
              typesTemp[1] = false
              typesTemp[2] = false
            }
            setTypes(typesTemp)
          }
        }}
        onMouseOver={() => { setHover1(true) }}
        onMouseOut={() => { setHover1(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <Dare2Icon color={(types[0] === true || hover1 === true) ? "#EFA058" : "#938D8A"} width={30} height={30} />
          </div>
          <div className="letter">
            <span>DareMe/FundMe</span>
          </div>
          {(width < 700 && types[0] === false) &&
            <div>
              <ExpandIcon color={hover1 ? "#EFA058" : "#938D8A"} width={35} height={35} />
            </div>
          }
        </div>
        {types[0] === true &&
          <div className="action-part">
            <div>
              <Dare2Icon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>DareMe/FundMe</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>Create Content Together</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <Button
                width={270}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Create"}
                icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                handleSubmit={() => { navigate('/create') }}
              />
            </div>
          </div>
        }
        {types[0] === true &&
          <div className="image">
            <div className="image-letter">
              <span>Where the journey start</span>
            </div>
            <img src={CreatePart} alt="Create" width="100%" style={{ margin: '20px 0px' }} />
            <div className="image-button">
              <Button
                width={250}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Create"}
                icon={[<AddIcon color="white" />, <AddIcon color="white" />, <AddIcon color="white" />]}
                handleSubmit={() => { navigate('/create') }}
              />
            </div>
            {width < 700 &&
              <div style={{ margin: '15px 0px 0px 0px', display: 'flex', justifyContent: 'center' }}
                onClick={(e) => {
                  const typesTemp = [...types]
                  typesTemp[0] = false
                  setHover1(false)
                  setTypes(typesTemp)
                }}
              >
                <RetrieveIcon color="#EFA058" width={35} height={35} />
              </div>
            }
          </div>
        }
      </div>
      <div className={types[1] === true ? "open-status" : "close-status"}
        onClick={() => {
          const typesTemp = [...types]
          if (typesTemp[1] === false) {
            typesTemp[1] = true
            if (width > 700) {
              typesTemp[0] = false
              typesTemp[2] = false
            }
            setTypes(typesTemp)
          }
        }}
        onMouseOver={() => { setHover2(true) }}
        onMouseOut={() => { setHover2(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <TipIcon color={(types[1] === true || hover2 === true) ? "#EFA058" : "#938D8A"} width={30} height={30} />
          </div>
          <div className="letter">
            <span>Tipping</span>
          </div>
          {(width < 700 && types[1] === false) &&
            <div>
              <ExpandIcon color={hover2 ? "#EFA058" : "#938D8A"} width={35} height={35} />
            </div>
          }
        </div>
        {types[1] === true &&
          <div className="action-part">
            <div>
              <TipIcon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>Tipping</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>Donate To Support</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <Button
                width={270}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Tip Donuts"}
                icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                handleSubmit={() => { navigate('/creators') }}
              />
            </div>
          </div>
        }
        {types[1] === true &&
          <div className="image">
            <div className="image-letter">
              <span>Send support to creators</span>
            </div>
            <img src={TippingPart} alt="Create" width="90%" style={{ margin: '10px 0px' }} />
            <div className="image-button">
              <Button
                width={250}
                fillStyle="fill"
                color="primary"
                shape="rounded"
                text={"Tip Donuts"}
                icon={[<TipIcon color="white" />, <TipIcon color="white" />, <TipIcon color="white" />]}
                handleSubmit={() => { navigate('/creators') }}
              />
            </div>
            {width < 700 &&
              <div style={{ margin: '15px 0px 0px 0px', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                  const typesTemp = [...types]
                  typesTemp[1] = false
                  setHover2(false)
                  setTypes(typesTemp)
                }}
              >
                <RetrieveIcon color="#EFA058" width={35} height={35} />
              </div>
            }
          </div>
        }
      </div>
      <div className={types[2] === true ? "open-status" : "close-status"}
        onClick={() => {
          const typesTemp = [...types]
          if (types[2] === false) {
            typesTemp[2] = true
            if (width > 700) {
              typesTemp[0] = false
              typesTemp[1] = false
            }
            setTypes(typesTemp)
          }
        }}
        onMouseOver={() => { setHover3(true) }}
        onMouseOut={() => { setHover3(false) }}
      >
        <div className="title-part">
          <div className="icon">
            <ProfileIcon color={(types[2] === true || hover3 === true) ? "#EFA058" : "#938D8A"} width={32} height={32} />
          </div>
          <div className="letter">
            <span>FanWall</span>
          </div>
          {(width < 700 && types[2] === false) &&
            <div>
              <ExpandIcon color={hover3 ? "#EFA058" : "#938D8A"} width={35} height={35} />
            </div>
          }
        </div>
        {types[2] === true &&
          <div className="action-part">
            <div>
              <ProfileIcon color="#EFA058" width={200} height={200} />
            </div>
            <div className="action-title">
              <span>FanWall</span>
            </div>
            <div className="action-content" style={{ marginTop: '20px' }}>
              <span>For Fans & Creators</span>
            </div>
            <div className="buttons" style={{ marginTop: '30px' }}>
              <div>
                <Button
                  width={270}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"Creator’s FanWall"}
                  handleSubmit={() => { navigate('/creators') }}
                />
              </div>
              <div style={{ marginTop: '5px' }}>
                <Button
                  width={270}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"View my FanWall"}
                  handleSubmit={() => {
                    if (user) navigate(`/${user.personalisedUrl}`)
                    else navigate('/auth/signin')
                  }}
                />
              </div>
            </div>
          </div>
        }
        {types[2] === true &&
          <div className="image">
            <div className="image-letter">
              <span>Organized your activities</span>
            </div>
            <img src={FanwallPart} alt="Create" width="95%" style={{ margin: '10px 0px' }} />
            <div className="image-button">
              <div>
                <Button
                  width={250}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"Creator’s FanWall"}
                  handleSubmit={() => { navigate('/creators') }}
                />
              </div>
              <div style={{ marginTop: '5px' }}>
                <Button
                  width={250}
                  fillStyle="fill"
                  color="primary"
                  shape="rounded"
                  text={"View my FanWall"}
                  handleSubmit={() => {
                    if (user) navigate(`/${user.personalisedUrl}`)
                    else navigate('/auth/signin')
                  }}
                />
              </div>
              {width < 700 &&
                <div style={{ margin: '15px 0px 0px 0px', display: 'flex', justifyContent: 'center' }}
                  onClick={() => {
                    const typesTemp = [...types]
                    typesTemp[2] = false
                    setHover3(false)
                    setTypes(typesTemp)
                  }}
                >
                  <RetrieveIcon color="#EFA058" width={35} height={35} />
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div >
  )
}

export default LetStarted