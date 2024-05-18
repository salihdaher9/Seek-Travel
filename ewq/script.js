// script.js
document.addEventListener("DOMContentLoaded", function () {
  const buttonItems = document.querySelectorAll(".button-item");

  buttonItems.forEach((item) => {
    item.addEventListener("click", function () {
      const action = this.getAttribute("data-action");
      handleButtonClick(action);
    });
  });

  function handleButtonClick(action) {
    switch (action) {
      case "action1":
        alert("Button 1 clicked!");
        break;
      case "action2":
        alert("Button 2 clicked!");
        break;
      case "action3":
        alert("Button 3 clicked!");
        break;
      default:
        console.log("Unknown action:", action);
    }
  }
});
