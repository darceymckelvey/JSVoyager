// bad code
// ========
// - no semi-colons
// - adding something to the DOM and than immediatly hiding it for later persumably

// document.body.appendChild(el)
// el.style.display = 'none'

// the problem with this is that we will never know if by trace chance that elemnt flickers on screen before its hidden
// because of this a better way to write this is just by swapping the two around like so:

// el.style.display = 'none'
// document.body.appendChild(el)

//  THE EVENT LOOP
// ===============

// MAIN THREAD - where loads of stuff happens, javascript lives here, where rendering happens, where the DOM lives
//               so if something on the main thread takes a long time (200ms) it will be really noticable as it
//               blocks rendering, blocks interactivity
// 
//  Now we usely sent out a bunch of other stream around the MAIN THREAD as these other threads like encoding and decoding,, crypto, monitopring input devices 
//  all have to come back to the MAIN THREAD to hand off data. This is handled by the EVENT LOOP

// setTimeout method details
//  the setTimeout(ms, callback) method, when invoked, must run the following steps:
//  1. Wait ms milliseconds
//  2. Invoke callback
//  This runs on the same thread as whatever invked it. Whic in this case is inkedwith javascript so its  on the MAIN FRAME
//  So it is very sneezy as it holds up everything after it, to fix this we do:
// 1. Run  the following steps in parallel:
//        1. Wait ms milliseconds
//        2. Invoke callback
//  Which just means get off the MAIN FRAME but run other stuff at the same time as the MAINFRAME
//  But this leads to all sorts of race conditions as everything is figuring out which finishs first.
//  To fix this problem we have to queue a task to get back on the MAIN THREAD at some point:
// 1. Run  the following steps in parallel:
//        1. Wait ms milliseconds
//        2. QUEUE a task to run the following steps:
//            1. Invoke callback
//  first part of the EVENT LOOP to look deeper at will be TASK QUEUES
// When we queue a task the EVENT LOOP takes a detour  

// sychronous means instant feed back basicly
//  asychronous means theres a task to be done and blocks the MAIN THREAD to solve this we use the EVENT LOOP
// javascript is sigle threaded thats why there is only one MAIN THREAD

// Sync style: you cant inmteract with webpage while you wait that 2500ms
getCoffee();
singASong();

function getCoffee() {
    console.log('Getting coffee..');
    doSyncStuff(2500);
    console.log('Coffee is here!');
}

function singASong() {
    console.log('Start singing...');
}

function doSyncStuff(ms) {
    const end = Date.now() + ms;
    while (Date.now() < end) {}
}

// Async style: you can interact with the webpage will it gets coffee
// 
getCoffee2();
singASong2();

function getCoffee2() {
    console.log('Geting coffee async...');
    doAsyncStuff(() => {
        console.log('Coffee is here!');
    });
}

function singASong2() {
    console.log('Start singing...');
}

async function doAsyncStuff(callback) {
    // part of a web api so it gets handed off to a different part of the browser to register a call back after 2500ms(2.5s) so function gets return imediatly and moves on
    // the call stack is not manipluatble from external things like web api's instead it goes to Task Queue
    // the task queue can be accessed by many types of ACTORS like WEB APIs, things like setTimeout(callback, ms) -> WEB APIs{places exucutables could be cat into:  Timer, fetch, DOM, web sockets, UI event, push}
    // the TASK QUEUE stored callbacks and or jobs that come back from async operations, network request, user events
    // first in first out bases out stream <- 1 | 2 | * | <- in stream
    // the thing that moves data off the TASK QUEUE to the CALL STACK is called the EVENT LOOP
    // this works by the EVENT LOOP looking at the TASK QUEUE for things queued to be exucuted when the CALL STACK is empty, and it is contintly runing when nothing on call stack, though will not check the
    // task queue in till all schronous code has been gone through, so the first initialization of the script, even if a setTimout was set to 0ms
    setTimeout(() => {
        callback()
    }, 2500)
}

//  to fully understand the event loop we have to understand three concepts
// 1. Event Loop
// 2. Call Stack - when a function or anything is being done it is added to the stack, than when done, than they get removed. last in first out, LiFo
// 3. Task Queue 

