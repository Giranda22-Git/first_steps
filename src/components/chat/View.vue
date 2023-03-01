<template>
  <div class="wrapper">
    <div class="messageList" id="messageList" v-chat-scroll="{always: false, smooth: true, scrollonremoved:true, smoothonremoved: false}">
      <div
        v-for="message in chat.history"
        :class="{messageWrapper: true, fromMe: login === message.from, notFromMe: login !== message.from}"
        :key="message.id"
      >
        <div class="from">
          {{message.from}}
        </div>
        <div class="text">
          {{ message.text  }}
        </div>
        <div class="timestamp">
          {{ formatDate(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '@/EventBus';
export default {
  name: 'View.vue',
  data: () => ({

  }),
  props: {
    chat: {
      type: Object,
      default: {
        history: []
      }
    },
    login: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateScroll: function () {
      const messageList = document.querySelector('#messageList')
      if (messageList.scrollYOffset < messageList.scrollHeight) {
        console.log({messageList})
        messageList.scrollTo(0, messageList.scrollHeight);
      }
    },
    formatDate: function (timestamp) {
      const date = new Date(timestamp)
      const hours = String(date.getHours())
      const minutes = String(date.getMinutes())
      const handled_hours = hours.length < 2 ? '0' + hours : hours
      const handled_minutes = minutes.length < 2 ? '0' + minutes : minutes
      return `${handled_hours}:${handled_minutes}`
    }
  },
  async mounted () {
    setInterval(() => this.updateScroll(), 1000)
    // EventBus.$on('updateScroll', () => {
    //   this.updateScroll()
    // })
  }
}
</script>

<style lang="less" scoped>
  * {
    border: 1px solid red;
  }
  .wrapper {
    width: 80%;
    height: 90%;
    overflow-y: auto;
    .messageList {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      .messageWrapper {
        max-width: 60%;
        height: auto;
        min-height: 40px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        padding: 20px;
        margin-bottom: 20px;
        * {
          width: 100%;
        }
        .text {
          font-size: 1em;
        }
        .from {
          font-size: 1.1em;
          text-align: left;
        }
        .timestamp {
          font-size: .9em;
          color: rgba(120, 113, 113, 0.9);
          text-align: right;
        }
      }
      .fromMe {
        background-color: rgba(50, 192, 50, .8);
        text-align: right;
        align-self: flex-end;
      }
      .notFromMe {
        background-color: #c9c9c9;
        text-align: left;
        align-self: flex-start;
      }
    }
  }
</style>