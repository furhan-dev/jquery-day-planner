const scheduleContainerEl = $('.container');
var rightNow;
var scheduleTableEl;

/**
 * Init function called when script is loaded
 */
function init() {
    // set current date/time
    rightNow = moment();
    $('#currentDay').text(rightNow.format('dddd, MMMM Do, YYYY'));
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

            })
        return popover;
    });

    // add event handlers
    scheduleTableEl.on('click', '.description', handleScheduleClick);
    $('body').on('click', '.save-event', handleSaveEvent)
    $('body').on('click', '.delete-event', handleDeleteEvent)
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
        const rowEl = $('<tr>').addClass('row m-0');
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

    // append table to container
    scheduleContainerEl.html(scheduleTableEl);
}

// prevent popover dismissal

function handleSaveEvent(event) {
    const textAreaEl = $(this).parent().prev();
    const dataTime = textAreaEl.attr('data-time');
    localStorage.setItem(dataTime, textAreaEl.val());
    const scheduleButtonEl = $("button[data-time='" + dataTime + "']");
    const scheduleButtonDivEl = scheduleButtonEl.children()[0];
    scheduleButtonDivEl.textContent = textAreaEl.val();
    $("button[data-bs-toggle='popover']").popover('hide');
    init();
}

function handleDeleteEvent(event) {
    const textAreaEl = $(this).parent().prev();
    const dataTime = textAreaEl.attr('data-time');
    textAreaEl.val("");
    localStorage.removeItem(dataTime);
    const scheduleButtonEl = $("button[data-time='" + dataTime + "']");
    const scheduleButtonDivEl = scheduleButtonEl.children()[0];
    scheduleButtonDivEl.remove();
    $("button[data-bs-toggle='popover']").popover('hide');
    init();
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
}

function createPopoverContent(currentHour, eventDesc) {
    const textAreaEL = $('<textarea>')
            .addClass('form-control my-1')
            .attr('placeholder', "Enter event details")
            .attr('data-time', currentHour.format('YYYY-MM-DD HH'));
    const buttonContainerEl = $('<div>').addClass('d-flex justify-content-between my-1');
    const saveBtnEl = $('<button>').addClass('btn btn-primary save-event').text('Save');
    const cancelBtnEl = $('<button>').addClass('btn btn-danger me-1 delete-event').text('Delete');
    if (eventDesc) {
        textAreaEL.text(eventDesc);
    }
    buttonContainerEl.append(cancelBtnEl, saveBtnEl);
    const contentString = $('<div>').addClass("popover-content d-flex flex-column").append(textAreaEL, buttonContainerEl).prop('outerHTML');
    return contentString;
}

// call init function on load
init();
