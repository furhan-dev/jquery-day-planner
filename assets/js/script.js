const scheduleContainerEl = $('.container');
var rightNow;
var scheduleTableEl;

/**
 * Init function called when script is loaded
 */
function init() {
    // set current date/time
    rightNow = moment();
    $('#currentDay').text(rightNow.format('dddd, MMMM Do'));
    // build initial work day schedule
    renderSchedule();
    // initialize all popovers
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        let popover = new bootstrap.Popover(popoverTriggerEl, 
            { 
                container: 'body',
                html: true,
                sanitize: false,
                // content: $('#popover-content')[0].innerHTML

            })
        return popover;
    });

    // add event handlers
    scheduleTableEl.on('click', '.description', handleScheduleClick);
    $('body').on('click', '.save-event', handleSaveEvent)

    console.log("popover length " + $('.popover-content').length)
}

/**
 * Renders schedule and color time blocks based on time of day
 */
function renderSchedule() {
    // set the number of hours in a work day (8 + 1 hour for lunch)
    const workHours = 9;
    // create a variable to keep track of current hour in for loop
    const currentHour = moment().set('hour', 9);
    // create a table to append each hour row into 
    scheduleTableEl = $('<table>').addClass('table');
    // loop over all work hours and add row
    for (let i = 0; i < workHours; i++) {
        // create a row
        const rowEl = $('<tr>').addClass('row');
        // create hour td
        const hourTdEl = $('<td>').addClass('hour col-2 col-md-1').text(currentHour.format('h A'));

        // create desc container td with a data-time attribute to be set to the currentHour in unix time
        const descTdEl = $('<td>').addClass('col-9 col-md-10 p-0');
        // color background based on current hour
        if (currentHour.isBefore(rightNow, 'hour')) {
            descTdEl.addClass('past');
        } else if (currentHour.isAfter(rightNow, 'hour')) {
            descTdEl.addClass('future');
        } else {
            descTdEl.addClass('present');
        }   

        // create desc text area element
        const descButtonEl = $('<button>')
            .addClass('btn description')
            .attr('data-bs-toggle', 'popover')
            .attr('data-time', currentHour.format('YYYY-MM-DD HH'))
            // .attr('data-bs-content-id', 'popover-content')
            .attr('title', "<p class='text-center my-1'>Create New Event</p>") 
            .attr('data-bs-content', createPopoverContent(currentHour, ""));
        // set the description if previously saved
        const desc = localStorage.getItem(currentHour.format('YYYY-MM-DD HH'));
        if (desc != null) {
            // const descParsedEl = $.parseHTML(JSON.parse(desc));
            descButtonEl.attr('title', "<p class='text-center my-1'>" + currentHour.format('h A') + " Event</p>") 
            // let popoverContent = createPopoverContent(currentHour, descParsedEl[0].innerText); 
            let popoverContent = createPopoverContent(currentHour, desc); 
            descButtonEl.attr('data-bs-content', popoverContent);
            // descButtonEl.append(JSON.parse(desc));
            const eventDivEl = $('<div>').addClass('event d-flex');
            descButtonEl.append(eventDivEl.text(desc));
        }
        descTdEl.append(descButtonEl);

        // append all td elements to row
        rowEl.append(
            hourTdEl,
            descTdEl);
        
        // append row to table
        scheduleTableEl.append(rowEl);

        // increment hour
        currentHour.add(1, "hours");
    }

    // append table to containe 
    scheduleContainerEl.append(scheduleTableEl);
}

// need to create popover on the div that i create inside the hour button
// need to check if div already exists, if so edit, otherwise create new
// update div popover title based on if event already exists

// prevent popover dismissal
// double click to create new event or edit existing one
// single click to focus event

function handleSaveEvent(event) {
    event.preventDefault();
    const textAreaEl = $(this).parent().prev();
    localStorage.setItem(textAreaEl.attr('data-time'), textAreaEl.val());
    // reset text area in popover to be empty
    textAreaEl.val('');
}

/**
 * Handler for clicking on the schedule
 * @param {object} event click event
 */
function handleScheduleClick(event) {
    event.preventDefault();
    // hide all other popoevers
    $("button[data-bs-toggle='popover']").not(this).popover('hide');

    // add event div if it doesn't exist already
    let eventDivEl = $('<div>').addClass('event d-flex');
    if ($(this).children().length === 0) {
        $(this).append(eventDivEl);
    }
    
    // const buttonClicked = $(event.target);

    // get description by first getting parent td, it's prev sibling, and finding child description
    // const descEl = $(this).parent().prev().children('.description');

    // write the description to local storage for that hour
    // get parent element
    // console.log(descEl.attr('data-time'));

    // localStorage.setItem($(this).attr('data-time'), JSON.stringify(eventDivEl[0].outerHTML));

}

function createPopoverContent(currentHour, eventDesc) {
    const textAreaEL = $('<textarea>')
            .addClass('form-control my-1')
            .attr('placeholder', "Enter event details")
            .attr('data-time', currentHour.format('YYYY-MM-DD HH'));
    const buttonContainerEl = $('<div>').addClass('d-flex justify-content-between my-1');
    const saveBtnEl = $('<button>').addClass('btn btn-primary save-event').text('Save');
    const cancelBtnEl = $('<button>').addClass('btn btn-danger me-1 cancel-event').text('Cancel');
    if (eventDesc) {
        textAreaEL.text(eventDesc);
        cancelBtnEl.text('Delete')
    }
    buttonContainerEl.append(cancelBtnEl, saveBtnEl);
    buttonContainerEl.on('click', '.save-event', handleSaveEvent);
//    return $('<div>').addClass("popover-content d-flex flex-column").append(textAreaEL, buttonContainerEl).prop('outerHTML');
    const contentString = $('<div>').addClass("popover-content d-flex flex-column").append(textAreaEL, buttonContainerEl).prop('outerHTML');
//    console.log("content string: " + contentString);
    return contentString;
}

// call init function on load
init();
