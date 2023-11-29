import { Dispatch } from "redux";
import {
  SET_FUNDME_INITIAL,
  SET_FUNDMES,
  SET_FUNDME,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  SET_USER,
  SET_FUNDME_DETAIL_INITIAL,
  SET_DIALOG_STATE,
} from "../types";
import * as api from "../../api";

export const fundmeAction = {
  //// Clean -----------------------------------------

  getFundMeDetails: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    dispatch({ type: SET_FUNDME_DETAIL_INITIAL })
    api.getFundMeDetails(fundmeId)
      .then((result: any) => {
        const { data } = result
        if (data.success) {
          const payload = data.payload
          dispatch({ type: SET_FUNDME, payload: payload.fundme })
          dispatch({ type: SET_LOADING_FALSE })
        }
      }).catch((err) => {
        console.log(err)
        dispatch({ type: SET_LOADING_FALSE })
      })
  },

  fundCreator: (fundmeId: any, donuts: any, reward: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE })
    api.fundCreator({ fundmeId: fundmeId, amount: donuts })
      .then((result: any) => {
        const { data } = result
        dispatch({ type: SET_LOADING_FALSE })
        if (data.success) {
          const payload = data.payload
          if (donuts < reward) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'vote_non_superfan', state: true } })
          else dispatch({ type: SET_DIALOG_STATE, payload: { type: 'vote_superfan', state: true } })
          dispatch({ type: SET_FUNDME, payload: payload.fundme })
          dispatch({ type: SET_USER, payload: payload.user })
        }
      }).catch((err: any) => {
        console.log(err)
        dispatch({ type: SET_LOADING_FALSE })
      })
  },


  //////////////////////////////////////////////////////
  getDraftFundme: (navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.getDraftFundme()
      .then((result) => {
        const { data } = result;
        dispatch({ type: SET_FUNDME_INITIAL });
        if (data.isDraft) dispatch({ type: SET_FUNDME, payload: data.fundme });
        navigate('/fundme/create');
        dispatch({ type: SET_LOADING_FALSE });
      })
      .catch((err) => console.log(err));
  },

  saveFundme: (fundme: any, teaser: any, cover: any, navigate: any, url: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultTeaser = null;
    let resultCover = null;
    if (fundme.title === null && fundme.deadline === null && fundme.category === null && (fundme.teaser === null && teaser === null) && fundme.goal === null) {
      navigate(url);
    } else {
      if (teaser && teaser.preview.indexOf('uploads') === -1) {
        const formData = new FormData();
        formData.append("file", teaser);
        const config = { headers: { "content-type": "multipart/form-data" } };
        resultTeaser = await api.uploadFile(formData, config);
      }
      if (cover) {
        const formData = new FormData();
        formData.append("file", cover);
        const config = { headers: { "content-type": "multipart/form-data" } };
        resultCover = await api.selectCover(formData, config);
      }

      if (resultTeaser?.data.success) fundme.teaser = resultTeaser.data.path;
      if (resultCover?.data.success) fundme.cover = resultCover.data.path;
      api.saveFundme({ fundme: fundme })
        .then((res) => {
          const { data } = res;
          if (data.success) {
            dispatch({ type: SET_FUNDME, payload: data.fundme });
            navigate(url);
          }
          dispatch({ type: SET_LOADING_FALSE });
        }).catch((err) => console.log(err));
    }
  },

  eraseDraft: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    if (fundmeId) {
      dispatch({ type: SET_LOADING_TRUE });
      api.fundmedeleteDraft(fundmeId)
        .then((result: any) => {
          const { data } = result;
          if (data.success) {
            dispatch({ type: SET_FUNDME_INITIAL });
            dispatch({ type: SET_LOADING_FALSE })
          }
        }).catch(err => console.log(err));
    }
    else dispatch({ type: SET_FUNDME_INITIAL });
  },

  publishFundme: () => async (dispatch: Dispatch<any>) => {
    api.publishFundme()
      .then((result) => {
        const { data } = result
        if (data.success) dispatch({ type: SET_DIALOG_STATE, payload: { type: 'create_fundme', state: true } })
      }).catch((err) => console.log(err));
  },

  checkDetailsAndResults: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.checkFundMeFinished(fundmeId)
      .then((result: any) => {
        const { data } = result;
        dispatch({ type: SET_FUNDME_INITIAL });
        if (data.finished) navigate(`/fundme/result/${fundmeId}`);
        else navigate(`/fundme/details/${fundmeId}`);
      }).catch((err: any) => console.log(err));
  },

  getFundmeResult: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_FUNDME_INITIAL });
    api.getFundmeResult(fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDME, payload: data.fundme })
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch((err) => console.log(err));
  },

  // ADMIN
  getFundMeList: (search: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    dispatch({ type: SET_FUNDME_INITIAL });
    api.getFundMeList({ search: search })
      .then((result) => {
        const { data } = result;
        if (data.success) dispatch({ type: SET_FUNDMES, payload: data.fundmes });
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err));
  },

  setFundMeShow: (show: any, fundmeId: any, fundme: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.setFundMeShow({ show: show }, fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          const state = { ...fundme, show: show };
          dispatch({ type: SET_FUNDME, payload: state });
        }
        dispatch({ type: SET_LOADING_FALSE });
      }).catch(err => console.log(err))
  },

  deleteFundMe: (fundmeId: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.deleteFundMe(fundmeId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDMES, payload: [] });
          navigate('/admin/fundmes');
        }
      }).catch(err => console.log(err));
  },

  updateFundMe: (fundmeId: any, fundmeData: any, navigate: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    let resultTeaser = null;
    let resultCover = null;
    if (fundmeData.teaserFile) {
      const formData = new FormData();
      formData.append("file", fundmeData.teaserFile);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultTeaser = await api.uploadFile(formData, config);
    }
    if (fundmeData.coverFile) {
      const formData = new FormData();
      formData.append("file", fundmeData.coverFile);
      const config = { headers: { "content-type": "multipart/form-data" } };
      resultCover = await api.selectCover(formData, config);
    }
    if (resultTeaser?.data.success) fundmeData.teaserFile = resultTeaser.data.path;
    if (resultCover?.data.success) fundmeData.coverFile = resultCover.data.path;
    api.updateFundMe(fundmeId, { fundme: fundmeData })
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_LOADING_FALSE });
          navigate(`/admin/fundmes`);
        }
      }).catch(err => console.log(err));
  },

  deleteOption: (fundmeId: any, optionId: any) => async (dispatch: Dispatch<any>) => {
    dispatch({ type: SET_LOADING_TRUE });
    api.deleteOption(fundmeId, optionId)
      .then((result) => {
        const { data } = result;
        if (data.success) {
          dispatch({ type: SET_FUNDME, payload: data.fundme });
          dispatch({ type: SET_LOADING_FALSE });
        }
      }).catch(err => console.log(err));
  },

  //   getFundmeOptions: (fundmeId: any) => async (dispatch: Dispatch<any>) => {
  //     dispatch({ type: SET_LOADING_TRUE });
  //     api.getFundmeOptions(fundmeId)
  //       .then((result) => {
  //         const { data } = result;
  //         if(data.success) {
  //           dispatch({ type: SET_ADMIN_OPTIONS, payload: data.options });
  //           dispatch({ type: SET_LOADING_FALSE });
  //         }
  //       }).catch(err => console.log(err));
  //   }
}