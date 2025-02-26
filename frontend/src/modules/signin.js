import * as backend from "./backend_connection.js"
import { requestFeedback } from "./ui_feedback.js"
import { redirectTo } from "./user_fetch.js"

const IDs = {

    createUsername: "create-user-name",
    createUserButton: "create-user",
    createPassword: "new-password-user",

};

//validate user
function isValidUsername(username) {
    return /^[a-zA-Z0-9]{4,}$/.test(username);
}

//validate password
function isValidPassword(password) {
    return /^[\x20-\x7E]{10,}$/.test(password);
}

 //creating a new user
 elems[IDs.createUserButton].addEventListener("click", _ => {
    const username = elems[IDs.createUsername].value;
    const password =elems[IDs.createPassword].value;

    if(!username||!password){
        alert("Por favor llena todos los campos");
        return;
    }

    if (!isValidUsername(username)) {
        alert("El usuario debe tener al menos 4 caracteres y solo contener letras y números.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("La contraseña debe tener al menos 10 caracteres y solo contener caracteres alfanuméricos o especiales.");
        return;
    }
    
    const request = backend.registerUser(username);
    requestFeedback(request, elems[IDs.createUserButton], "", "Error");
    request.then(response => {
        console.log("Backend response:", response);
        alert(response);
        redirectTo("app", username);
    }).catch(error => {
        console.error("Error during registration:", error); 
    });
});