<template>
    <div id="app">
        <task-form></task-form>
        <b>{{tasksCount}}</b>
        <ul class="tasks">
            <li v-for="task in validTasks" v-bind:key="task.id">{{task.title}}</li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {mapActions} from 'vuex'
    import TaskForm from './components/TaskForm'

    export default {
        name: 'app',
        components: {TaskForm},
        computed: mapGetters(['validTasks', 'tasksCount']),
        methods: mapActions(['fetchTasks']),
        async mounted() {
            this.fetchTasks(7)
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
