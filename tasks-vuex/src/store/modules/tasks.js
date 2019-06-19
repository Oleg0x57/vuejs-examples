export default {
    actions: {
        async fetchTasks(ctx, limit = '5') {
            const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=' + limit)
            const tasks = await res.json()
            ctx.commit('updateTasks', tasks)
        }
    },
    mutations: {
        updateTasks(state, tasks) {
            state.tasks = tasks
        },
        createTask(state, task) {
            state.tasks.unshift(task)
        }
    },
    state: {
        tasks: []
    },
    getters: {
        validTasks(state) {
            return state.tasks.filter(t => {
                return t.title
            })
        },
        getTasks(state) {
            return state.tasks;
        },
        tasksCount(state, getters) {
            return getters.validTasks.length
        }
    }
}