import { Dispatch } from "redux";
import {
  SET_LOADING_FALSE,
  SET_LOADING_TRUE,
  SET_FANWALL_INITIAL,
  SET_FANWALLS,
  SET_FANWALL,
  SET_USER,
  SET_FUNDME,
  SET_DAREME,
  SET_TIPS,
  SET_USERS,
  SET_DAREME_DETAIL_INITIAL,
  SET_FUNDME_DETAIL_INITIAL,
} from "../types";
import * as api from "../../api";

export const fanwallAction = {
  postFanwall: (itemId: any, type: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    try {
      dispatch({ type: SET_LOADING_TRUE })
      let result = null
      if (type === "dareme") result = await api.getFanwallByDareMeId(itemId)
      else result = await api.getFanwallByFundMeId(itemId)
      const { data } = result
      if (data.success) {
        const payload = data.payload
        dispatch({ type: SET_LOADING_FALSE })
        if (type === "dareme") {
          dispatch({ type: SET_DAREME_DETAIL_INITIAL })
          dispatch({ type: SET_DAREME, payload: payload.dareme })
        } else {
          dispatch({ type: SET_FUNDME_DETAIL_INITIAL })
          dispatch({ type: SET_FUNDME, payload: payload.fundme })
        }
        if (payload.fanwall) dispatch({ type: SET_FANWALL, payload: payload.fanwall })
        else dispatch({ type: SET_FANWALL_INITIAL })
        navigate(`/fanwall/post/${itemId}?type=${type}`)
      }
    } catch (err: any) {
      console.log(err)
    }
  },

  saveFanwall: (fanwall: any, itemId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    let result: any = null
    let cover: any = null
    if (fanwall.video) {
      if (fanwall.video.preview?.indexOf('uploads') === -1) {
        const formData = new FormData()
        formData.append("file", fanwall.video)
        const config = {
          headers: { "content-type": "multipart/form-data" },
        }
        result = await api.uploadFanwall(formData, config);
      }
    }
    if (fanwall.cover) {
      if (fanwall.cover.preview?.indexOf('uploads') === -1) {
        const formData = new FormData()
        formData.append("file", fanwall.cover)
        const config = { headers: { "content-type": "multipart/form-data" } }
        cover = await api.selectCover(formData, config)
      }
    }
    api.saveFanwall({
      fanwallId: fanwall.id,
      type: fanwall.type,
      itemId: itemId,
      sizeType: fanwall.sizeType,
      cover: cover?.data.success ? cover.data.path : fanwall.cover,
      video: result?.data.success ? result.data.path : fanwall.video,
      message: fanwall.message === "" ? null : fanwall.message,
      embedUrl: fanwall.embedUrl === "" ? null : fanwall.embedUrl,
      posted: fanwall.posted
    }).then((result) => {
      const { data } = result;
      dispatch({ type: SET_LOADING_FALSE })
      if (data.success) {
        if (fanwall.admin) navigate('/admin/fanwalls')
        if (fanwall.type === 'DareMe') navigate(`/dareme/result/${itemId}`)
        else if (fanwall.type === 'FundMe') navigate(`/fundme/result/${itemId}`)
      }
    }).catch(err => console.log(err));
  },

  getPostDetail: (fanwallId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    dispatch({ type: SET_FANWALL_INITIAL })
    api.getPostDetail(fanwallId)
      .then((result: any) => {
        const { data } = result
        if (data.success) {
          const { payload } = data
          dispatch({ type: SET_FANWALL, payload: payload.fanwall })
          dispatch({ type: SET_LOADING_FALSE })
        }
      }).catch((err: any) => console.log(err))
  },

  getFanwallDetail: (fanwallId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.getPostDetail(fanwallId)
      .then((result: any) => {
        const { data } = result
        if (data.success) {
          dispatch({ type: SET_FANWALL, payload: { fanwall: data.fanwall, itemType: 'fundme' } })
          dispatch({ type: SET_LOADING_FALSE })
        }
      }).catch((err: any) => console.log(err))
  },

  getFanwallsByPersonalUrl: (data: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_FANWALLS, payload: [] })
    dispatch({ type: SET_TIPS, payload: [] })
    api.getFanwallsByPersonalisedUrl({ url: data })
      .then((result: any) => {
        const { data } = result
        if (data.success) {
          const payload = data.payload
          dispatch({ type: SET_LOADING_FALSE })
          dispatch({ type: SET_FANWALLS, payload: payload.fanwalls })
          dispatch({ type: SET_TIPS, payload: payload.tips })
          dispatch({ type: SET_USERS, payload: [payload.user] })
        }
      }).catch((err: any) => console.log(err));
  },

  likeFanwall: (fanwallId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.likeFanwall({ fanwallId: fanwallId })
      .then((result: any) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_FANWALL, payload: { fanwall: data.fanwall, itemType: data.fanwall.fundme ? 'fundme' : 'dareme' } });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch((err: any) => console.log(err));
  },

  unlockFanwall: (fanwallId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.unlockFanwall({ fanwallId: fanwallId })
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_LOADING_FALSE });
        if (data.success) {
          dispatch({ type: SET_FANWALL, payload: { fanwall: data.fanwall, itemType: data.fanwall.fundme ? 'fundme' : 'dareme' } });
          dispatch({ type: SET_USER, payload: data.user });
        }
      }).catch(err => console.log(err));
  },

  deleteFanwall: (fanwallId: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.deleteFanwall(fanwallId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE });
          navigate(url);
        }
      }).catch(err => console.log(err));
  },

  getFanwallList: () => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    dispatch({ type: SET_FANWALLS, payload: [] })
    api.getFanwallList()
      .then((result) => {
        const { data } = result
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE })
          dispatch({ type: SET_FANWALLS, payload: data.fanwalls })
        }
      }).catch(err => console.log(err))
  }
};