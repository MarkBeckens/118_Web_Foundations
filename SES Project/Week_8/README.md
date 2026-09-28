# WEEK 8 Assignment - Labs & Coding - ASYNCHRONOUS BEHAVIOR

## Reflection and Explaination

This week I added a revenue report feature that ties the About page and the Team page together with timing instead of everything just showing up instantly.

On the About page I added a "Create Report" button along with a Year dropdown and an SES Share % dropdown, so the user can pick what report they want before generating it. Clicking the button disables it and walks through a few status messages one at a time (collecting data, calculating shares, compiling the report), each one delayed with setTimeout instead of all happening at once. Once that's done, it sends the user to the Team page.

The Team page doesn't just show the table right away either. If it sees a report was just requested, it shows a loading spinner and its own sequence of status messages first, then reveals the table with the numbers recalculated for whatever year and percentage were picked, plus a "Report generated at [time]" message. If someone visits the Team page directly without generating a report, it just shows the normal table with no delay, since there's nothing to wait on.

For iteration 2, I added a "Regenerate Report" button on the Team page. Instead of regenerating in place, it sends the user back to the About page with their last year/% choices already filled in, so they can change either value and generate a new report.

Bug — Loading Overlay Wouldn't Hide
What was the problem?
After the loading sequence finished on the Team page, the spinner and "Rendering report..." text stayed on screen instead of disappearing, even though the table was supposed to take its place.

How I identified it:
I tested the flow in the browser and watched it happen live — the JavaScript was clearly running (the table showed up), but the loading text never went away.

How I fixed it:
I checked my CSS and found `.report-loading { display: flex; }`, which was overriding the `hidden` attribute I was setting in JavaScript. The hidden attribute doesn't automatically win over a class that sets display directly. I fixed it by adding a `.report-loading[hidden] { display: none; }` rule so hidden actually hides it.

Verification:
After the fix, the spinner disappears and the table shows in its place every time the sequence finishes.

Reflection:
Working with setTimeout changed how I think about my code. It doesn't just run top to bottom anymore — clicking a button doesn't mean the result shows up right away, it just starts something that finishes later. I had to stop thinking about what line runs next and start thinking about what should happen once each step is actually done.
