const scheduleContainerEl = $('.container');
var rightNow;
var scheduleTableEl;

function init() {
    // set current date/time
    rightNow = moment();
    $('#currentDay').text(rightNow.format('dddd, MMMM Do'));
    // build initial work day schedule
    createSchedule();
}

function createSchedule() {

    // set the number of hours in a work day (8 + 1 hour for lunch)
    const workHours = 9;
    // create a variable to keep track of current hour in for loop
    let currentHour = moment().set('hour', 9);
    // create a table to append each hour row into 
    scheduleTableEl = $('<table>').addClass('table');
    // loop over all work hours and add row
    for (let i = 0; i < workHours; i++) {
        // create a row
        let rowEl = $('<tr>').addClass('row');
        // create hour td
        let hourTdEl = $('<td>').addClass('hour col-2 col-md-1').text(currentHour.format('hA'));

        // create desc container td
        let descTdEl = $('<td>').addClass('col-8 col-md-10 p-0');
        // color background based on current hour
        if (currentHour.isBefore(rightNow, 'hour')) {
            descTdEl.addClass('past');
        } else if (currentHour.isAfter(rightNow, 'hour')) {
            descTdEl.addClass('future');
        } else {
            descTdEl.addClass('present');
        }

        // create desc text area element
        let descEL = $('<textarea>').addClass('description');
        descTdEl.append(descEL);
        // create save button td
        let saveTdEl = $('<td>').addClass('col-2 col-md-1 p-0');
        saveButtonEl = $('<button>').addClass('saveBtn').text('Save');
        saveTdEl.append(saveButtonEl);

        // append all td elements to row
        rowEl.append(
            hourTdEl,
            descTdEl,
            saveTdEl);
        
        // append row to table
        scheduleTableEl.append(rowEl);

        // increment hour
        currentHour.add(1, "hours");
    }

    // append table to containe 
    scheduleContainerEl.append(scheduleTableEl);
}

init();
