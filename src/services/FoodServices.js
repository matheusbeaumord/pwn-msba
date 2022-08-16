import axios from 'axios';

export class FoodServices {
  static _withBaseUrl = (path) => {
    return `https://pwn-msba.herokuapp.com/${path}`;
  };

  static getFoodList() {
    return axios.get(_withBaseUrl('food'));
  }
}
