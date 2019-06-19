<template>
    <form @submit.prevent="submit">
        <input v-model="title" type="text">
        <button type="submit">Save</button>
    </form>
</template>

<script>
    import {mapMutations} from 'vuex'

    export default {
        name: "TaskForm",
        data() {
            return {
                title: ''
            }
        },
        methods: {
            ...mapMutations(['createTask']),
            submit() {
                this.createTask({
                    title: this.title,
                    id: Date.now()
                })
                this.title = ""
            }
        }
    }
</script>

<style scoped>

</style>