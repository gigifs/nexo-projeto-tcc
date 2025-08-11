import styled from 'styled-components';
import { BolinhasContainer, Bolinha } from './Bolinhas.jsx'; 

const SectionContainer = styled.section`
    background-color: #F5FAFC;
    border-radius: 30px;
    padding-top: 20px;
    padding-bottom: 40px;
    margin: 50px auto;
    text-align: center;
    max-width: 1700px;
    scroll-margin-top: 80px;

    @media (max-width: 768px) {
      padding: 20px 20px 40px 20px;
    }
`;

const Titulo = styled.h2`
  font-size: 50px;
  color: #000000;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 40px;

  @media (max-width: 768px) {
      font-size: 44px;
    }
`;

const Paragrafo = styled.p`
  font-size: 28px;
  color: #000000;
  font-weight: 400;
  max-width: 1500px;
  margin: 0 auto; /* Centraliza o parágrafo */
  line-height: 1.4;

  @media (max-width: 768px) {
      font-size: 24px;
    }
`;

function SobreNos() {
  return (
    <SectionContainer id="sobre-nos">
      <Titulo>Sobre Nós</Titulo>
      <Paragrafo>
        Escolhemos desenvolver este aplicativo como projeto de TCC por acreditarmos na importância da colaboração no ambiente acadêmico. O app foi criado com o objetivo de facilitar a formação de grupos para trabalhos e projetos universitários, conectando estudantes com interesses e disponibilidades semelhantes. Sabemos que muitos alunos enfrentam dificuldades para encontrar colegas com afinidade acadêmica, o que pode comprometer o desempenho e a experiência de aprendizado. Ao propor uma solução prática, intuitiva e acessível, buscamos não apenas atender a uma demanda real nas universidades, mas também aplicar na prática os conhecimentos adquiridos ao longo do curso. Esse tema nos atraiu justamente por unir tecnologia, educação e impacto social positivo no cotidiano estudantil.
      </Paragrafo>
      <BolinhasContainer>
        <Bolinha color="rgba(35, 140, 215, 0.3)" />
        <Bolinha color="rgba(91, 130, 233, 0.3)" />
        <Bolinha color="rgba(215, 87, 180, 0.3)" />
      </BolinhasContainer>
    </SectionContainer>
  )
}

export default SobreNos;