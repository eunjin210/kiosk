import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import Button from '@/components/Common/Button';
import Header from '@/components/Common/Header';
import { useDispatch } from 'react-redux';
import { setMode } from '@/store/modeSlice';

const LandingPage = () => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <Header></Header>
      <Link to="/home/menu">
        <Button
          size="xlarge"
          theme="blue"
          onClick={() => dispatch(setMode('default'))}
        >
          매장에서 먹어요
        </Button>
      </Link>
      <Link to="/home/menu">
        <Button
          size="xlarge"
          theme="blue"
          onClick={() => dispatch(setMode('simple'))}
        >
          포장해서 갈래요
        </Button>
      </Link>
      {/* <Link to="/accuracy">
        <Button
          size="xlarge"
          theme="blue"
          onClick={() => dispatch(setMode('simple'))}
        >
          정확도 분석
        </Button>
      </Link> */}
    </Wrapper>
  );
};
const Wrapper = styled.div`
  background-color: #213ebb;
  min-height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
    margin: 0;
    padding: 0;
  }
`;

export default LandingPage;
