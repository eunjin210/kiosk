import Header from '@/components/Common/Header';
import styled from '@emotion/styled';
import MenuNavbar from '@/components/feature/MenuItem/Navbar';
import { useEffect, useState } from 'react';
import { MenuItem, MenuCategoryType } from '@/type';
import CommonGrid from '@/components/Common/Grid';
import OrderList from '@/components/feature/OrderList';
import ItemModal from '@/components/feature/ItemModal';
import Overlay from '@/components/Common/overlay';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useRef } from 'react';

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState<MenuCategoryType>('COFFEE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>([]);

  const selectType = useSelector((state: RootState) => state.mode);
  const columns = selectType === 'default' ? 4 : 3;

  useEffect(() => {
    fetch('/mock/menuData.json')
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const handleCardClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    console.log(item);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (isModalOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  const filteredMenu =
    filter === 'ALL'
      ? menu
      : menu.filter((item) => item.category === filter.toLowerCase());

  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    fetch('/mock/menuData.json')
      .then((res) => res.json())
      .then((data) => setMenu(data));
  }, []);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    setIsAtBottom(nearBottom);
  };

  const scrollTo = () => {
    const el = contentRef.current;
    if (!el) return;
    if (isAtBottom) {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <Wrapper>
      <Header />
      <MenuNavbar currentFilter={filter} setFilter={setFilter} />
      <Content ref={contentRef} onScroll={handleScroll}>
        <CommonGrid
          columns={columns}
          gap={'2rem'}
          style={{ margin: '0 auto', paddingTop: '2rem' }}
        >
          {filteredMenu.map((item) => (
            <ItemBox key={item.id} onClick={() => handleCardClick(item)}>
              <ItemImage src={item.img} alt={item.name} mode={selectType} />
              <Name mode={selectType}>{item.name}</Name>
              <Price mode={selectType}>{item.price}원</Price>
            </ItemBox>
          ))}
        </CommonGrid>
      </Content>
      <ScrollButton onClick={scrollTo}>
        {isAtBottom ? (
          <ScrollImg src="/up.svg" />
        ) : (
          <ScrollImg src="/down.svg" />
        )}
      </ScrollButton>
      {isModalOpen && (
        <>
          <ItemModal
            isModalOpen={isModalOpen}
            selectedItem={selectedItem}
            handleModalClose={handleModalClose}
          />
          <Overlay isOpen={isModalOpen} />
        </>
      )}
      <OrderList mode={selectType} />
    </Wrapper>
  );
};

export default MenuPage;

const Wrapper = styled.div`
  background-color: #213ebb;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;
const Content = styled.main`
  width: 100%;
  position: relative;
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ItemBox = styled.div`
  width: 90%;
  background-color: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    width: 180px;
    padding: 0.9rem;
  }

  @media (max-width: 768px) {
    width: 160px;
    padding: 0.8rem;
  }

  @media (max-width: 480px) {
    width: 140px;
    padding: 0.75rem;
  }
`;

const ItemImage = styled.img<{ mode: 'default' | 'simple' }>`
  width: 100%;
  height: ${({ mode }) => (mode === 'simple' ? '340px' : '260px')};
  object-fit: contain;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: ${({ mode }) => (mode === 'simple' ? '280px' : '220px')};
  }
`;

const Name = styled.h4<{ mode: 'default' | 'simple' }>`
  font-size: ${(props) => (props.mode === 'default' ? '1.5rem' : '1.8rem')};
  color: black;
  margin: 0;
`;

const Price = styled.p<{ mode: 'default' | 'simple' }>`
  font-size: ${(props) => (props.mode === 'default' ? '1.5  rem' : '1.8rem')};
  color: ${(props) => (props.mode === 'default' ? 'black' : '#007aff')};
  font-weight: ${(props) => (props.mode === 'default' ? 'none' : 'bold')};
  margin: 10px;
`;

const ScrollButton = styled.button`
  position: fixed;
  right: 2rem;
  bottom: 40rem;
  width: 130px;
  height: 130px;
  background-color: #white;
  font-size: 1.5rem;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  &:hover {
    color: white;
    border: none;
  }
  outline: none;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
  }
`;

const ScrollImg = styled.img`
  width: 150px;
  height: 150px;
  color="#213ebb"
`;
