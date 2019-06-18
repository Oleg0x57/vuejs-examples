<template>
  <div id="app">
    <ul class="tasks">
      <li v-for="task in tasks" v-bind:key="task.id">{{task.title}}</li>
    </ul>
  </div>
</template>

<script>


export default {
  name: 'app',
  data(){
    return {
      tasks: []
    }
  },
  async mounted(){
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
    const tasks = await res.json()
    this.tasks = tasks
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
