const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const answer = item.querySelector(".answer");
    const open = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
    answer.style.maxHeight = open ? `${answer.scrollHeight}px` : "0px";
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const form = document.querySelector("#contactForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector(".submit-button");
  const originalContent = submitButton.innerHTML;

  status.textContent = "";
  status.style.color = "#26965b";
  submitButton.disabled = true;
  form.setAttribute("aria-busy", "true");
  submitButton.textContent = "Küldés folyamatban...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if (response.ok) {
      status.textContent = "Köszönöm! Az üzeneted sikeresen megérkezett.";
      form.reset();
    } else {
      const data = await response.json().catch(() => ({}));
      const message = data.errors?.map((error) => error.message).join(", ");
      status.style.color = "#b42318";
      status.textContent = message || "A küldés nem sikerült. Kérlek, próbáld újra.";
    }
  } catch (error) {
    status.style.color = "#b42318";
    status.textContent = "Hálózati hiba történt. Ellenőrizd a kapcsolatot, majd próbáld újra.";
  } finally {
    submitButton.disabled = false;
    form.removeAttribute("aria-busy");
    submitButton.innerHTML = originalContent;
  }
});
