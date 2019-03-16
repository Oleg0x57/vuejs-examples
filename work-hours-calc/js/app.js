var app = new Vue({
    el: '#app',
    data: {
        startDate: '',
        endDate: '',
        shortenedWorkingDays: '',
        missedDays: ''
    },
    computed: {
        hours: function () {
            var result = 0;
            for (var i = new Date(this.startDate); i <= new Date(this.endDate); i.setDate(i.getDate() + 1)) {
                if (i.getDay() !== 0 && i.getDay() !== 1) {
                    result += 8;
                }
            }
            result -= 8 * this.missedDays;
            result -= this.shortenedWorkingDays;
            return result;
        }
    }
});