# Angular_test_tecni# User Management — Frontend

Frontend desenvolvido em Angular para autenticação e gerenciamento de usuários e endereços. A aplicação possui área administrativa para gerenciamento de usuários e área de perfil para que usuários consultem e atualizem seus próprios dados.

A aplicação se comunica com uma API REST configurada no projeto. O backend não faz parte deste repositório.

## Tecnologias

* Angular 21.2
* TypeScript 5.9
* Angular Material/CDK
* RxJS 7.8
* Jest 30
* `jest-preset-angular`
* Docker
* Nginx
* Node.js 22 Alpine no build Docker

## Funcionalidades

* Login com e-mail e senha.
* Autenticação utilizando JWT.
* Controle de acesso por perfil (`ADMIN` e `USER`).
* Listagem paginada de usuários.
* Filtro de usuários por nome e e-mail.
* Ordenação da listagem de usuários.
* Cadastro de usuários.
* Edição de usuários.
* Desativação de usuários.
* Visualização dos dados de auditoria dos usuários.
* Consulta e edição do próprio perfil.
* Consulta e gerenciamento de endereços do perfil.
* Validação dos campos dos formulários.
* Validação de CEP e número do endereço.
* Controle de endereço principal.
* Inclusão automática do token Bearer nas requisições autenticadas.
* Mensagens de feedback para operações de sucesso ou erro.

## Estrutura do projeto

O código da aplicação está organizado em `src/app`:

```text
src/app/
├── components/
│   ├── audit/
│   ├── feedback/
│   ├── sidebar/
│   └── user-dialog/
├── core/
│   └── services/
├── features/
│   ├── dashboard/
│   ├── login/
│   ├── perfil/
│   └── users/
├── guard/
├── layout/
└── app.routes.ts
```

A organização separa as funcionalidades de negócio em `features`, componentes reutilizáveis em `components`, serviços centrais em `core/services`, proteção de rotas em `guard` e o layout administrativo em `layout`.

## Autenticação

O login é realizado através do endpoint:

```text
POST /api/v1/auth/login
```

O frontend envia o e-mail e a senha e recebe o token JWT e o perfil do usuário.

O `AuthService` mantém o token e o perfil autenticado em memória.

O ID do usuário é obtido a partir do campo `sub` presente no payload do JWT.

O token não é persistido em `localStorage` ou `sessionStorage`. Dessa forma, ao recarregar a aplicação, a sessão mantida pelo frontend é encerrada.

A ação de logout remove os dados de autenticação mantidos em memória e redireciona o usuário para `/login`.

## Rotas e autorização

As principais rotas da aplicação são:

| Rota          | Acesso  | Descrição                     |
| ------------- | ------- | ----------------------------- |
| `/login`      | Público | Tela de autenticação          |
| `/admin`      | `ADMIN` | Layout da área administrativa |
| `/admin/user` | `ADMIN` | Gerenciamento de usuários     |
| `/perfil`     | `USER`  | Perfil e endereços do usuário |

As demais rotas são redirecionadas para `/login`.

O `autorizadoGuard` verifica a existência de autenticação e o perfil necessário para a rota.

Quando o usuário não possui o perfil exigido, ele é direcionado para a área correspondente ao seu perfil.

## Comunicação com a API

As requisições são realizadas utilizando o `HttpClient` do Angular.

A URL base atualmente configurada para a API está em:

```text
src/environments/environment.development.ts
```

Valor utilizado atualmente:

```text
http://localhost:8081
```

### Principais chamadas utilizadas

| Método   | Endpoint                        | Utilização                      |
| -------- | ------------------------------- | ------------------------------- |
| `POST`   | `/api/v1/auth/login`            | Autenticação                    |
| `GET`    | `/api/v1/users/list`            | Listagem paginada de usuários   |
| `POST`   | `/api/v1/users/create`          | Cadastro de usuário             |
| `GET`    | `/api/v1/users/{id}`            | Consulta de usuário             |
| `PATCH`  | `/api/v1/users/{id}`            | Atualização de usuário          |
| `PATCH`  | `/api/v1/users/{id}/deactivate` | Desativação de usuário          |
| `DELETE` | `/api/v1/endereco/{id}`         | Remoção/desativação de endereço |

A listagem de usuários utiliza os parâmetros de paginação e ordenação da API, além dos filtros de nome e e-mail.

Os filtros são enviados para a API quando o usuário aciona o botão **Filtrar**. Não existe filtragem local dos resultados.

### Interceptor HTTP

O frontend possui um interceptor funcional responsável por adicionar o cabeçalho:

```text
Authorization: Bearer <token>
```

às requisições enquanto houver um token autenticado em memória.

As respostas de erro utilizadas pelas telas consideram os campos retornados pela API, como `detail` ou `message`, apresentando mensagens de feedback ao usuário.

