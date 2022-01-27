(function($) {
    var modalOpened = false
    //Toggle ofertas
	jQuery("#customSwitchOfertas").on('change',function(){
		$(".active-ofertas").toggleClass('hidden');
	});
    


    //Clona formulário de ofertas
	jQuery("#add-ofertas-action").on('click',function(){
		let ofertaList = $('.oferta-form');
        ofertaList.find('.remove-oferta-item').attr('disabled', false);
		let indexLast = ofertaList.length - 1;

		let itemclone = $(ofertaList[indexLast])
			.clone()
			.removeClass('oferta'+indexLast)
			.addClass('oferta'+(indexLast + 1));
            
            // Deixa inputs vazios (find)        
            itemclone.find('.nome-oferta')[0].value = "";
            itemclone.find('.preco-oferta')[0].value = "";
                

		itemclone.insertAfter('.oferta'+indexLast);
	}); 

    //////// END

    /////// CRUD

    //direciona para a função create ou update com os dados formatados
    document.querySelector('#formPlanAssing').addEventListener('submit', event => {
        event.preventDefault();
        index = $('#formPlanAssing').attr('data-id');
        $('#formPlanAssing').removeAttr('data-id');

        const formData = new FormData(event.target);
        const formProps = Object.fromEntries(formData);

        $('#close-modal-assgn').click();
        
        if(index == undefined){
            createAssnPlan(formProps)
            

        } else {
            updateAssnPlan(index, formProps)
        }
    })

    $('#assinatura').on('hidden.bs.modal', function () {
        clearForm();
    });
   
})(jQuery);

//remove formulário de ofertas
function removeOfertaItem(item) {
    $(item).parent().parent().remove()
    let ofertaList = $('.oferta-form');
    if (ofertaList.length == 1){
        ofertaList.find('.remove-oferta-item').attr('disabled', true);
    }
}


//CRUD

//Recupera dados do localstorage
function getAllUsers() {
    try {
      if (!localStorage.getItem("dataPlanAssign")) localStorage.setItem("dataPlanAssign", []);
      return (
        localStorage.getItem("dataPlanAssign") ?
        JSON.parse(localStorage.getItem("dataPlanAssign")) : []
      );
    } catch (e) {
      return []
    }
};

//Insere array no localstorage na ultima posição
function createAssnPlan(data){

    let list = getAllUsers();
    list.push(data)
    localStorage.setItem("dataPlanAssign", JSON.stringify(list));
    
    listAssnPlan()
}

//Atualiza array no localstorage do item atualizado
function updateAssnPlan(index, data){

    let list = getAllUsers();
    list[parseInt(index)] = data;
    localStorage.setItem("dataPlanAssign", JSON.stringify(list));
	
    listAssnPlan()
}

//Remove item selecionado do array
function deleteAssnPlan(index){

    let list = getAllUsers();
    list.splice(parseInt(index), 1);
    localStorage.setItem("dataPlanAssign", JSON.stringify(list));
	
    listAssnPlan()
}

//Abre o modal e retorna os dados ja preenchidos
function openEditModalAssnPlan(index) {
    let item = getAllUsers()[parseInt(index)];
    $('#formPlanAssing').attr('data-id', index);

    $('#formPlanAssing input[name="nomeAssnPlan"]')[0].value = item.nomeAssnPlan
    $('#formPlanAssing input[name="valorAssnPlan"]')[0].value = item.valorAssnPlan
    $('#formPlanAssing select[name="freqAssnPlan"]')[0].value = item.freqAssnPlan
    $('#formPlanAssing input[name="numCobrancaAssnPlan"]')[0].value = item.numCobrancaAssnPlan

    if(item.renovacaoAssnPlan == "1"){
        $('#formPlanAssing input[name="renovacaoAssnPlan"][value="1"]').prop("checked", true)
        $('#formPlanAssing input[name="renovacaoAssnPlan"][value="2"]').prop("checked", false)
    }else {
        $('#formPlanAssing input[name="renovacaoAssnPlan"][value="2"]').prop("checked", true)
        $('#formPlanAssing input[name="renovacaoAssnPlan"][value="1"]').prop("checked", false)
    }
    $('#modal-assgn-action').click();
}




//Insere no html os itens do localstorage
function listAssnPlan(){

    let list = getAllUsers();
    
    $( "#list-assn-plan" ).empty();

    list.map((item, index) => {
        $( "#list-assn-plan" ).append(`
        <tr>
	    	<td>${item.nomeAssnPlan}</td>
	    	<td></td>
	    	<td>${item.valorAssnPlan}</td>
	    	<td></td>
	    	<td>${item.freqAssnPlan}</td>
	    	<td>${item.renovacaoAssnPlan === "1" ?  "Até o cliente cancelar" : `Número fixo de cobranças: ${item.numCobrancaAssnPlan}`}</td>
	    	<td>
	    		<div class="dropdown">
	    			<button type="button" class="btn btn-success light sharp" data-toggle="dropdown">
	    				<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">
	    					<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
	    						<rect x="0" y="0" width="24" height="24" />
	    						<circle fill="#000000" cx="5" cy="12" r="2" />
	    						<circle fill="#000000" cx="12" cy="12" r="2" />
	    						<circle fill="#000000" cx="19" cy="12" r="2" />
	    					</g>
	    				</svg>
	    			</button>
	    			<div class="dropdown-menu">
	    				<button class="dropdown-item" onClick="openEditModalAssnPlan(${index})">Editar</button>
	    				<button class="dropdown-item" onClick="deleteAssnPlan(${index})">Excluir</button>
	    			</div>
	    		</div>
	    	</td>
	    </tr>
        `);
    })
    
}

function clearForm(){
    $('#formPlanAssing').removeAttr('data-id');

    $('#formPlanAssing input[name="nomeAssnPlan"')[0].value = ''
    $('#formPlanAssing input[name="valorAssnPlan"')[0].value = ''
    $('#formPlanAssing select[name="freqAssnPlan"')[0].value = ''
    $('#formPlanAssing input[name="renovacaoAssnPlan"')[0].value = ''
    $('#formPlanAssing input[name="numCobrancaAssnPlan"')[0].value = ''
}

listAssnPlan();


//////// END

