## 🧠 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

- **Next.js** – Framework React para aplicações web full-stack, com suporte à renderização híbrida (SSR e SSG) e roteamento baseado em arquivos.  
- **Prisma** – ORM moderno para Node.js e TypeScript, facilitando a interação com o banco de dados.  
- **Tailwind CSS** – Framework de utilitários para estilização rápida, responsiva e altamente customizável.  
- **TypeScript** – Superset do JavaScript que adiciona tipagem estática, melhorando a escalabilidade e manutenção do código.  
- **SQLite** – Banco de dados leve e embutido, utilizado para persistência dos dados da aplicação.  
- **Jest** – Framework de testes utilizado para realizar testes unitários nos componentes do front-end.  

---

## 🚀 Como Rodar o Projeto

Para rodar o projeto localmente, é necessário seguir os seguintes passos:

- Executar o comando `npx prisma migrate dev --name init` para aplicar as migrações do banco de dados.  
- Executar o comando `npm install` para instalar as dependências.  
- Executar o comando `npm run dev` para iniciar o servidor de desenvolvimento.  

---

## ✅ Como Rodar os Testes Unitários

Para rodar os testes unitários, siga os seguintes passos:

- No arquivo `tsconfig.json`, verifique se a propriedade `"jsx"` está definida como `"react-jsx"`. Caso já esteja, essa etapa pode ser ignorada.  
- Executar o comando `npm test` para iniciar os testes.  
