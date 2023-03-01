<template>
  <div class="wrapper">
    <input v-model="regData.login" type="text" placeholder="Login" class="login">
    <input v-model="regData.password" type="text" placeholder="Password" class="password">
    <input v-model="regData.tryPassword" type="text" placeholder="try password" class="tryPassword">
    <button class="approve" v-on:click="registrationClickHandler">Зарегистрироваться</button>
  </div>
</template>

<script>
export default {
  name: 'Reg',
  data: () => ({
    serverUrl: 'http://195.49.210.34/',
    regData: {
      login: '',
      password: '',
      tryPassword: ''
    }
  }),
  methods: {
    registrationClickHandler: async function () {
      if (!this.regData.login || !this.regData.password || !this.regData.tryPassword) return alert('Поля не заполнены')

      const request_body = {
        userData: {
          login: this.regData.login,
          password: this.regData.password,
          tryPassword: this.regData.tryPassword
        }
      }

      const response = await this.sendRequest('user/registration', 'POST', request_body)

      if (response.info.status === 'OK') {
        this.$router.push({ name: 'Home', params: {id: response.payload._id} })
      }
      else {
        alert(response.payload)
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
    // sendRequest: function (path, method, body) {
    //   const request_config = {
    //     method,
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8'
    //     },
    //     body: null
    //   }

    //   if (method !== 'GET') request_config.body = JSON.stringify(body)
    //   console.log(JSON.stringify(body))

    //   fetch (`${this.serverUrl}${path}`, request_config)
    //     .then (response => {
    //        response.json()
    //         .then(jsonRes => {
    //           this.response = jsonRes
    //         })
    //         .catch (error => {
    //           console.log({error})
    //         })
    //     })
    //     .catch (error => {
    //       console.log({error})
    //     })
    // }
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