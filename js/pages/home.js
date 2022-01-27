import { testUser, getPendingUsers, accountActivate, deleteUser } from "../ChampAPI.js";




$(document).ready(() => {
    $('.logout').click(function () {
        localStorage.clear();
        window.location.href = 'index'
    })


    function getAllPendeng(){
        getPendingUsers().then(resp =>{
            resp.forEach(function (val, index) {
                $("#body-pending").append(`<tr>
                <td>${val.first_name}</td>
                <td>${val.surname}</td>
                <td>${val.email}</td>
                <td>${val.interests.cnpj ?? ''}</td>
                <td>${val.interests.business_name ?? ''}</td>
                <td>${val.interests.interest.replace('0','Produtor').replace('1', 'Co-Produtor').replace('2', 'Afiliado') ?? ''}</td>
                <td>
                    <button class="btn btn-xxs btn-success btn-activate" data-id='${val.id}' data-interests="${val.interests.interest}"><span class="fa fa-thumbs-up"></button>&nbsp
                    <button class="btn btn-xxs btn-danger delete" data-id='${val.id}'><span class="fa fa-thumbs-down"></span></button>
                </td>
            </tr>`);
            })

            $(".btn-activate").click(function () {
                accountActivate($(this).data('id'), $(this).data('interests')).then(() => {
                    $("#body-pending").html("")
                    getAllPendeng()
                })
            });

            $(".delete").click(function () {
                deleteUser($(this).data('id')).then(() => {
                    $("#body-pending").html("")
                    getAllPendeng()
                })
            });
        })
    }

    testUser();
    getAllPendeng()
})
