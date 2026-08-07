const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });

    tab.classList.add("active");
    tab.setAttribute("aria-current", "page");
  });
});
