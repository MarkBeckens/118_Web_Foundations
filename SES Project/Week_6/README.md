# WEEK 6 Assignment - DEBUGGING & PROBLEM SOLVING 

## Reflection and Explaination

Final Debugging Report
Issue 1 — Images Not Showing on Any Page
What was the problem?  
None of the images on my Home, About, or Team pages were loading. The <img> tags were correct, but the browser showed blank space where the images should be.

How I identified it:  
I suspected a path issue because multiple images across different pages were failing. I checked the folder structure and realized I had opened Week_5 as the root folder in VS Code. The assets folder was outside Week_5, so Live Server couldn’t access it. The browser console confirmed this with “Failed to load resource” errors.

How I fixed it:  
I closed VS Code and opened the correct root folder (Web Foundations), which contains both the project folders and the assets folder. Once Live Server served the correct root, all images loaded normally.

(I did not copy the assets folder — I kept a single clean copy and opened the correct project root instead.)

Issue 2 — Images Still Not Showing (Path Resolution)
What was the problem?  
Because Week_5 was opened alone, the relative path ../assets/... pointed to a folder that didn’t exist in the Live Server root. The HTML was correct, but the server context was wrong.

How I identified it:  
I checked the folder structure and confirmed that Week_5 did not contain an assets folder. The relative path could only work if the actual project root was opened.

How I fixed it:  
I reopened the correct folder so the ../assets/ path resolved properly. This preserved the single assets folder and avoided unnecessary duplication.

Verification:  
After reopening the correct root, all images appeared on all pages.

Issue 3 — Sorting Boxes Too Large & Sorting Arrow Hard to See
What was the problem?  
On the Team page, the clickable sorting boxes were oversized and blended into the rest of the table. The sorting arrow also wasn’t visually clear, making it hard to tell which column was sorted.

How I identified it:  
I visually inspected the table layout and noticed the header boxes didn’t look like interactive elements. When testing sorting, the arrow wasn’t obvious enough to show the sort direction.

How I fixed it:  
I updated the CSS to reduce padding and size of the header boxes so they looked like proper buttons. I also made the sorting arrow constant and more visible, ensuring it always reflects the actual sort direction.

Verification:  
After the fix, the header boxes were clearly clickable, and the arrow reliably showed whether the column was sorted ascending or descending.