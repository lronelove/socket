<template>
  <div class="main">
    <h1>hello world</h1>
    <button @click="send">send</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  sockets: {
    connect () {
      console.log('socket connected')
    },
    message (val) {
      console.log(val)
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    send () {
       this.$socket.emit('message', {
        to: 'lronelove',
        from: 'jack',
        msg: 'hello , I am lronelove ,jack , can you hear me ?'
      })
      console.log('lronelove send to jack')
    }
  },
  created () {
	 this.$socket.emit('join', 'jack')
     console.log('jack join')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
