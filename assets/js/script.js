const scheduleContainer = $('.container');

function init() {
    // build initial work day schedule
    createSchedule();
    // get current hour and update previous and future hours
    // add save click event listener
    //// localStorage.set('09:00 am') = eventDesc
}

function createSchedule() {
    /*
    <div class="time-block row">
        <p class="hour"><label for="block-desc">9 AM</label></p>
        <textarea id="block-desc" name="block-desc"></textarea>
        <button class="saveBtn"></button>
    </div> 
    */

    const workHours = 9;
    let currentHour = moment("09:00", "hh:mm");
    // let currentHour = moment("09:00", "hh:mm").format("hh:mm a");
    console.log("start time: " + currentHour);
    for (let i = 0; i < workHours; i++) {

        // create time block div for each hour
        const timeBlockRow = $('<div>'); 
        timeBlockRow.addClass('time-block', 'row');

        // create hour label
        const hourLabel = $('<label>');
        hourLabel.attr('for', 'block-desc');
        hourLabel.addClass('hour');
        hourLabel.text(currentHour.format("hh:mm a"));
        // create text area
        const hourTextArea = $('<textarea>');
        hourTextArea.attr('id', 'block-desc');
        hourTextArea.attr('name', 'block-desc');
        // create save button
        const hourSaveButton = $('<button>');
        hourSaveButton.addClass('saveBtn');

        // append all elements
        timeBlockRow.append(hourLabel);
        timeBlockRow.append(hourTextArea);
        timeBlockRow.append(hourSaveButton);
        scheduleContainer.append(timeBlockRow);

        // increment hour
        currentHour.add(1, "hours");
    }
}

init();
