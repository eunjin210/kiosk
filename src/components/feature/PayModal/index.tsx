import styled from '@emotion/styled';
import Overlay from '@/components/Common/overlay';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';

type Props = {
  isModalOpen: boolean;
  handleModalClose: () => void;
};

const PayModal = ({ isModalOpen, handleModalClose }: Props) => {
  const [isPaid, setIsPaid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isPaid) {
      dispatch(clearCart());
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isPaid, navigate]);

  const handlePayment = () => {
    setIsPaid(true);
  };
  return (
    <>
      <Overlay isOpen={isModalOpen} />
      <ModalContainer>
        {isPaid ? (
          <TextWrapper>
            <CheckImage src="/Check.svg" />
            <Text>
              결제가 완료되었습니다.
              <br />
              10초 후에 첫 화면으로
              <br />
              이동합니다.
            </Text>
          </TextWrapper>
        ) : (
          <>
            <Title>결제 방식을 선택해주세요</Title>
            <Wrapper>
              <ButtonWrapper onClick={handlePayment}>
                <ResponsiveImage src="/Card.svg" />
                <Text>현금 결제</Text>
              </ButtonWrapper>
              <ButtonWrapper onClick={handlePayment}>
                <ResponsiveImage src="/Cash.svg" />
                <Text>카드 결제</Text>
              </ButtonWrapper>
            </Wrapper>
          </>
        )}
      </ModalContainer>
    </>
  );
};

export default PayModal;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 999;
  background-color: white;
  width: 60vw;
  height: 60vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid white;

  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Title = styled.div`
  width: 100%;
  height: 20%
  font-weight: bold;
  font-size: 2rem;
  color: white;
  background-color:#213EBB;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: raw;
  width: 100%;
  height: 80%;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
const ButtonWrapper = styled.div`
  width: 45%;
  aspect-ratio: 1 / 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  border: 1px solid black;
`;
const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  border: 1px solid black;
`;

const ResponsiveImage = styled.img`
  width: 60%;
  max-width: 300px;
  height: auto;

  @media (max-width: 768px) {
    width: 80vw;
  }

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const CheckImage = styled.img`
  width: 30%;
  max-width: 300px;
  height: auto;

  @media (max-width: 768px) {
    width: 80vw;
  }

  @media (max-width: 480px) {
    width: 100vw;
  }
`;

const Text = styled.div`
  font-size: 3rem;
  color: black;
`;
