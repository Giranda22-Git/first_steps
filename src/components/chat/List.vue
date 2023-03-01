<template>
  <div class="wrapper">
    <div class="searchWrapper">
      <input type="text" placeholder="Поиск...">
      <img v-on:click="createChatButtonHandler" src="../../assets/addChatButton.svg">
    </div>
    <div class="list">
      <div class="element"
        v-for="chat in availableChats"
        v-bind:key="chat._id"
        @click="choose_chat_button_handler(chat._id)"
      >
        <div class="leftContentWrapper">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl20U-Cn3Bd2KqDtcRya79hyXIH_hRO7T1_w&usqp=CAU">
        </div>
        <div class="rightContentWrapper">
          <div class="title">
            {{ chat.label }}
          </div>
          <div class="lastMessage">
            <div class="from">
              {{ chat.history.at(-1).from }}: &nbsp;
            </div>
            <div class="text">
              {{ chat.history.at(-1).text.slice(0, 17) }}...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import EventBus from '@/EventBus'

export default {
  name: 'chatList',
  components: {
  },
  props: {
    login: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    serverUrl: 'http://195.49.210.34/',
    availableChats: []
  }),
  async mounted () {
    EventBus.$on('userDataReady', async (user) => {
      // setInterval(async () => await this.update_chat_list(user.login), 1000)
      await this.update_chat_list(user.login)
      EventBus.$on('newChat', async (chat_data) => {
        await this.update_chat_list(user.login)
      })
    })

    // setTimeout(async () => {
    //   console.log(this.login)
    //   const response = await this.sendRequest(`chat/user/${this.login}`, 'GET')

    //   console.log({response})

    //   this.availableChats = response.payload

    //   console.log(this.availableChats)
    // }, 1000)
  },
  methods: {
    update_chat_list: async function (login) {
      const response = await this.sendRequest(`chat/user/${login}`, 'GET')

      this.availableChats = response.payload
    },
    createChatButtonHandler: function () {
      this.$emit('openModalCreateChat')
    },
    sendRequest: async function (path, method, body) {
      const url = `${this.serverUrl}${path}`

      // method = method.toLowerCase()
      // return (await axios[method](url, body)).data

      if (method === 'GET') {
        return (await axios.get(url)).data
      } else {
        return (await axios.post(url, body)).data
      }
    },
    choose_chat_button_handler: function (chat_id) {
      this.$emit('choose_chat', chat_id)
      EventBus.$emit('updateScroll')
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    border: 1px solid rgba(37, 47, 37, 1);
    display: flex;
    flex-direction: column;
    .searchWrapper {
      width: 100%;
      height: 10%;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      padding: 7px;
      input {
        width: 60%;
        outline: none;
        border: 1px solid rgba(37, 47, 37, 1);
        border-radius: 10px;
        padding: 8px 16px;
      }
      img {
        width: 12%;
        cursor: pointer;
      }
    }
    .list {
      width: 100%;
      height: 90%;
      overflow-y: auto;
      .element {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        border-bottom: 1px solid rgba(37, 47, 37, 1);
        cursor: pointer;
        &:hover {
          background-color: rgba(37, 47, 37, .2);
        }
        .leftContentWrapper {
          width: 25%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.25% 2.5%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .rightContentWrapper {
          width: 75%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          padding: 7px;
          .title {
            width: 100%;
            height: 35%;
            text-align: left;
          }
          .lastMessage {
            width: 100%;
            height: 50%;
            display: flex;
          }
        }
      }
    }
  }
</style>