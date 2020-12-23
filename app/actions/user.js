import axios from '../utils/api';
import url from '../config/api';
import apiConfig from '../config/api';
import storage from '../utils/storage';
import { ActionTypes, Strings } from '../constants/';
import { getLanguage, showToast } from '../utils/common';
import Axios from 'axios';

export const signin = payloads => dispatch => {
  console.log("Payloads : ", payloads)
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.post(url.signin, { payloads: payloads })
    .then(res => {
      console.log("res", res);
      dispatch({ type: ActionTypes.LOADING, isLoading: false });
      if (res.data.status == 'success') {
        return res.data;
      } else {
        showToast(res.data.message, 'danger')
      }
    });
}

export const signup = payloads => dispatch => {
  console.log("Payloads: ", payloads);
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.post(url.signup, { payloads: payloads }).then(res => {
    console.log("Res: ", res)
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const logoutUser = () => dispatch => {
  return dispatch({ type: ActionTypes.LOGOUT });
}

export const forgotpassword = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.post(url.signup, { payloads: payloads }).then(res => {
    // console.log("res", res.data);
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.status == 200) {
      return res.data;
    } else {
      return res;
    }
  })
}

export const setLanguage = payloads => dispatch => {
  dispatch({ type: ActionTypes.SHOWMODAL, showModal: false });
  return dispatch({ type: ActionTypes.LANGUAGECODE, language: getLanguage(payloads.id), languageId: payloads.id, languageSet: payloads.set });
}

export const getChat = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return Axios.get('http://161.97.122.135:3000/chat', { params: payloads })
    .then(res => {
      dispatch({ type: ActionTypes.LOADING, isLoading: false });
      console.log('Res: ', res.data)
      return res.data;
    }).catch(e => console.log(e))
}

export const getChatList = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return Axios.get('http://161.97.122.135:3000/chatList', { params: payloads })
    .then(res => {
      dispatch({ type: ActionTypes.LOADING, isLoading: false });
      return res.data;
    }).catch(e => console.log('E: ', e))
}

export const getPsychicCategory = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.get(url.psychicCategory).then(res => {
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const getPsychicList = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  console.log(payloads)
  return axios.post(url.psychicList, { payloads: payloads }).then(res => {
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const getHoroscope = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.get(url.horoscope).then(res => {
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const getPackage = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.get(url.package).then(res => {
    dispatch({ type: ActionTypes.LOADING, isLoading: false });
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const newsFeed = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return axios.get(url.newsFeed).then(res => {
    dispatch({ type: ActionTypes.LOADING, isLoading: false })
    if (res.data.status == 'success') {
      return res.data;
    } else {
      return res;
    }
  })
}

export const payment = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true });
  return Axios.post('http://161.97.122.135:3000/payment', { payloads })
    .then(res => {
      if (res.data.status && res.data.status == 'succeeded') {
        return axios.post(url.payment, { payloads: { ...payloads, transaction_id: res.data.balance_transaction } })
          .then(response => {
            return response;
          })
      } else {
        showToast('Error occured. Please try after some time.', 'danger')
      }
    })
}

export const creditUsed = payloads => dispatch => {
  dispatch({ type: ActionTypes.LOADING, isLoading: true })
  return axios.post(url.creditUsed, { payloads: payloads })
    .then(res => {
      dispatch({ type: ActionTypes.LOADING, isLoading: false })
      console.log('creditUsed: ',res.data)
      if(res.data.status == 'success') {
        dispatch({
          type: ActionTypes.SIGNIN,
          data: res.data.data
        })
      }
    })
}