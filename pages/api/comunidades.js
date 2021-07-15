//Função para centralizar as chamadas em API do Dato para Comunidades
//Como esse arquivo está na pasta API, o Next cria isso como um backend
//Aqui fica seguro para guardarmos os tokens API, assim não fica salvo pro usuario
//O Node sobe automaticamente um servidor pra rodar esse arquivo. 
//Pra testar, basta chamar essa rota comunidades no navegador (http://localhost:3000/api/comunidades)
//Esse conceito é chamado de BFF

//Documentação do Dato
//https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients

import { SiteClient } from 'datocms-client';

//Async devido ser uma Promise
export default async function recebedorDeRequests(request, response) {

    if (request.method == 'POST') {
        //Pode até dar um console log que nao aparece no navegador, apenas no console do node
        const TOKEN = '971c33622dca362b174556a60adced';
        const client = new SiteClient(TOKEN);

        //Criar novo registro
        const registroCriado = await client.items.create({
            itemType: "966220", //ID da Tabela, fica em Edit Model
            ...request.body, //Passa o body recebido na request
            //title: "",
            //imageUrl: ""
        });

        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado
        });
    }
    
}