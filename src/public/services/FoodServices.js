const axios = require('axios');
const app = axios();

export default class FoodServices {
  static _withBaseUrl = (path) => {
    return `https://pwn-msba.herokuapp.com/${path}`;
  };

  login({ username, password }) {
    console.log('entrou');
    return axios.post(FoodServices._withBaseUrl('seguranca/login'), {
      data: {
        usuario: username,
        senha: password,
      },
    });
  }
}
