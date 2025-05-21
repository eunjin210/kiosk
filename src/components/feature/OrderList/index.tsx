import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateQuantity, removeItem } from '@/store/cartSlice';
import Button from '@/components/Common/Button';
import { useState } from 'react';
import PayModal from '../PayModal';
import Overlay from '@/components/Common/overlay';

const OrderList = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const handlePayModalClose = () => {
    setIsPayModalOpen(false);
  };

  const handleButtonClick = () => {
    setIsPayModalOpen(true);
  };

  if (isPayModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  const handleQuantityChange = (cartId: number, amount: number) => {
    const item = cartItems.find((i) => i.cartId === cartId);
    if (!item) return;
    const newQty = item.quantity + amount;
    if (newQty >= 1) dispatch(updateQuantity({ cartId, quantity: newQty }));
  };

  const handleRemove = (cartId: number) => {
    dispatch(removeItem(cartId));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Wrapper>
      <CartWrapper>
        <Left>
          <Title>🛒 담은 메뉴</Title>
          <List>
            {cartItems.map((item, index) => (
              <Item key={item.cartId}>
                <Text>
                  {index + 1}. {item.name}
                </Text>
                <Control>
                  <Button
                    theme="white"
                    size="medium"
                    onClick={() => handleQuantityChange(item.cartId, -1)}
                  >
                    –
                  </Button>
                  <span>{item.quantity}</span>
                  <Button onClick={() => handleQuantityChange(item.cartId, 1)}>
                    +
                  </Button>
                </Control>
                <span>{item.price * item.quantity}원</span>
                <Button onClick={() => handleRemove(item.cartId)}>X</Button>
              </Item>
            ))}
          </List>
        </Left>
        <Right>
          <Summary>
            총 결제 금액: <strong>{total.toLocaleString()}원</strong>
          </Summary>
          <PayButton onClick={handleButtonClick}>
            <img src="/Wallet.svg" width={50} />
            <div>결제하기</div>
          </PayButton>
          {isPayModalOpen && (
            <>
              <PayModal
                isModalOpen={isPayModalOpen}
                handleModalClose={handlePayModalClose}
              />
              <Overlay isOpen={isPayModalOpen} />
            </>
          )}
        </Right>
      </CartWrapper>
    </Wrapper>
  );
};

export default OrderList;

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30vh;
  background-color: white;
  padding: 1rem;
  z-index: 900;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const CartWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 100%;
  display: flex;
  background-color: white;
  border-top: 2px solid #eee;
`;

const Left = styled.div`
  width: 75%;
  padding-right: 1rem;
  overflow-y: auto;
`;

const Right = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-left: 1px solid #ddd;
  padding: 1rem 0;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
  gap: 1rem;
  font-size: 0.95rem;
  button {
    background: none;
    border: 1px solid #999;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
  }
`;

const Text = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.95rem;
  width: 30%;
`;

const Control = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const Summary = styled.div`
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  text-align: center;
`;

const PayButton = styled.button`
  height: 50%;
  width: 100%;
  background-color: #213EBB;
  color: white;
  font-size: 1.1rem;
  border: none;
  border-radius: 0px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column
  gap: 0.5rem;
`;
