                                                 APiREST NODEJS usando MONGODB

                                                     Felipe Oliveira França
                                                                                      
Rotas para Pessoas
                 
Listar todas as pessoas GET -> http://localhost:3000/pessoas

Listar pessoa especifica GET -> http://localhost:3000/pessoas/ID

Criar pessoa POST -> localhost:3000/pessoas 

body com formato de raw e json(application/json)

{

            "nome": "Felipe França",
            "email": "felipe@gmail.com",
            "cpf": "123123123123",
            "telefone": "123123123",
            "senha": "123",
            "endereco": {
            	"rua": "Rua 1",
            	"numero" : 123,
            	"bairro": "jd 1",
            	"cidade": "Itapetininga",
            	"estado" : "SP"
               }
            
}

Editar pessoa PATCH -> http://localhost:3000/pessoas/ID

body com formato de raw e json(application/json)

[

{"propriedade": "endereco.numero", "value":"123"}

]

Deletar pessoa DELETE -> http://localhost:3000/pessoas/ID

Rotas para Grupoas

Listar todos os grupos GET -> http://localhost:3000/grupos

Listar grupo especifico GET -> http://localhost:3000/grupos/ID

Criar grupo POST -> localhost:3000/grupo 

body com formato de raw e json(application/json)

{

            "pessoas": ["pessoaID"]
            
}

Editar grupo PATCH -> http://localhost:3000/grupos/ID

body com formato de raw e json(application/json)

[

{"propriedade": "pessoas", "value":"[pessoaID]"}

]

Deletar grupo DELETE -> http://localhost:3000/grupos/ID
