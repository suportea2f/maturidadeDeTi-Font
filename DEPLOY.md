# Configuração de Deploy no Render

Este guia explica como configurar o deploy automático do frontend do projeto "Maturidade de TI" no Render.

## Passos para Deploy

1. Crie uma conta no [Render](https://render.com/) se você ainda não tiver uma.

2. No painel do Render, clique em "New +" e escolha a opção "Blueprint".

3. Conecte seu repositório GitHub e selecione o repositório do frontend.

4. O Render detectará automaticamente o arquivo `render.yaml` e configurará o serviço.

5. Clique em "Apply" para iniciar a implantação.

## Configuração de Variáveis de Ambiente

As variáveis de ambiente são definidas no arquivo `render.yaml`, mas você também pode adicionar variáveis de ambiente adicionais através da interface do Render:

1. No painel do Render, acesse o serviço "maturidade-ti-front".
2. Clique na aba "Environment".
3. Adicione as variáveis necessárias, como `REACT_APP_API_URL`.

## Verificar o Deploy

1. O Render fornecerá um URL para acessar sua aplicação (geralmente no formato `https://maturidade-ti-front.onrender.com`).
2. Acesse o URL para verificar se o deploy foi bem-sucedido.

## Deploy Manual

Se precisar fazer um deploy manual:

1. No painel do Render, acesse o serviço "maturidade-ti-front".
2. Clique no botão "Manual Deploy" e escolha "Deploy latest commit".

## Solução de Problemas

### Problemas de Compatibilidade de Dependências

Se você encontrar problemas relacionados a conflitos de dependências, como erros de "peer dependencies", siga estas etapas:

1. Verifique se as versões do React, React DOM e @types/react no arquivo `package.json` são compatíveis com as outras bibliotecas.
2. Utilizamos a flag `--legacy-peer-deps` no processo de build para contornar problemas de compatibilidade.
3. O projeto está configurado para usar Node.js 18.18.0 através do arquivo `.node-version`.

### Problemas de Roteamento

- Se o site estiver carregando, mas as rotas não estiverem funcionando, verifique se o arquivo `_redirects` está presente na pasta `public/`.
- Confirme se a configuração `routes` no `render.yaml` está redirecionando todas as solicitações para `/index.html`.

### Problemas de API

- Se a API não estiver respondendo, verifique se a variável de ambiente `REACT_APP_API_URL` está configurada corretamente.
- Verifique se a API está online e acessível através de uma ferramenta como o Postman ou cURL.

### Falhas de Build

- Consulte os logs do Render para identificar possíveis erros no processo de build ou deploy.
- Se o build estiver falhando devido a problemas de dependências, você pode tentar:
  1. Fazer um commit local utilizando os scripts `npm run clean` e `npm run clean:install`
  2. Ajustar as versões das dependências no `package.json` para garantir compatibilidade
  3. Fazer um push das alterações e iniciar um novo deploy 