<template>
  <div class="wrapper">
    <input v-model="authData.login" type="text" placeholder="Login" class="login">
    <input v-model="authData.password" type="text" placeholder="Password" class="password">
    <button class="approve" v-on:click="buttonClickHandler">Войти</button>
  </div>
</template>

<script>
export default {
  name: 'Reg',
  data: () => ({
    serverUrl: 'http://195.49.210.34/',
    authData: {
      login: '',
      password: ''
    }
  }),
  methods: {
    buttonClickHandler: async function () {
      if (!this.authData.login || !this.authData.password) return alert('Поля не заполнены')

      const request_body = {
        userData: {
          login: this.authData.login,
          password: this.authData.password
        }
      }

      const response = await this.sendRequest('user/authorization', 'POST', request_body)

      if (response.info.status === 'OK' && response.payload.isAuth) {
        this.$router.push({ name: 'Home', params: {id: response.payload.userData[0]._id} })
      } else {
        alert('Логин или пароль не правильные')
      }

      console.log({response})
    },
    sendRequest: async function (path, method, body) {
      const url = `${this.serverUrl}${path}`
      const request_config = {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: null
      }

      if (method !== 'GET') request_config.body = JSON.stringify(body)

      const response = await fetch (url, request_config)

      return await response.json()
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    border: 1px solid gray;
    border-radius: 8px;
    padding: 15px;
    input {
      width: 80%;
      padding: 8px 16px;
      outline: none;
      border: 1px solid rgba(140, 145, 150, .6);
      border-radius: 3px;
      &:hover {
        border: 1px solid rgba(140, 145, 150, 1);
      }
    }
  }
</style>