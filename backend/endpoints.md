### Usuários [/user]
- (GET) Listar todos os usuários:  [/]
  - Retorno da requisição: JSON com todos os usuários
  
- (GET) Obter um único usuário: [/:id]
  - `inserir id do usuário no url da requisição no lugar de <:id>`
  - Retorno da requisição 
      {
      "id": string,
      "email": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime"
      }

- (POST) Criar novo usuário: [/]
  - Corpo da Requisição
    {
      "name": string,
      "email": string,
      "team_id" string (opcional)
    }

- (PATCH) Atualizar usuário: [/:id]
  - `Inserir id do usuário no lugar de <:id>`
  - Corpo da Requisição
    {
    "nome": string (opcional),
    "email": string (opcional)
    }
  - Retorno da Requisição
    {
      "id": string,
      "email": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime
    }

- (PATCH) Mudança de senha primeiro login: [/password/:id]
  - `Inserir id do usuário no lugar de <:id>`
  - Corpo da Requisição
    {
      "password": string
    }
  - Retorno da Requisição
    {
      "id": string,
      "email": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime
    }

- (DELETE) Remover um usuário: [/:id]
- `inserir id do usuário no lugar de <:id>`

### Times [/team]
- (GET) Listar todos os times:  [/]
  - Retorno da requisição: JSON com todos os times
  - 
- (GET) Obter um único time: [/:id]
  - `inserir id do time no url da requisição no lugar de <:id>`
  - Retorno da requisição
    {
      "id": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime,
      "leaderId": string (FK),
      "enterpriseId": string (FK)"
    }
  - Líder inválido: `Leader not found`
  - Empresa inválida:: `Enterprise not found`

- (GET) Exibir Líder do time: [/leader/:id]
  - `inserir id do time no url da requisição no lugar de <:id>`
  - Retorno da requisição
    {
      "id": string,
      "email": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime"
    }

- (POST) Criar novo time: [/]
  - Corpo da Requisição
    {
    "name": "nowlike",
    "leaderId": "cmbc2icn40000ekhme3gam2o7",
    "enterpriseId": "cmbbyuhkt0001ekci2bgtt31x"
    }
  - Retorno da requisição
    {
    "id": string,
    "name": string,
    "createdAt": datetime,
    "updatedAt": datetime,
    "leaderId": string,
    "enterpriseId": string,
    "leaderSlackId": string (opcional)
    }
    

- (PATCH) Atualizar time: [/:id]
  - `Inserir id do time no lugar de <:id>`
  - Corpo da Requisição
    {
    "nome": string (opcional),
    "leader_user_id": string (opcional)
    }
  - Retorno da Requisição
    {
      "id": string,
      "name": string,
      "createdAt": datetime,
      "updatedAt": datetime,
      "leaderId": string (FK),
      "enterpriseId": string (FK)"
    }

- (DELETE) Remover um único time: [/:id]
  - `inserir id do time no url da requisição no lugar de <:id>`

### Empresas [/enterprise]

- (GET) Listar todas as empresas:  [/]
  - Retorno da requisição: JSON com todas as empresas
  - 
- (GET) Obter uma única empresa: [/:id]
  - `inserir id da empresa no url da requisição no lugar de <:id>`
  - Retorno da requisição
    {
      "id": string,
      "name": string,
      "adminUserId": string
    }
  - Empresa não existe: `mensagem em branco`

- (POST) Criar nova empresa: [/]
  - Corpo da Requisição
    {
      "name": string,
      "adminUserId": string
    }
  - Retorno da requisição
    {
      "id": string,
      "name": string,
      "adminUserId": string
    }
    

- (PATCH) Atualizar empresa: [/:id]
  - `Inserir id da empresa no lugar de <:id>`
  - Corpo da Requisição
    {
      "name": string (opcional),
      "adminUserId": string (opcional)
    }
  - Retorno da Requisição
    {
      "id": strig,
      "name": string,
      "adminUserId": string
    }

- (DELETE) Apagar uma única empresa: [/:id]
  - `inserir id da empresa no url da requisição no lugar de <:id>`


### Feedback

- (GET) Listar todos os Feedbacks:  [/]
  - Retorno da requisição: JSON com todos os Feedbacks
  
- (GET) Obter um único feedback: [/:id]
  - `inserir id do feedback no url da requisição no lugar de <:id>`
  - Retorno da requisição 
      {
        "senderUserId": string,
        "receiverUserId": string,
        "message": string
      }

- (POST) Enviar um Feedback: [/feedback/sendfeedback]
  - senderUserId ausente = anonymous;
  - Corpo da Requisição
   {
      "senderUserId": string (opcional),
      "receiverUserId": string,
      "message": string
   }

- (DELETE) Apagar um único Feedback: [/:id]
  - `inserir id do Feedback no url da requisição no lugar de <:id>`