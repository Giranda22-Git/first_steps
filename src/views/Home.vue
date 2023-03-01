<template>
  <div class="wrapper">
    <ChatList :login="user.login" @choose_chat="choose_chat" @openModalCreateChat="switchModalCreateChat(true)" class="chatList"/>
    <ViewChat :login="user.login" :chat="currentChat" class="View"/>
    <div @click="switchModalCreateChat(false)" class="createChatModalWrapper" v-if="createChatIsOpen"></div>
    <ChatCreate class="createChat" v-if="createChatIsOpen"/>
  </div>
</template>

<script>
import ChatList from '@/components/chat/List.vue'
import ChatCreate from '@/components/chat/Create.vue'
import ViewChat from '@/components/chat/View.vue'
import EventBus from '@/EventBus.js'

import axios from 'axios'
export default {
  name: 'Home',
  data: () => ({
    serverUrl: 'http://195.49.210.34/',
    createChatIsOpen: false,
    user: {},
    currentChat: {},
    intervalId: '',
    webSocket: null
  }),
  components: {
    ChatList,
    ChatCreate,
    ViewChat
  },
  computed: {
  },
  methods: {
    switchModalCreateChat: function (updt) {
      this.createChatIsOpen = updt
    },
    choose_chat: async function (chat_id) {
      // if (this.intervalId) {
      //   clearInterval(this.intervalId)
      // }
      this.currentChat = (await this.sendRequest(`chat/${chat_id}`, 'GET')).payload[0]
      // this.intervalId = setInterval(() => this.update_chat_data(chat_id), 1000)
    },
    update_chat_data: async function (chat_id) {
      const oldChatHistory = this.currentChat.history
      this.currentChat = (await this.sendRequest(`chat/${chat_id}`, 'GET')).payload[0]
      // this.currentChat.history

      if (oldChatHistory.length < this.currentChat.history.length) {
        this.notifyMe(this.currentChat.history.at(-1)?.text)
      }
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
    notifyMe: function (text) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notification")
      }
      else if (Notification.permission === "granted") {
        const notification = new Notification(text)
      }
      else if (Notification.permission !== "denied") {
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              const notification = new Notification(text)
            }
          })
      }
    },
    connect: async function () {
      this.webSocket = new WebSocket(`ws://195.49.210.34/ws?login=${this.user.login}`)

      this.webSocket.onopen = async (event) => {
        this.webSocket.onmessage = async (msg) => {
          const serverData = JSON.parse(msg.data)
          if (serverData.type === 'newMessage') {
            this.update_chat_data(serverData.payload.chatId)
            EventBus.$emit('updateScroll')
          }
          else if (serverData.type === 'newChat') {
            EventBus.$emit('newChat', serverData.payload)
          }
          console.log({serverData})
        }
      }

      this.webSocket.onclose = async () => {
        console.log('ws reconnect in progress')
        await this.connect()
        console.log('ws reconnected')
      }

      this.webSocket.onerror = async (error) => {
        console.log('ws Error: попытка переподключиться')
        await this.connect()
      }
    }
  },
  async mounted () {
    this.$route.params.id
    this.user = (await this.sendRequest(`user/${this.$route.params.id}`, 'GET')).payload[0]

    EventBus.$emit('userDataReady', this.user)

    EventBus.$on('messageFromMe', (messageData) => {
      this.currentChat.history.push(messageData)
    })

    await this.connect()
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    .createChatModalWrapper {
      width: 100vw;
      height: 100vh;
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 0;
      left: 0;
      background-color: gray;
      opacity: .6;
    }
    .createChat {
      width: 50vw;
      height: 50vh;
      position: fixed;
      left: calc(50% - 25vw);
      top: calc(50% - 25vh);
      display: flex;
    }
    .chatList {
      width: 20%;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
    }
    .View {
      width: 80%;
    }
  }
</style>