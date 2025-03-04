import * as backend from "./modules/backend_connection.js"
import { requestFeedback } from "./modules/ui_feedback.js"
import { redirectTo } from "./modules/user_fetch.js"


//DOM Ids
const IDs = {
    loginUsername: "login-user-name",
    loginButton: "login",
    signinButton: "signin",
    passwordInput: "password-user",
    anonymSessionButton: "anonym-user",
    viewPassButton: "view-passw"
};


document.addEventListener("DOMContentLoaded", _ => {
    const elems = Object.keys(IDs).reduce((output, id) => {
        output[IDs[id]] = document.getElementById(IDs[id]);
        return output;
    }, {});
    

    //checking if user exists, and returning (app or alert)
    elems[IDs.loginButton].addEventListener("click", _ => {
        const username = elems[IDs.loginUsername].value;
        const password= elems[IDs.passwordInput].value;

        if(!username||!password){
            alert("Por favor llena todos los campos");
            return;
        }
        
        
        const response = backend.mockAuthenticate(username,password);
        const request = backend.existsUser(username);
        requestFeedback(request, elems[IDs.loginButton], "", "Error");
        request.then(exists => {
            if (!exists) {
                alert("Usuario o contraseña incorrectos");
                return;
            }
            localStorage.setItem("authToken", response.token);
            redirectTo("app", username);
        });
        

    });
     
    //Creating an anonym session
    elems[IDs.anonymSessionButton].addEventListener("click", async() =>{
        const username = `guest_${Math.floor(Math.random() * 100000)}`; // Unique anonymous username

        try {
            const response = await backend.registerUser(username);
            console.log("Backend response:", response);
            redirectTo("app", username);
        } catch (error) {
            console.error("Error during anonymous session creation:", error);
            requestFeedback(null, elems[IDs.anonymSessionButton], "", "Error creating anonymous session");
        }
    });

    //Show password button
    elems[IDs.viewPassButton].addEventListener("click", () => {
        const passwordInput = elems[IDs.passwordInput];
        const icon = elems[IDs.viewPassButton].querySelector("i");
        
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            passwordInput.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
    

    //redirect to sign_in page
    elems[IDs.signinButton].addEventListener("click", _ => {
            redirectTo("./sign_in");
    });

});
