
const page = document.body;

page.addEventListener("dark-mode:toggle", (event) => {
    const page = event.currentTarget;
    const checked = event.detail.checked;
    page.classList.toggle("dark-mode", checked);
    /* check for darkmode custom event and toggle */
});


function toggleDarkMode(target, checked) {
    const customEvent = new CustomEvent(
        "dark-mode:toggle", {
        bubbles: true,
        detail: { checked },
    });

    target.dispatchEvent(customEvent);
    /* create custom event dark mode toggle and dispatch to given target */
}

const darkModeToggle = document.getElementById("darkmode");

darkModeToggle.addEventListener("change", (event) => {
    event.stopPropagation();
    
    const target = event.currentTarget;
    const checked = target.checked;
    toggleDarkMode(page, checked);
    /* check the element itself for a change
        then stop it from bubbling and send specified event to page */
});