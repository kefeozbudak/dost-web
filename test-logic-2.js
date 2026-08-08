// Ah, line 89 doesn't have a wrapper div! `h2` is a direct child.
// So `h2` needs `w-full md:w-auto` if it's supposed to be centerable on mobile!
// `text-align: center` on an `h2` inside a flex container won't center the text relative to the screen if the `h2` doesn't take full width.
// BUT since the container is `flex-col`, children of `flex-col` default to `align-items: stretch` UNLESS `items-center` is applied!
// Line 89: `className="flex flex-col md:flex-row justify-between items-center gap-6"`
// So `items-center` applies to mobile! This means the `h2` will be centered horizontally by flex, but its width will only be as wide as its text.
// If its width is only as wide as its text, `text-align` does nothing, BUT it is already visually centered because of `items-center`!
// Wait! If the user wants `text-align: left` on mobile, but flex is `items-center`, the text will still be centered!
// This means `items-center` overrides `text-align` visually on mobile.
