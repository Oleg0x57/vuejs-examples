var ExpensesChart = {
    template: '',
    props: [],
    data: function () {
        return [];
    },
    methods: {}
};

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
        showMode: 'CHART',
        chart: {
            height: 400,
            width: 910,
            offsetLeft: 10,
            offsetBottom: 10,
            offsetRight: 10,
            offsetTop: 10,
            xLabel: 'Time',
            yLabel: 'Expenses'
        }
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
            var expensesGroupedByMonth = [], maxY = 0, svgNs = "http://www.w3.org/2000/svg",
                svgRoot = document.getElementById("chart"), sandBoxG = null, sandBoxText = null,
                sandBoxTextLabel = null, pointOfOrigin = {x: null, y: null}, xTextOffsetBottom = null,
                yTextOffsetLeft = null, xTexts = [], yTexts = [], x = 0, xRatio = 10, yRatio = 10, points = [],
                command = "", path = "", i = 0;
            if (this.records.length > 0) {
                maxY = this.records.filter(function (record) {
                    return record.type === 'expense';
                }).reduce(function (prev, record) {
                    if (!prev.length) {
                        prev.push({x: record.date, y: record.sum});
                    } else {
                        if (prev[prev.length - 1].x === record.date) {
                            prev[prev.length - 1].y += record.sum;
                        } else {
                            prev.push({x: record.date, y: record.sum});
                        }
                    }
                    return prev;
                }, expensesGroupedByMonth).reduce(function (max, curr) {
                    return (max > curr.y) ? max : curr.y;
                }, maxY);
                sandBoxG = document.createElementNS(svgNs, "g");
                svgRoot.appendChild(sandBoxG);
                sandBoxTextLabel = document.createElementNS(svgNs, "text");
                sandBoxTextLabel.setAttributeNS(null, "x", this.chart.offsetLeft);
                sandBoxTextLabel.setAttributeNS(null, "y", "10");
                sandBoxTextLabel.innerHTML = this.chart.yLabel;
                sandBoxG.appendChild(sandBoxTextLabel);
                yTextOffsetLeft = Math.ceil(sandBoxG.getBBox().width);
                sandBoxText = document.createElementNS(svgNs, "text");
                sandBoxText.setAttributeNS(null, "x", this.chart.offsetLeft + yTextOffsetLeft);
                sandBoxText.setAttributeNS(null, "y", "10");
                sandBoxText.innerHTML = maxY;
                sandBoxG.appendChild(sandBoxText);
                pointOfOrigin.x = Math.ceil(sandBoxG.getBBox().width);
                while (sandBoxG.firstChild) {
                    sandBoxG.removeChild(sandBoxG.firstChild);
                }
                sandBoxTextLabel = document.createElementNS(svgNs, "text");
                sandBoxTextLabel.setAttributeNS(null, "y", this.chart.offsetBottom);
                sandBoxTextLabel.setAttributeNS(null, "x", "0");
                sandBoxTextLabel.innerHTML = this.chart.xLabel;
                sandBoxG.appendChild(sandBoxTextLabel);
                xTextOffsetBottom = Math.ceil(sandBoxG.getBBox().height);
                sandBoxText = document.createElementNS(svgNs, "text");
                sandBoxText.setAttributeNS(null, "y", this.chart.offsetBottom + xTextOffsetBottom);
                sandBoxText.setAttributeNS(null, "x", "0");
                sandBoxText.innerHTML = maxY;
                sandBoxG.appendChild(sandBoxText);
                pointOfOrigin.y = this.chart.height - Math.ceil(sandBoxG.getBBox().height);
                while (sandBoxG.firstChild) {
                    sandBoxG.removeChild(sandBoxG.firstChild);
                }
                yRatio = (pointOfOrigin.y - this.chart.offsetTop) / maxY;
                xRatio = Math.round((this.chart.width - this.chart.offsetRight - pointOfOrigin.x) / expensesGroupedByMonth.length);
                points = expensesGroupedByMonth.map(function (point) {
                    command = command === '' ? 'M' : 'L';
                    path = path + " " + command + " " + (x * xRatio + pointOfOrigin.x) + "," + (pointOfOrigin.y - point.y * yRatio);
                    xTexts.push({
                        x: (x * xRatio + pointOfOrigin.x),
                        y: (pointOfOrigin.y + xTextOffsetBottom),
                        text: point.x
                    });
                    return {x: (x++ * xRatio + pointOfOrigin.x), y: (pointOfOrigin.y - point.y * yRatio)};
                });

                for (i = maxY; i > 0; i -= 60 / yRatio) {
                    yTexts.push({x: yTextOffsetLeft, y: Math.round(i * yRatio), text: Math.round(maxY - i)});
                }
            }
            return {
                path: path,
                points: points,
                xAxisTexts: xTexts,
                yAxisTexts: yTexts,
                yAxis: {
                    x1: pointOfOrigin.x,
                    x2: pointOfOrigin.x,
                    y1: this.chart.offsetTop,
                    y2: pointOfOrigin.y,
                },
                xAxis: {
                    x1: pointOfOrigin.x,
                    x2: this.chart.width - this.chart.offsetRight,
                    y1: pointOfOrigin.y,
                    y2: pointOfOrigin.y,
                },
                yTextLabel: {
                    x: this.chart.offsetLeft, y: this.chart.height / 2, text: this.chart.yLabel
                },
                xTextLabel: {
                    x: this.chart.width / 2, y: this.chart.height - this.chart.offsetBottom, text: this.chart.xLabel
                }
            };
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