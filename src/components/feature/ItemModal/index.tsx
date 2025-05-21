import { MenuItem } from '@/type';
import styled from '@emotion/styled';
import Button from '@/components/Common/Button';
import Overlay from '@/components/Common/overlay';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type Props = {
  isModalOpen: boolean;
  handleModalClose: () => void;
  selectedItem: MenuItem;
};

const ItemModal = ({ isModalOpen, selectedItem, handleModalClose }: Props) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedTemp, setSelectedTemp] = useState<'HOT' | 'COLD' | null>(null);
  const [selectedSize, setSelectedSize] = useState<'S' | 'L' | null>(null);
  const [quantity, setQuantity] = useState(1);
  console.log(cartItems);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (
      selectedItem.option &&
      ((selectedItem.option.temperature && !selectedTemp) ||
        (selectedItem.option.size && !selectedSize))
    ) {
      alert('온도와 사이즈를 선택해주세요!');
      return;
    }

    dispatch(
      addItem({
        ...selectedItem,
        quantity,
        selectedTemp: selectedTemp ?? undefined,
        selectedSize: selectedSize ?? undefined,
        price: parseInt(selectedItem.price.replace(',', '')),
      })
    );
    handleModalClose();
  };

  return (
    <>
      <Overlay isOpen={isModalOpen} />
      <ModalContainer>
        <img
          src={selectedItem.img}
          style={{
            width: 'auto',
            height: '30%',
            objectFit: 'contain',
            alignSelf: 'center',
          }}
        />
        <InfoRow>
          <MenuName>{selectedItem.name}</MenuName>
          <QuantityBox>
            <QuantityButton onClick={decrease} style={{ cursor: 'pointer' }}>
              –
            </QuantityButton>
            <span style={{ color: 'black' }}>{quantity}</span>
            <QuantityButton onClick={increase} style={{ cursor: 'pointer' }}>
              +
            </QuantityButton>
          </QuantityBox>
          <Price>{selectedItem.price}원</Price>
        </InfoRow>
        {selectedItem.option?.temperature && (
          <OptionRow>
            <TempOptionRow>
              {selectedItem.option.temperature.map((temp) => (
                <TempButton
                  key={temp}
                  active={selectedTemp === temp}
                  onClick={() => setSelectedTemp(temp)}
                  color={temp === 'HOT' ? 'red' : 'blue'}
                >
                  {temp}
                </TempButton>
              ))}
            </TempOptionRow>
          </OptionRow>
        )}
        {selectedItem.option?.size && (
          <OptionRow>
            <Label>사이즈</Label>
            <TempOptionRow>
              {selectedItem.option.size.map((sz) => (
                <SizeBox
                  key={sz}
                  active={selectedSize === sz}
                  onClick={() => setSelectedSize(sz)}
                >
                  <img src="/icon _coffee cup_.svg" width={30} />
                  <span>{sz}</span>
                </SizeBox>
              ))}
            </TempOptionRow>
          </OptionRow>
        )}
        <ButtonWrapper>
          <Button size="large" theme="blue" onClick={handleAddToCart}>
            주문하기
          </Button>
          <Button size="large" theme="white" onClick={handleModalClose}>
            닫기
          </Button>
        </ButtonWrapper>
      </ModalContainer>
    </>
  );
};

export default ItemModal;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 999;
  background-color: white;
  width: 50vw;
  height: 60vh;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid black;

  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 1rem;
  margin-bottom: 2rem;
`;

const MenuName = styled.div`
  font-size: 1.3rem;
  color: black;
  font-weight: bold;
`;

const QuantityButton = styled.span`
  font-size: 1.3rem;
  width: 1.7rem;
  font-weight: bold;
  color: white;
  background-color: orange;
  border-radius: 8px;
`;

const QuantityBox = styled.div`
  display: flex;
  font-weight: bold;
  gap: 1rem;
  font-size: 1.2rem;
  align-items: center;
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  color: #007aff;
`;

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: raw;
  width: 100%;
  height: 20%;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;
const OptionRow = styled.div`
  display: flex;
  justify-content: flex-start; /* ← 왼쪽 정렬 */
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: center;
  padding: 0 5rem;
`;

const TempButton = styled.button<{ active: boolean; color: string }>`
  font-weight: bold;
  border: 2px solid ${({ color }) => color};
  color: ${({ color }) => color};
  background-color: ${({ active, color }) => (active ? color : 'white')};
  color: ${({ active }) => (active ? 'white' : '')};
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 2rem;
`;

const TempOptionRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex: 1;
`;

const Label = styled.div`
color:black;
  font-size: 1.3rem;
  font-weight: bold;
  margin-right: 1rem;
`;

const SizeOptionRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const SizeBox = styled.div<{ active: boolean }>`
  border: 2px solid ${({ active }) => (active ? '#007aff' : '#ccc')};
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  color: ${({ active }) => (active ? '#007aff' : '#333')};
`;
