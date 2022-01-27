//const URL = 'https://dev.plataformacampeao.com.br/api';
const URL = 'http://champion-dev/api';


export const setAlert = (el, type, message, time = true) => {
    $(el).hide();
    $(el).removeClass('alert-*');
    $(el).removeClass('alert');
    $(el).addClass("alert");
    $(el).addClass("alert-" + type);
    $(el).html(message);
    $(el).show(500);
    if(time){
        setTimeout(()=>{
            $(el).hide(500);
            $(el).removeClass('alert-*');
            $(el).removeClass('alert');
            $(el).html('');
        }, 5000);
    }
}


export const login = (login, password) => {
    $.ajax({
        url: URL + "/login",
        dataType: "JSON",
        type: "POST",
        data: {email: $("#email").val(),password: $("#password").val()},
        success: (resp) => {
            localStorage.setItem('access_token', resp.access_token);
            localStorage.setItem('token_type', resp.token_type);
            window.location.href = 'home';
        },
        error: (resp) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            setAlert("#message", "danger", "usuário ou senha incorretos!", false);
        }
    })
}

export const testUser = () => {
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/me",
        dataType: "JSON",
        type: "POST",
        data: {email: $("#email").val(),password: $("#password").val()},
        success: (resp) => {
            localStorage.setItem('last_check', new Date().toLocaleDateString());
            localStorage.setItem('id', resp.id);
            $("#userName").html(resp.first_name)
            if(resp.status === 1){
                $('body').prepend(`
                <div style="padding-left: 12px;line-height: 2.1rem;width: 100%; z-index: 999999; position: absolute; top: 0; left: 0; height: 40px; background-color:#143b64; color: white; font-size: 18px">Precisa terminar de preencher seus dados para ativar suas vendas <a href="cadastro-completo" class="blinking" style="color: white">[ Clique Aqui ]</a></div>
                `);
            }
        },
        error: (resp) => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('token_type');
            window.location.href = "index";
        }
    })
}

export const sendEmailVerificationToken = (email) => {
    return $.ajax({
        url: URL + "/send-token/" + email,
        dataType: "JSON",
        type: "POST",
    })
}


export const verifyEmailToken = (data) => {
    return $.ajax({
        url: URL + "/auth/get-token",
        dataType: "JSON",
        type: "POST",
        data: data,
    })
}

export const submitSecond = (id, data) => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/set-pass2/"+id,
        dataType: "JSON",
        type: "POST",
        data: data
    })
}

export const getPendingUsers = () => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/users/pending",
        dataType: "JSON",
        type: "GET",
    })
}

export const accountActivate = (id, interest) => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/users/account/activate",
        dataType: "JSON",
        type: "POST",
        data: {
            id: id,
            interest: interest
        }
    })
}

export const deleteUser = (id) => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/users/"+id+"/delete",
        dataType: "JSON",
        type: "POST"
    })
}

export const UpdateUserData = (id, data) => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/users/"+id+"/liberate-access",
        dataType: "JSON",
        type: "POST",
        data: data,
    })
}

export const validateCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/[^\d]+/g,'');

    if(cnpj === '') return false;

    if (cnpj.length !== 14)
        return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj === "00000000000000" ||
        cnpj === "11111111111111" ||
        cnpj === "22222222222222" ||
        cnpj === "33333333333333" ||
        cnpj === "44444444444444" ||
        cnpj === "55555555555555" ||
        cnpj === "66666666666666" ||
        cnpj === "77777777777777" ||
        cnpj === "88888888888888" ||
        cnpj === "99999999999999")
        return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0,tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let i = 0;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
        return false;

    return true;
}

export const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g,'');
    if(cpf == '') return false;
    // Elimina CPFs invalidos conhecidos
    if (cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999")
        return false;
    // Valida 1o digito
    let add = 0;
    let i = 0
    for (i=0; i < 9; i ++)
        add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(9)))
        return false;
    // Valida 2o digito
    add = 0;
    for (i = 0; i < 10; i ++)
        add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11)
        rev = 0;
    if (rev != parseInt(cpf.charAt(10)))
        return false;
    return true;
}

export const getUser = (id) => {
    return $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
        },
        url: URL + "/users/"+id+"/one",
        dataType: "JSON",
        type: "GET",
    })
}
