// Is it possible that the child is centered, but the parent container on mobile is not full width or has flex alignment issues?
// "kapüslerimiz ve size en yakın dost koleji"
// Let's look at the `campuses` block again:
// <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-12 gap-6 whitespace-pre-line">
//    <div>...</div>
// </div>
// On mobile, `.items-end` makes the child `<div>` align to the right! (or stretch? No, items-end aligns to the cross-end. For flex-col, cross-axis is horizontal. So it aligns right!)
// If the child is aligned right, its width is only as wide as its text. So `text-align: center` inside it does NOTHING visually because it has no extra space to center within!
// To fix this, on mobile it should be `items-start` or `items-stretch` or just `w-full` for the child `<div>`.
// Actually, `items-end` on a column is very strange. We probably want `items-start md:items-end`.
