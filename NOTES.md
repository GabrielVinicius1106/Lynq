# Lynq - AI Agent App

## Config - Package.JSON - Updating Dependencies

- Podemos utilizar o objeto *overrides* para atualizar dependências de dependências (frameworks, bibliotecas, etc.)

```
"overrides": {
    <dependency>: <version>
}
```

- Instalamos novamente com

```bash
npm install
```

## Padrão de Arquitetura em Camadas

- Boa prática realizar o desenvolvimento das camadas de MAIS BAIXO NÍVEL, para ALTO NÍVEL

1. Banco de Dados - Modelar e Definir Entidades
2. Services       - Criar Lógica e Regras de Negócio
3. Controller     - Comunicação com a API
4. Repositories   - Lógica de Operações no Banco de Dados
5. Providers      - Serviços Externos ( ex. email_provider )

## Authentication / Authorization Principles

- *Autenticação:* Verificar Identidade de um USUÁRIO.

- *Autorização:* Verificar se o USUÁRIO AUTENTICADO possui PERMISSÃO para ACESSAR ALGUM RECURSO.

## Stateless and JWT (Json Web Token)

- No passado, aplicações utilizavam *Sessões* (Stateful). Criava-se um ID na Memória, e esse ID era enviado por Cookies.

- Ruim para *Escalabilidade*

- **JWT** possui uma *Arquitetura Stateless*

1. Login (email e senha)

2. Validação e Criação de JWT *Documento assinado DIGITALMENTE* *Contém INFORMAÇÕS DO USUÁRIO*

3. Envio de JWT p/ Client

4. Client envia o JWT em TODA REQUISIÇÃO. Servidor valida MATEMATICAMENTE o TOKEN.

## Estrutura do JWT

- String DIVIDIDA em TRÊS PARTES.
    > *Header.Payload.Signature*

    > **Header:** Defino o TIPO DO TOKEN e o ALGORITMO DE CRIPTOGRAFIA UTILIZADO (HMAC SHA256)
    > **Payload:** Dados do Usuário
    > **Signature:** Utiliza uma CHAVE SECRETA para APLICAR UM HASH no Header + Payload

- Utilizamos CLAIMS no PAYLOAD, como MÉTODO DE TRANSFERIR INFORMAÇÃO:
    > Subject (user_id): <sub>
    > JWT ID           : <jti>

import { jwt } from "jsonwebtoken"

const token = jwt.sign(<payload>, <JWT_SECRET>, <expires_in>)

## Idempotência

- Propriedade de APIs RESTful onde para determinado RECURSO, 1 ou 100 REQUISIÇÕES produzem o MESMO EFEITO.  

- Propriedade FAMOSA de MATEMÁTICA DISCRETA.


## Global Error Handler

- *Global Error Handler*
- app.setErrorHandler((error, _, res: FastifyReply) => {

    if(error instanceof ZodError){
        return res.status(400).send({
            message: "Validation Error.",
            issues: z.treeifyError(error)
        })
    }

    if(env.NODE_ENV != "development"){
        console.log(error);
    } else {
        // SOME TOOLING to WATCH THE ERRORS in PRODUCTION
    }

    return res.status(500).send({
        message: "Internal Server Error."
    })


 })


## Redis

- **Remote Dictionary Server** = **REDIS**

- Armazenamento de Estrutura de Dados em Memória RAM
    > Banco de Dados
    > Cache
    > Message Broker
    > Black List
    > etc.


- *Básico*: <Chave:Valor>

- Permite MAIS ESTRUTURAS: <listas>, <hashes>, <dados_geospaciais>

- Para Conexão, utilizamos a BIBLIOTECA **redis**

- **CreateClient:**

- *Conecta na PORTA 6379*

import { createClient } from "redis"

const client = await createClient().on("error", (error) => console.log(error)).connect()

export { client }

### Black List

- **Logout:**

-   1. O Servidor recebe o Access Token

-   2. Cálculo do Tempo de Vida *Quanto tempo o token deve ser mantido na Black List?*

-   3. Salvar no Redis

- TODA Requisição passa por um *Middleware*, que valida se o Access Token está na Black List

- Se o Access Token estiver na Black List => *Error 401 Unauthorized*

- Para Acessar os HEADERS da Requisição:

-    *const headers = req.headers*

- *Busca na Black List*

if(await redis.get(access_token)) return res.status(401).send({ message: "Unauthorized." })

## ===========================================================================

- O Método *.forEach()* executa uma função de CALLBACK para CADA ELEMENTO de um VETOR. 

- Não RETORNA UM NOVO VETOR.

## Testing

- Implementar uma Aplicação Redis Like para usar nos TESTES. *Acabei usando o Próprio REDIS mesmo*


## Cookies

- Um Cookie é um PEDAÇO DE DADO que o SERVIDOR CRIA NO NAVEGADOR. Utiliza o RESPONSE HEADER: 
    > *Set-Cookie*

- Cada REQUISIÇÃO do CLIENT para o SERVER é feita UTILIZANDO o HEADER:
    > *Cookie*

### Flags de Segurança Chaves

- *httpOnly* : <true> => *JS não pode LER* *Bloqueia ATAQUES de XSS*

- *secure* : <true> => *Envia pelo PROTOCOLO HTTPS*

- *sameSite* : <strict> => *Envia APENAS de ORIGEM SEMELHANTE* *Bloqueia ATAQUES de CSRF*

- *path* : </api/v1/auth> => *Cria um ESCOPO de ENVIO para o Cookie*

- *maxAge* : <expires> => *Quanto TEMPO o Navegador ARMAZENA O COOKIE*

