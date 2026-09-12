# Git e Controle de Versão

## Inicializando Repositório

*git init* => Inicializa Repositório Git

## Configurando Usuário

*git config --global user.name "<user_name>"*   => Configura Nome de Usuário

*git config --global user.email "<user_email>"* => Configura Email do Usuário

## Configurando Repositório Remoto

*git branch --move master main* => Renomeia **master** para **main**

*git remote add origin https://github.com/yourusername/your-repository.git* => Conecta o Repositório LOCAL ao Repositório REMOTO

*git remote --verbose* => Verifica se a Conexão foi Criada.

*git push --set-upstream origin main* => Primeiro PUSH. Seta a **main** do REPOSITÓRIO REMOTO como uma STREAM para o REPOSITÓRIO LOCAL.

- Leitura(pull) e Escrita(push)

## Push and Pull

*git push <branch>* => Envia COMMITS para a BRANCH <branch> do Repositório Remoto

*git pull <branch>* => Puxa COMMITS da BRANCH <branch> do Repositório Remoto

## Staging e Commiting

*git add <file> | <directory> | .* => Adiciona Arquivos/Diretórios na Stage Area

*git add --patch* => Mapeia Iterativamente Cada Arquivo para Inserir ou Não Inserir na Stage Area

--patch : Patch Mode

*git commit --message "<commit_message>"* => Cria um Novo Commit (um ponto na linha do tempo do controle de versão)

### Working → Staging Area → Repository

## Status

*git status* => Retorna os Arquivos Modificados, Excluídos, Staging e Não Trackeados

## Good Practices

### Commit Messages

*feat:*  => Novo Recurso

*fix:*   => Correção de Bugs

*docs:*  => Criação ou Modificação de Documentação

*test:*  => Criação ou Modificação de Testes

*chore*: => Inserção / Modificação de Ferramentas, Dependências, Configurações
    
- chore : Pequena Tarefa

### Branches

- Branches são RAMOS criados ao longo do desenvolvimento.

- Servem para criar novas FEATURES, corrigir BUGS, etc.

*git branch* => Listar Branches e Branch ATUAL.

*git branch <branch_name>* => Cria Branch <branch_name>

*git switch <branch_name>* => Muda para Branch <branch_name>

*git switch --create <branch_name>* => Cria e Muda para a Branch <branch_name>

- Recomendado utilizar SWITCH ao invés de CHECKOUT para MUDANÇA DE BRANCHES.

- CHECKOUT para MUDANÇA NA LINHA DO TEMPO (commits)

*feat/*  => Branch Novo Recurso

*fix/*   => Branch Correção de Bugs

*docs/*  => Branch Criação ou Modificação de Documentação

*test/*  => Branch Criação ou Modificação de Testes

*chore*/ => Branch Inserção / Modificação de Ferramentas, Dependências, Configurações

## Merging

- Mesclar BRANCHES na MAIN. Aqui é que SURGEM os CONFLITOS.

*git switch main* => Mudar para a BRANCH main

*git merge <branch_name>* => Realiza um MERGE da BRANCH <branch_name>

### Fast Forward - Avanço Rápido

- Quando a MAIN não avançou com a BRANCH.

- O PONTEIRO da MAIN apenas MOVE para a BRANCH MAIS ATUAL.

- Avanço LINEAR.

main: A --- B --- C (head)   
                   \ 
feature:            D' --- E'



main: A --- B --- C --- D --- E (head)     


### Three Way Merge - Mesclagem de Três Vias

- Quando a MAIN AVANÇA junto com a BRANCH.

- É AQUI que ocorrem os CONFLITOS.

main: A --- B --- C --- E (head)   
                   \ 
feature:            D' --- F'



main: A --- B --- C --- D -- E -- F (head)

- Conflitos ocorrem quando DOIS (ou MAIS) DESENVOLVEDORES modificam o MESMO TRECHO DE CÓDIGO em COMMITS DIFERENTES.

- Basta Resolvê-los pela IDE (Integrated Development Environment)

- [ ] Revisar OUTROS COMANDOS e FUNÇÕES.