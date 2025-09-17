class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards()]);
  }

  _handleServerResponse(res) {
    return res.text().then(text => {
      let data;
      try { data = text ? JSON.parse(text) : {}; } catch (e) { data = text; }
      if (res.ok) return data;
      return Promise.reject(new Error(`HTTP ${res.status} ${res.statusText} - ${typeof data === 'object' ? JSON.stringify(data) : data}`));
    });
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
        headers: this._headers,
    }).then(this._handleServerResponse);
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    }).then(this._handleServerResponse);
  }
  setUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    }).then(this._handleServerResponse);
  }

  setUserAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({ avatar })
    }).then(this._handleServerResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Error: ${res.status}`);
    });
  }

  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._handleServerResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    if (!cardId) return Promise.reject(new Error('Missing cardId'));
    const id = String(cardId).trim();
    const url = `${this._baseUrl}/cards/${id}/likes`; // correct URL
    return fetch(url, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._headers,
    }).then(this._handleServerResponse.bind(this));
  }

}

export default Api;