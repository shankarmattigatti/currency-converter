const API_PATH = 'https://free.currencyconverterapi.com/api/v6/convert?q=';
var currID = new String(),
    lineChart = false,
    fromDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
    toDate = moment().format('YYYY-MM-DD'),
    dateArray = getDates(new Date(fromDate), new Date(toDate));

function getCurrencyInfo() {
    currID = $("#CURR_FR").val() + '_' + $("#CURR_TO").val();

    $.ajax({
        type: 'GET',
        url: API_PATH + currID +'&compact=ultra&date=' + fromDate + '&endDate=' + toDate,
        contentType: 'application/json, charset=utf-8',
        datatype: 'jsondata',
        async: 'false',
        success: function (response) {
            populateIntoCurrencyInfoDetails(response);
        },
        error: function (response) {
            alert(response);
        }
    });
}

function populateIntoCurrencyInfoDetails(response) {
    var data = [],
        value = $("#amount").val() * response[currID][toDate];

    for (let index = 0; index < dateArray.length; index++) {
        data.push(response[currID][dateArray[index]]);
    }
    $("#value").val(value.toFixed(2));

    if(lineChart)
        lineChart.destroy();

    lineChart = new Chart($('#line-chart'), {
        type: 'line',
        data: {
            labels: dateArray,
            datasets: [{
                data: data,
                label: $("#CURR_TO").val(),
                borderColor: '#3e95cd',
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Last 7 Days of Currency'
            }
        }
    });
}

// Function returns an array of dates between the two dates
function getDates(startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(moment(currentDate).format("YYYY-MM-DD"));
        currentDate = addDays.call(currentDate, 1);
    }
    return dates;
}