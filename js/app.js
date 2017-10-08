var TaskInput = {
    template: '<div class="form-group"><label>Title:</label>' +
    '<input class="form-control" v-bind:value="value" v-on:keyup.enter="saveValue($event.target.value)"/>' +
    '</div>',
    props: ['value'],
    methods: {
        saveValue: function (value) {
            this.$emit('save', value);
        }
    }
};
var TaskCompleteButton = {
    template: '<button v-on:click="completeTask">' +
    '<span class="glyphicon glyphicon-ok" aria-hidden="true"></span>' +
    '</button>',
    methods: {
        completeTask: function () {
            this.$emit('complete');
        }
    }
};
var TaskDeleteButton = {
    template: '<button v-on:click="deleteTask">' +
    '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>' +
    '</button>',
    methods: {
        deleteTask: function () {
            this.$emit('delete');
        }
    }
};
var TaskEditButton = {
    template: '<button v-on:click="editTask">' +
    '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>' +
    '</button>',
    methods: {
        editTask: function () {
            this.$emit('edit');
        }
    }
};
var TaskItem = {
    components: {
        'task-edit-button': TaskEditButton,
        'task-complete-button': TaskCompleteButton,
        'task-delete-button': TaskDeleteButton
    },
    template: '<li class = "list-group-item" v-bind:class="{disabled : isDone}">{{title}}' +
    '<div class="btn-group pull-right">' +
    '<task-edit-button v-on:edit="editTask"></task-edit-button>' +
    '<task-complete-button v-on:complete="completeTask"></task-complete-button>' +
    '<task-delete-button v-on:delete="deleteTask"></task-delete-button>' +
    '</div>' +
    '</li>',
    props: ['title', 'is_done'],
    data: function () {
        return {
            isDone: this.is_done
        };
    },
    methods: {
        completeTask: function () {
            this.isDone = true;
        },
        deleteTask: function () {
            this.$emit('delete');
        },
        editTask: function () {
            this.$emit('edit');
        }
    }
};
var TaskList = {
    components: {
        'task-item': TaskItem
    },
    props: ['taskTitle'],
    watch: {
        taskTitle: function (newTitle) {
            this.saveTask(newTitle);
        }
    },
    template: '<ul class="list-group">' +
    '<li is="task-item"' +
    'v-for="(task, index ) in tasks"' +
    'v-bind:key="task.id"' +
    'v-bind:title="task.title"' +
    'v-bind:is_done="task.is_done"' +
    'v-on:delete="deleteTask(index)"' +
    'v-on:edit="editTask(index)">' +
    '</li>' +
    '</ul>',
    data: function () {
        return {
            tasks: [
                {id: 1, title: 'list', is_done: true},
                {id: 2, title: 'using components for list', is_done: true},
                {id: 3, title: 'add new', is_done: true},
                {id: 4, title: 'edit existing', is_done: true},
                {id: 5, title: 'delete existing', is_done: true},
                {id: 6, title: 'complete existing', is_done: true},
                {id: 7, title: 'using components for form', is_done: false},
                {id: 8, title: 'sort', is_done: false},
                {id: 9, title: 'filter', is_done: false},
                {id: 10, title: 'paging', is_done: false}
            ],
            nextId: 11,
            editId: null
        }
    },
    methods: {
        deleteTask: function (index) {
            this.tasks.splice(index, 1);
        },
        editTask: function (index) {
            this.editId = index;
            this.$emit('edit', this.tasks[index].title);
        },
        saveTask: function (newTitle) {
            if (this.editId === null) {
                this.tasks.push({
                    id: this.nextId++,
                    title: newTitle,
                    is_done: false
                });
            } else if (this.tasks[this.editId].title === newTitle) {
                //title doesn't change yet
            } else {
                this.tasks[this.editId].title = newTitle;
                this.editId = null;
            }
        }
    }
};

var taskApp = new Vue({
    el: '#taskList',
    template: '<div class="container"><div class="row">' +
    '<task-input v-on:save="setInputValue" v-model="inputValue"></task-input>' +
    '<task-list v-on:edit="setInputValue" v-bind:task-title="inputValue"></task-list>' +
    '</div></div>',
    components: {
        'task-input': TaskInput,
        'task-list': TaskList
    },
    data: {
        inputValue: ''
    },
    methods: {
        setInputValue: function (taskTitle) {
            this.inputValue = taskTitle;
        }
    }
});