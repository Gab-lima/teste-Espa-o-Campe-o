import { setAlert, verifyEmailToken, submitSecond, validateCNPJ, sendRegisterUser } from "../ChampAPI.js";

$(document).ready(() => {
    $("#code").mask('0-0-0-0')

    function submitHanddle() {
        $("#submit").attr('disabled', true);
        $("form").on("submit", false);
        if ($("#password").val() !== $("#confirm_password").val()) {
            setAlert("#message", "danger", "Senha e Confirmação de senha não conferem!", true);
            $("#submit").attr('disabled', false);
            return false;
        }if($("#password").val().length < 8){
            setAlert("#message", "danger", "A senha deve ter 8 ou mais caracteres!", true);
            $("#submit").attr('disabled', false);
            return false;
        } else {

        // Envio dos dados cadastrados
        let data = {
            name:$("#firstName").val(),
            email:$("#email").val(),
            email_confirmation:$("#email").val(),
            password:$("#password").val()
        }

        sendRegisterUser(data)
                .then(() => {
                    $("#firstName").parent().hide();
                    $("#password").parent().hide();
                    $("#confirm_password").parent().hide();
                    $("#submit").html('Cadastro realizado com sucesso!');
                    $('#code').html("")
                    $(".code-class").show(1000)
                    $("#submit").attr('disabled', false);
                })
                .catch(resp => {
                    $("#message").show();
                    setAlert("#message", "danger", resp.responseJSON.description, true) //
                })
        }
    }

    $("#submit").click(() => {
        submitHanddle()
    })
    $("#code").keyup(function (e) {
        if ($(this).val().length === 7) {
            let surname = $("#firstName").val().split(' ');
            console.warn('surname1 =>', surname)
            surname.splice(0,1);
            console.warn('surname2 =>', surname)
            surname = surname.join(' ');
            console.warn('surname3 =>', surname)
            verifyEmailToken({
                code: $("#code").val(),
                first_name: $("#firstName").val().split(' ')[0],
                surname: surname,
                email: $("#email").val(),
                password: $("#password").val()
            }).then((e) => {
                localStorage.setItem('access_token', e.access_token);
                localStorage.setItem('token_type', e.token_type);
                localStorage.setItem('id', e.id)
                $("#first").fadeOut(500);
                $("#second").fadeIn(500);
            }).catch(() => {
                setAlert("#message", "danger", 'Código não confirmado!', true);
            })
        }
    });

    $("#submit-second").click(() => {
        $("form").on("submit", false);
        if(validateCNPJ($("#cnpj").val())) {
            submitSecond(localStorage.getItem('id'), {
                business_name: $("#business_name").val(),
                cnpj: $("#cnpj").val(),
                objectives: $("#sel2").val()
            }).then( () => {
                $("#second").fadeOut(500);
                $("#third").fadeIn(500);
            }).catch()
        }else{
            setAlert("#message3", "danger", 'O CNPJ Informado não é valido!', true);
        }
    })
});
