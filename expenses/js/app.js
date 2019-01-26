var app = new Vue({
    el: '#app',
    data: {
        filter: {
            date: null,
            type: null,
            contractor: null
        },
        types: [],
        dates: [],
        contractors: [],
        records: [],
        allRecords: [],
        newRecord: {
            date: null,
            type: null,
            contractor: null,
            details: null,
            sum: null
        },
        chart: {
            height: 400,
            width: 910,
            yOffset: {bottom: 20, top: 5},
            xOffset: {left: 20, top: 10},
            xAxis: {
                x1: 50,
                x2: 50,
                y1: 5,
                y2: 380,
                textLabel: {
                    x: 400,
                    y: 390
                }
            },
            yAxis: {
                x1: 50,
                x2: 900,
                y1: 380,
                y2: 380,
                textLabel: {
                    x: 10,
                    y: 200
                }
            }
        },
        showMode: 'TABLE'
    },
    watch: {
        filter: {
            handler: function (newValue, oldValue) {
                this.records = this.allRecords.filter(function (record) {
                    for (var parameter in newValue) {
                        if (newValue[parameter] !== null && newValue[parameter] !== "null" && record.hasOwnProperty(parameter) && record[parameter] !== newValue[parameter]) {
                            return false;
                        }
                    }
                    return true;
                });
            },
            deep: true
        }
    },
    computed: {
        dynamicChart: function () {
            var x = 0;
            var xRatio = 10;
            var yRatio = 10;
            var yPoints = [];
            var maxY = 0;
            var points = [];
            var polylinePoints = "";
            var command = "";
            var path = "";
            var xAxis = [];
            var yAxis = [];
            if (this.records.length > 0) {
                xRatio = Math.round(this.chart.width / this.records.length);
                yPoints = this.records.filter(function (record) {
                    return record.type === 'expense';
                }).map(function (record) {
                    return record.sum;
                });
                maxY = Math.max.apply(null, yPoints);
                yRatio = this.chart.height / maxY;
                console.log(yPoints, maxY, xRatio, yRatio);
                points = yPoints.map(function (point) {
                    x++;
                    return {x: x * xRatio, y: point * yRatio};
                });
                points.map(function (point, index) {
                   command = index === 0 ? 'M' : 'L';
                    path = path + " " + command + " " + point.x + "," + point.y;
                });
                polylinePoints = points.map(function (point) {
                    return point.x + ',' + point.y;
                }).join(" ");
                x = 0;
                xAxis = this.records.filter(function (record) {
                    return record.type === 'expense';
                }).map(function (record) {
                    x++;
                    return {x: x * xRatio, y: 390, text: record.date};
                });
                for (var i = this.chart.height; i > 0; i -= 40) {
                    yAxis.push({x: 50, y: i, text: this.chart.height - i});
                }
            }
            return {path: path, points: points, polyline: polylinePoints, xAxisTexts: xAxis, yAxisTexts: yAxis};
        }
    },
    mounted: function () {
        var self = this;
        axios.get('data.json').then(function (response) {
            self.records = response.data.records;
            self.allRecords = response.data.records;
            response.data.records.forEach(function (record) {
                if (self.types.indexOf(record.type) === -1) {
                    self.types.push(record.type);
                }
            });
            response.data.records.forEach(function (record) {
                if (self.dates.indexOf(record.date) === -1) {
                    self.dates.push(record.date);
                }
            });
            response.data.records.forEach(function (record) {
                if (self.contractors.indexOf(record.contractor) === -1) {
                    self.contractors.push(record.contractor);
                }
            });
        });
    },
    methods: {
        addNewRecord: function (e) {
            this.records.push({
                date: this.newRecord.date,
                type: this.newRecord.type,
                contractor: this.newRecord.contractor,
                details: this.newRecord.details,
                sum: this.newRecord.sum,
            });
            this.newRecord.date = null;
            this.newRecord.type = null;
            this.newRecord.contractor = null;
            this.newRecord.details = null;
            this.newRecord.sum = null;
            e.preventDefault();
        },
        setMode: function (mode) {
            this.showMode = mode;
        }
    }
});