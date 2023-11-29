import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player";
import ContainerBtn from "../../components/general/containerBtn";
import Title from "../../components/general/title";
import Dialog from "../../components/general/dialog";
import { LanguageContext } from "../../routes/authRoute";
import { SET_FANWALL } from "../../redux/types";
import CONSTANT from "../../constants/constant";
import { AlbumIcon, DeleteIcon, BackIcon } from "../../assets/svg";
import "../../assets/styles/dareme/create/uploadVideoStyle.scss";

const UploadVideo = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { itemId } = useParams();
    const fanwallState = useSelector((state: any) => state.fanwall);
    const fanwall = fanwallState.fanwall;
    const playerRef = useRef<ReactPlayer>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState<boolean>(false);
    const contexts = useContext(LanguageContext);
    const [searchParams, setSearchParams] = useSearchParams()
    const type = searchParams.get("type")

    const handleSave = () => {
        if (fanwall.cover === null) {
            const video: any = document.getElementById("element")?.firstChild
            let canvas = document.createElement("canvas") as HTMLCanvasElement
            let context = canvas.getContext('2d')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            context?.drawImage(video, 0, 0)
            let url = canvas.toDataURL('image/png')
            fetch(url)
                .then(res => res.blob())
                .then(blob => {
                    const imgfile = new File([blob], 'dot.png', blob);
                    const imgFile = Object.assign(imgfile, { preview: url })
                    const state = { ...fanwall, cover: imgFile }
                    dispatch({ type: SET_FANWALL, payload: { fanwall: state, itemType: fanwallState.itemType } })
                    navigate(`/fanwall/post/${itemId}?type=${type}`)
                })
        }
        else navigate(`/fanwall/post/${itemId}?type=${type}`)
    }

    const handleUploadVideo = (e: any) => {
        const { files } = e.target;
        const loadFile = Object.assign(files[0], { preview: URL.createObjectURL(files[0]) });
        window.URL = window.URL || window.webkitURL;
        if (files.length) {
            if (files[0].size < CONSTANT.MAX_VIDEO_FILE_SIZE) {
                const video = document.createElement('video');
                video.preload = "metadata";
                video.onloadedmetadata = evt => {
                    const size = video.videoWidth / video.videoHeight;
                    const type = size >= 0.583;
                    const state = { ...fanwall, sizeType: type, video: loadFile };
                    dispatch({ type: SET_FANWALL, payload: { fanwall: state, itemType: fanwallState.itemType } });
                }
                video.src = URL.createObjectURL(loadFile);
            } else alert("file size is over 100M");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="upload-video-top-wrapper">
            <div className="header-part">
                <div onClick={() => {
                    if (fanwall.cover === null && fanwall.video === null) navigate(`/fanwall/post/${itemId}?type=${type}`)
                    else setOpen(true)
                }}><BackIcon color="black" /></div>
                <div className="page-title"><span>{contexts.HEADER_TITLE.EXCLUSIVE_VIDEO_UPLOAD}</span></div>
                <div></div>
            </div>
            <div className="upload-Video-wrapper">
                <Dialog
                    display={open}
                    exit={() => { setOpen(false) }}
                    wrapExit={() => { setOpen(false) }}
                    title={contexts.DIALOG.HEADER_TITLE.CONFIRM}
                    context={contexts.DIALOG.BODY_LETTER.SAVE_DRAFT}
                    buttons={[
                        {
                            text: contexts.DIALOG.BUTTON_LETTER.SAVE_DRAFT,
                            handleClick: () => { handleSave() }
                        }

                    ]}
                />
                <div className="subtitle">
                    {contexts.EXCLUSIVE_VIDEO_UPLOAD.UPLOAD_VIDEO}
                </div>
                <div className="upload-video-fill">
                    {fanwall.video ? (
                        <>
                            <div
                                className="delete-icon"
                                onClick={() => {
                                    const state = { ...fanwall, video: null };
                                    dispatch({ type: SET_FANWALL, payload: { fanwall: state, itemType: fanwallState.itemType } });
                                }}
                            >
                                <DeleteIcon color="#BAB6B5" />
                            </div>
                            <ReactPlayer
                                id="element"
                                ref={playerRef}
                                className={fanwall.sizeType ? "react-player-height" : "react-player-width"}
                                url={fanwall.video ? fanwall.video.preview ? fanwall.video.preview : `${process.env.REACT_APP_SERVER_URL}/${fanwall.video}` : ""}
                                playing={false}
                                onProgress={(progress) => { if (progress.playedSeconds >= progress.loadedSeconds) playerRef.current?.seekTo(0); }}
                            />
                        </>
                    ) : (
                        <div
                            className="camera-icon"
                            onClick={() => { fileInputRef.current?.click(); }}
                        >
                            <AlbumIcon color="black" />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUploadVideo}
                        hidden
                        accept="video/*"
                        value=""
                    />
                </div>
                {
                    !(fanwall.video) ? (
                        <>
                        </>
                    ) :
                        (
                            <div className="save-btn" onClick={handleSave}>
                                <ContainerBtn disabled={false} styleType="fill" text="Save" />
                            </div>
                        )}
            </div>
        </div>
    )
}

export default UploadVideo
