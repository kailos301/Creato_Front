import * as actionTypes from '../types';

const INITIAL_STATE: any = {
    fanwall: {
        fundme: null,
        dareme: null,
        writer: null,
        video: null,
        embedUrl: null,
        sizeType: null,
        message: null,
        cover: null,
        posted: null,
    },
    videoFile: null,
    videoSizeType: null,
    coverFile: null,
    tipId: null,
    tip: null,
    tips: [],
    goal: null,
    wallet: null,
    fanwalls: [],
    itemType: null
}

const fanwallReducer = (state: any = INITIAL_STATE, action: any) => {
    const { payload = null } = action;
    switch (action.type) {
        case actionTypes.SET_FANWALL:
            return { ...state, fanwall: payload }
        case actionTypes.SET_FANWALLS:
            state.fanwalls = payload;
            return { ...state }
        case actionTypes.SET_FANWALL_TYPE:
            state.itemType = payload;
            return { ...state }
        case actionTypes.SET_TIPS:
            state.tips = payload;
            return { ...state }
        case actionTypes.SET_TIP:
            state.tip = payload;
            return { ...state }
        case actionTypes.SET_TIPID:
            state.tipId = payload
            return { ...state }
        case actionTypes.SET_FANWALL_VIDEOFILE:
            state.videoFile = payload
            return { ...state }
        case actionTypes.SET_FANWALL_VIDEO_SIZETYPE:
            state.videoSizeType = payload
            return { ...state }
        case actionTypes.SET_FANWALL_COVERFILE:
            state.coverFile = payload
            return { ...state }
        case actionTypes.SET_FANWALL_INITIAL:
            return {
                fanwall: {
                    fundme: null,
                    dareme: null,
                    writer: null,
                    video: null,
                    embedUrl: null,
                    message: null,
                    sizeType: null,
                    posted: null,
                    cover: null,
                },
                videoFile: null,
                videoSizeType: null,
                coverFile: null,
                tipId: null,
                tip: null,
                tips: [],
                winOption: null,
                goal: null,
                wallet: null,
                fanwalls: []
            };
        default:
            return state;
    }
};

export default fanwallReducer;