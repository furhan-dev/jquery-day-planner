const scheduleContainerEl = $('.container');
var scheduleTableEl;

function init() {
    // build initial work day schedule
    createSchedule();
}

function createSchedule() {

    // set the number of hours in a work day (8 + 1 hour for lunch)
    const workHours = 9;
    // create a variable to keep track of current hour in for loop
    let currentHour = moment("09:00", "hh:mm");
    // create a table to append each hour row into 
    scheduleTableEl = $('<table>').addClass('table');

    // loop to create a row for each work hour
    for (let i = 0; i < workHours; i++) {
        // create a row
        let rowEl = $('<tr>').addClass('row');
        // create hour td
        let hourTdEl = $('<td>').addClass('hour col-2 col-md-1 pe-1').text(currentHour.format('hA'));
        // create desc container td
        let descTdEl = $('<td>').addClass('col-8 col-md-10 p-0');
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
