import { login } from "../ChampAPI.js";

function loginHanddler(){
    const loginRef = $("#login");
    const passwordRef = $("#password");
    $( "form" ).on( "submit", false );
    login(loginRef.val(), passwordRef.val());
}


$(document).ready(() => {
    $('#login').on('click', () => { loginHanddler() })
})
