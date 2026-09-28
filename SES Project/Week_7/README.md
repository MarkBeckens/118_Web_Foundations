# WEEK 7 Assignment - Labs & Coding - STRUCTURED BEHAVIOR

## Reflection and Explaination

This week I went back into my Week 6 script.js and cleaned it up instead of adding new features. The sorting code already worked, so the goal was to make it easier to read and organized instead of just working.

What I changed:
I pulled the navigation logic and the table sorting logic into their own functions, initNavigation() and initSortableTable(), instead of having everything run at the top of the file. I also added one entry point at the bottom of the file that calls both functions once the page loads, so it's clear where the script actually starts.

I noticed the nav links were only being highlighted manually, and only team.html was loading script.js. Instead of repeating that setup on every page, I wrote initNavigation() once and added script.js to all three pages so every page benefits from the same function.

I also added a small check in initSortableTable() so it just does nothing if a page doesn't have a table, instead of assuming one is always there.


I also fixed from your note from Week 5 about the team page hero image stretching. The image is 1920x450, but the header box was a fixed height (50vh) that didn't match that ratio, so the image got cropped differently depending on screen size. I changed the header to use aspect-ratio so it scales with the image's real proportions instead.

How restructuring changed my understanding:
Splitting the code into functions made it obvious that the navigation and the table sorting don't depend on each other at all — they're two separate jobs that just happen to live in the same file. Once I saw that, it was easier to give each function one clear responsibility and trust that it would only do that one thing.