## Formulários e validações

O projeto utiliza diferentes abordagens de formulário conforme a funcionalidade.

### Login

A tela de login utiliza `FormsModule` e `ngModel` para controlar os campos de autenticação.

### Usuários

O diálogo de usuários utiliza Reactive Forms através de:

* `FormBuilder`;
* `FormGroup`;
* `FormArray`.

São realizadas validações para campos obrigatórios e formatos específicos.

Entre as validações existentes estão:

* nome obrigatório;
* telefone obrigatório;
* e-mail obrigatório no cadastro;
* formato do e-mail;
* senha obrigatória no cadastro;
* CEP obrigatório;
* número do endereço obrigatório;
* limite de um endereço definido como principal.

Durante a edição, campos como senha e e-mail somente são enviados quando preenchidos conforme as regras do formulário.

Os dados de rua, estado, cidade e bairro são exibidos como campos não editáveis no formulário de endereço.

## Testes

Os testes unitários do frontend utilizam:

* Jest;
* `jest-preset-angular`;
* `@angular-builders/jest`.

A configuração de execução dos testes está integrada ao Angular através do builder do Jest.

Os testes abrangem componentes, telas, serviços, guards e interceptor.

Para executar os testes:

```bash
npm test
```

## Execução local

### Pré-requisitos

* Node.js compatível com Angular 21;
* npm.

O projeto utiliza a versão local das dependências Angular, não sendo necessário instalar o Angular CLI globalmente.

### Instalação

Na pasta raiz do projeto:

```bash
npm install
```

### Executar em desenvolvimento

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:4200/
```

Para que login e operações de gerenciamento funcionem, a API backend deve estar disponível em:

```text
http://localhost:8081
```

### Build de produção

Para gerar o build da aplicação:

```bash
npm run build
```

Os arquivos gerados ficam no diretório `dist/`.

## Docker

O frontend possui um Dockerfile multi-stage para gerar e servir a aplicação Angular.

### Build da imagem

Na raiz do projeto:

```bash
docker build -f dockerfile -t angular-test .
```

### Executar o container

```bash
docker run --rm -p 4200:80 angular-test
```

Após iniciar o container, acesse:

```text
http://localhost:4200/
```

### Estrutura do Dockerfile

O build utiliza duas etapas:

1. **Build:** utiliza Node.js 22 Alpine para instalar as dependências e gerar o build de produção do Angular.
2. **Serviço:** utiliza Nginx Alpine para servir os arquivos estáticos gerados pelo Angular.

O Nginx está configurado para permitir o funcionamento das rotas do Angular através do fallback para `index.html`:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Configuração da API no Docker

A URL da API é definida durante o build através da configuração de ambiente atualmente utilizada pelo projeto.

O frontend utiliza:

```text
http://localhost:8081
```

O container do frontend não possui uma configuração de API em tempo de execução. Portanto, para utilizar todas as funcionalidades da aplicação, a API deve estar acessível nessa URL a partir do navegador.

## Configuração da API

A URL utilizada pelo frontend está definida em:

```text
src/environments/environment.development.ts
```

Atualmente:

```typescript
apiUrl: 'http://localhost:8081'
```

Não são utilizados arquivos `.env` nem mecanismos de configuração da URL da API em tempo de execução.

O projeto frontend não contém credenciais ou chaves privadas de API.

## Demonstração

Vídeo demonstrativo da aplicação:

**[Adicionar link após publicação]**

A demonstração apresenta as principais funcionalidades do frontend, incluindo autenticação, navegação por perfil, gerenciamento de usuários, formulários, endereços e execução da aplicação.

## Decisões técnicas

* Utilização de componentes standalone e configuração centralizada em `app.config.ts` e `app.routes.ts`.
* Organização das funcionalidades por meio de `features`.
* Separação de componentes reutilizáveis em `components`.
* Utilização de guards para proteção e autorização das rotas.
* Utilização de interceptor funcional para inclusão do JWT nas requisições.
* Estado de autenticação mantido em memória através do `AuthService`.
* Uso de `ngModel` para o formulário de login e Reactive Forms para o gerenciamento de usuários e endereços.
* Utilização de Jest para testes unitários.
* Utilização de Docker com build multi-stage e Nginx para publicação da aplicação.
* Configuração do Nginx com fallback para `index.html`, permitindo o funcionamento do Angular Router em produção.

## Estrutura resumida

```text
angular_Test/
├── public/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── core/
│   │   │   └── services/
│   │   ├── features/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── perfil/
│   │   │   └── users/
│   │   ├── guard/
│   │   └── layout/
│   ├── environments/
│   ├── main.ts
│   └── styles.css
├── .dockerignore
├── angular.json
├── dockerfile
├── jest.config.js
├── nginx.conf
├── package.json
└── tsconfig.json
```
