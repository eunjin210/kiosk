import styled from '@emotion/styled';
import { FaHome } from 'react-icons/fa';
import { GrLanguage } from 'react-icons/gr';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Wrapper>
      <Link to="/">
        <ResponsiveFaHome color="#213ebb" />
      </Link>
      <ResponsiveGrLanguage color="#213ebb" />
    </Wrapper>
  );
};

export default Header;

const Wrapper = styled.header`
  width: 100vw;
  height: 3rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    height: 2.5rem;
  }

  @media (max-width: 480px) {
    height: 2rem;
  }
`;

const ResponsiveFaHome = styled(FaHome)`
  font-size: 2.5vw;
  margin: auto 0 auto 1vw;
  @media (max-width: 768px) {
    font-size: 5vw;
  }

  @media (max-width: 480px) {
    font-size: 7vw;
  }
`;

const ResponsiveGrLanguage = styled(GrLanguage)`
  font-size: 2.5vw;
  margin: auto 1vw auto 0;
  @media (max-width: 768px) {
    font-size: 5vw;
  }

  @media (max-width: 480px) {
    font-size: 7vw;
  }
`;
