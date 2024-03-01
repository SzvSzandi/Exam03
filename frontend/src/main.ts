import './style.css'
import { z } from "zod"


const emailElement = document.getElementById("emailInput") as HTMLInputElement
const passwordElement = document.getElementById("passwordInput") as HTMLInputElement
const confirmPasswordElement = document.getElementById("confirmPasswordInput") as HTMLInputElement
const registrationButton = document.getElementById("registrationButton") as HTMLButtonElement



const formDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
});

const postData = async () => {
  const formData = {
    email: emailElement.value,
    password: passwordElement.value,
    confirmPassword: confirmPasswordElement.value,
  };

  const result = formDataSchema.safeParse(formData);

  if (!result.success) {
    alert('Hibás adatok. Kérjük, ellenőrizze a beírt adatokat.');
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/registration", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('Sikeres regisztráció');
    } else {
      alert('Sikertelen regisztráció');
    }
  } catch (error) {
    console.error(error);
    alert('Hiba történt a regisztráció során. Kérlek próbáld újra később.');
  }
};

emailElement.addEventListener("color", () => {
  const email = emailElement.value;

});



passwordElement.addEventListener("color", () => {
  const password = passwordElement.value;
  const isValidPassword = password.length >= 5;

  if (isValidPassword) {
    passwordElement.style.borderColor = "#34D399"; 
  } else {
    passwordElement.style.borderColor = "#EF4444"; 
  }
})



confirmPasswordElement.addEventListener("color", () => {
  const password = passwordElement.value;
  const confirmPassword = confirmPasswordElement.value;

  const isValidConfirmation = confirmPassword === password;

  if (isValidConfirmation) {
    confirmPasswordElement.style.borderColor = "#34D399"; 
  } else {
    confirmPasswordElement.style.borderColor = "#EF4444"; 
  }
});


registrationButton.addEventListener('click', async () => {
  await postData();
});

