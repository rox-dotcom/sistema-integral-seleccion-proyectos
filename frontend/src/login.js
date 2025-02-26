import * as backend from "./modules/backend_connection.js"
import { requestFeedback } from "./modules/ui_feedback.js"
import { redirectTo } from "./modules/user_fetch.js"

//DOM Ids
const IDs = {
    loginUsername: "login-user-name",
    loginButton: "login",
    signinButton: "signin",
    passwordUser: "password-user",

    deleteUsername: "delete-user-name",
    deleteUserButton: "delete-user",
};


document.addEventListener("DOMContentLoaded", _ => {
    const elems = Object.keys(IDs).reduce((output, id) => {
        output[IDs[id]] = document.getElementById(IDs[id]);
        return output;
    }, {});
    

    //checking if user exists, and returning (app or alert)
    elems[IDs.loginButton].addEventListener("click", _ => {
        const username = elems[IDs.loginUsername].value;
        const password= elems[IDs.passwordUser].value;

        if(!username||!password){
            alert("Por favor llena todos los campos");
            return;
        }
        

        const request = backend.existsUser(username);
        requestFeedback(request, elems[IDs.loginButton], "", "Error");
        request.then(exists => {
            if (!exists) {
                alert("Usuario o contraseña incorrectos");
                return;
            }
            redirectTo("app", username);
        });
    });

    //redirect to sign_in page
    elems[IDs.signinButton].addEventListener("click", _ => {
            redirectTo("./sign_in");
    });


    //deleting user. Not for this part! goes on app page
    elems[IDs.deleteUserButton].addEventListener("click", _ => {
        const username = elems[IDs.deleteUsername].value;
        const request = backend.deleteUser(username);
        requestFeedback(request, elems[IDs.deleteUserButton], "", "Error");
        request.then(response => {
            alert(response);
        });
    });
});
