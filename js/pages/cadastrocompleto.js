import { UpdateUserData, testUser, validateCPF, getUser } from "../ChampAPI.js";

$(document).ready(function () {
    testUser();

    getUser(localStorage.getItem('id')).then( resp => {
        console.warn(resp)
        $("[name='business_name']").val(resp.data.interests.business_name)
        $("[name='ein']").val(resp.data.interests.cnpj)
        $("[name='responsible_first_name']").val(resp.data.first_name)
        $("[name='responsible_surname']").val(resp.data.surname)
        $("[name='email']").val(resp.data.email)
    })

    $("[name='ein']").inputmask("99.999.999/9999-99")
    $("[name='phone']").inputmask("(99)9999-99999")
    $("[name='postalcode']").inputmask("99999-999")
    $("[name='responsible_postalcode']").inputmask("99999-999")
    $("[name='responsible_document']").inputmask("999.999.999-99")
    $("[name='responsible_document']").blur(function (){
        if(!validateCPF($("[name='responsible_document']").val())){
            alert('CPF Inválido')
            $("[name='responsible_document']").val('')
        }
    })

    $("[name='postalcode']").blur(() => {
        const cep = $("[name='postalcode']").val();
        $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
            $("[name='address']").val(dados.logradouro);
            $("[name='neighborhood']").val(dados.bairro);
            $("[name='city']").val(dados.localidade);
            $("[name='state']").val(dados.uf);
        });
    });

    $("[name='responsible_postalcode']").blur(() => {
        const cep = $("[name='postalcode']").val();
        $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
            $("[name='responsible_address']").val(dados.logradouro);
            $("[name='responsible_neighborhood']").val(dados.bairro);
            $("[name='responsible_city']").val(dados.localidade);
            $("[name='responsible_state']").val(dados.uf);
        });
    });

    $('#smartwizard').smartWizard({
        enableURLhash: false,
        toolbarSettings: {
            toolbarExtraButtons: [
                $('<button style="display: none" id="wfinish"></button>').text('Validar Documentação')
                    .addClass('btn btn-success').on('click', () => { window.location.href = 'financeiro'}),
            ]
        },
        keyboardSettings: {
            keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            keyLeft: [37], // Left key code
            keyRight: [39] // Right key code
        },
    }).on("leaveStep", function(e, anchorObject, stepIndex, stepDirection) {
        const validator = $( "form" ).validate();
        console.log(validator);
        return validator.form();
    }).on("showStep", function(e, anchorObject, stepNumber, stepDirection) {
        setTimeout(function () {
            if(stepNumber === 3){
               $( 'button.sw-btn-next').html('Concluir');
            }
            if(stepNumber === 4){
                $('button.sw-btn-next').hide();
                $('button.sw-btn-prev').hide();
                let config = {};
                $('form').serializeArray().map(function(item) {
                    if ( config[item.name] ) {
                        if ( typeof(config[item.name]) === "string" ) {
                            config[item.name] = [config[item.name]];
                        }
                        config[item.name].push(item.value);
                    } else {
                        config[item.name] = item.value;
                    }
                });
                $('form').submit(false)
                UpdateUserData(localStorage.getItem('id'), config)
                    .then(() => {
                        $("#wfinish").show();
                        $("#p-success").show()
                    })
                    .catch( () => {
                        $("#p-falha").show()
                    })
            }
        }, 500);

    });

    $("#end").click(function () {

    })
})
