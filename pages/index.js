import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


//Função para retornar a coluna do perfil - Independente se é o do usuario logado ou a visitar um perfil
function ProfileSidebar(propriedades) {
  console.log(propriedades);
  return (
    // Esse Box vai ser usado como um side bar e não div
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

//Componente para retornar os dados dentro das caixinhas brancas de seguidores, comunidades...
function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {/* O slice limita em 6 registros */}
        {propriedades.items.slice(0, 6).map((itemAtual) => {
           return (
            <li key={itemAtual.url}>
              <a href={itemAtual.html_url} key={itemAtual.id}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          )
         })}
      </ul>
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {

  //Gerenciador de Estados da variavel comunidade
  const [comunidades, setComunidades] = React.useState([
    {
      id: '1',
      title: 'Eu odeio acordar cedo',
      image: 'http://alurakut.vercel.app/capa-comunidade-01.jpg'
    }
  ]);

  const usuarioAleatorio = 'adnerscarpelini';
  //Usuarios amigos
  const pessoasFavoritas = [
    'omariosouto',
    'juunegreiros',
    'peas',
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

  //0 - Pegar o array de dados do github - Uso do Paulo Silveira, pois meu usuario nao tem seguidores =(
  //O comando fetch é um comando padrão dos navegadores para pegar dados de uma API. Ele retorna uma Promise, que retorna aos poucos as informações, pedaço por pedaço.
  // O useEffect é um Hook que serve para lidar com os efeitos. Podemos usá-los como os lifeCycles componentDidMount, componentDidUpdate e componentWillUnmount.
  // O useEffect() recebe como primeiro parâmetro uma função que será executada assim que o componente renderizar. 
  // De forma resumida: ele executa sempre que algo é atualizado
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function () {
    fetch('https://api.github.com/users/peas/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        //Quando termina a promise atualiza a variavel com o array
        setSeguidores(respostaCompleta);
      })
    //O vertor abaixo indica para quais variaveis ele deve olhar quando for alterada
    //Ai ele executa novamente. Se não passar esse parâmetro, sempre que tiver algum evendo ele vai rodar
  }, [])

  //1 - Criar um box que vai ter um map baseado nos itens do array do github
  return (
    <>
      <AlurakutMenu />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            {/* Intercepta o submit do form pra não dar refresh na pagina */}
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              //Adiciona os itens no array da comunidade
              const comunidade = {
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: dadosDoForm.get('image')
              }

              //Faz um Spread dos itens atuais mais o novo
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);

            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar Comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>

          {/* ::: SEGUIDORES ::: */}
          <ProfileRelationsBox title="Seguidores" items={seguidores} />

          {/* ::: COMUNIDADES ::: */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/users/${itemAtual.title}`} key={itemAtual.title}>
                      <img src={itemAtual.image} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>


          {/* ::: PESSOAS DA COMUNIDADE ::: */}
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}