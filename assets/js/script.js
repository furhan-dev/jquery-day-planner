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
        let rowEl = $('<tr>').addClass('row time-block');
        // create hour td
        let hourTdEl = $('<td>').addClass('hour col-2 col-md-1').text(currentHour.format('hA'));

        // create desc container td with a data-time attribute to be set to the currentHour in unix time
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
        let descEl = $('<textarea>').addClass('description').attr('data-time', currentHour.format('YYYY-MM-DD HH'));
        // set the description if previously saved
        const desc = localStorage.getItem(currentHour.format('YYYY-MM-DD HH'));
        if (desc != null) {
            descEl.text(desc);
        }

        descTdEl.append(descEl);
        // create save button td
        let saveTdEl = $('<td>').addClass('col-2 col-md-1 p-0');
        let saveButtonEl = $('<button>').addClass('saveBtn').text('Save');
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

    // use event delegation on entire table to listen for click on save button
    scheduleTableEl.on('click', '.saveBtn', handleSaveButton);

    // append table to containe 
    scheduleContainerEl.append(scheduleTableEl);
}

function handleSaveButton(event) {
    event.preventDefault();
    const buttonClicked = $(event.target);

    // get description by first getting parent td, it's prev sibling, and finding child description
    const descEl = buttonClicked.parent().prev().children('.description');
    console.log('desc: ' + descEl.val());
    console.log('desc: ' + descEl.attr('data-time'));
    localStorage.setItem(descEl.attr('data-time'), descEl.val().trim());

}

init();