- [ ] O que é XSS?
- [ ] O que é CSRF?

## Fastify's Cookies Plugin

- O Fastify não possui SUPORTE NATIVO a Cookies. Instalamos:
    > *npm install @fastify/cookie*

- E registramos como PLUGIN. **app.register()**

- **Setar um Cookie**:
    > res.setCookie("refresh_token", value, { options })

- **Ler um Cookie**:
    > res.cookies.refresh_token

- **Apagar um Cookie**:
    > res.clearCookie("refresh_token")


## Non-Null Assertion

- Operador que GARANTE ao *Typescript* que um ELEMENTO NÃO É NULO.

- const value = getSomething()! => *Garante ao TS que é um RETORNO VÁLIDO*

## Fastify's Decorators

- Alterar OBJETOS NATIVOS DO FASTIFY.

- Como uma *Instância*, *Requisição* ou *Response*

- Precisamos EXPLICITAR o NOVO TIPO FastifyRequest:
    declare module "fastify" {
        interface FastifyRequest {
            user_id: string *Define o NOVO ATRIBUTO user_id para o Typescript*
        }
    }

- No APP: app.decorateRequest("user_id")

- **Example**:

- const decoded = jwt.verify(access_token, env.JWT_SECRET) as JwtPayload            

- const id = decoded.sub

- if(!id) return res.status(401).send("Unauthorized.")

- req.user_id = id

## Database Indexing

- Conforme o NÚMERO DE REGISTROS em um BD crescem, a performance e a velocidade com que ele consegue BUSCA INFORMAÇÕES DIMINUEM

- Estrutura de Otimização do Banco de Dados

- Baseia-se em uma *Balanced Tree*, para BUSCAR por REGISTROS de forma MAIS EFICIENTE

- *EXPLAIN ANALYZE* : Escaneia a PERFORMANCE de uma QUERY

- Implementar Índice FULLTEXT para BUSCAS OTIMIZADAS.

- [ ] Implementar quando COLOCAR EM PRODUÇÃO

## Password Recovery

- Inicia-se enviando simplesmente o EMAIL para o SERVIDOR.

- O SERVIDOR irá buscar pelo usuário com este EMAIL, caso exista.

- Se não existir, aborta e retorna uma mensagem genérica:
    > "If there's an account with this email, we've sent a recovery link"

- Ao encontrar o USUÁRIO, irá gerar um *CÓDIGO ALEATÓRIO* de 6 DÍGITOS *OTP*

- Criar *Hash do OTP*

- Após isso, devemos gerar um TOKEN IDENTIFICADOR ÚNICO para a REQUISIÇÃO.
    > Basta ser ÚNICO e ALEATÓRIO
    > Pode-se utilizar UUIDs

- Devemos ARMAZENAR este TOKEN em uma TABELA
    
    > RECOVERY_PASSWORD_TOKENS 
        > id
        > user_id
        > created_at
        > used_at
        > expires_at
        > code_hash
        > remaining_attempts

- Após isso, enviamos o EMAIL, com o *OTP* e o LINK para RECUPERAÇÃO com o *TOKEN IDENTIFICADOR*

- Quando o usuário ACESSAR O LINK, é redirecionado para a PÁGINA DE VALIDAÇÃO.

- Inserir o *OTP* e ENVIAR PARA O SERVIDOR junto com o *TOKEN IDENTIFICADOR*

- Nessa parte, o SERVIDOR BUSCA por este TOKEN no BANCO DE DADOS para VALIDAR

- Valida HASH do CÓDIGO e TTL do TOKEN 

- Com o *OTP* VALIDADO redirecionar para RECUPERAÇÃO DE SENHA.

- Inserir a *NOVA SENHA* e ENVIAR PARA O SERVIDOR com o *TOKEN IDENTIFICADOR*

- Busca novamente pelo TOKEN, e realiza a ATUALIZAÇÃO DA SENHA.

### Pontos Críticos

- [X] Brute Force de OTP - Caso o Atacante DESCUBRA O TOKEN. Implementar NÚMERO MÁXIMO DE TENTATIVAS.

- [X] Vasamento de Token Não Usado - Implementar TTL no Token

- [ ] Reuso de TOKEN - Invalidar o TOKEN quando SUCESSO ou TTL Excedido

- [ ] Chutes de OTP - O Atacante possui 3 CHANCES para ACERTAR. É uma probabilidade baixa, mas não NULA

## Dates em JS

- Podemos criar uma data qualquer com a seguinte estrutura

```js
const date = new Date(Date.now() + <miliseconds>)
```

- O valor <miliseconds> pode ser qualquer NÚMERO INTEIRO

## Provider Pattern

- *Design Patter* = *Padrão de Projeto*

- *Padrão de Projeto* que abstrai a implementação por trás de um recurso/serviço, utilizando uma interface padrão para utilização de tal recurso/serviço

- Aumenta MODULARIDADE, FLEXIBILIDADE, MANUTENABILIDADE e CRIAÇÃO DE TESTES

- Diminui o ACOPLAMENTO entre SERVIÇOS DA APLICAÇÃO e SERVIÇOS EXTERIORES

## Email Provider

- *Mailtrap*

- Plano GRATUITO para até 4000 EMAILS

1. Gerar API_KEY

2. Instalar Dependências: *npm install mailtrap*

3. POST https://send.api.mailtrap.io/api/send

4. {


   }

## Non-Null Assertion Operator

- Operador usado para quando temos a certeza de que um objeto não é NULL e nem UDEFINED.

- const number_attemps = this.recoveryPasswordTokens[idx]!.number_attempts


## Google OAuth


## Chat Architecture and Design