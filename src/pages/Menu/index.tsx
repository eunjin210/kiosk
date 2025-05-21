import Header from '@/components/Common/Header';
import styled from '@emotion/styled';
import MenuNavbar from '@/components/feature/MenuItem/Navbar';
import { useEffect, useState } from 'react';
import { MenuItem, MenuCategoryType } from '@/type';
import CommonGrid from '@/components/Common/Grid';
import OrderList from '@/components/feature/OrderList';
import ItemModal from '@/components/feature/ItemModal';
import Overlay from '@/components/Common/overlay';
const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [filter, setFilter] = useState<MenuCategoryType>('COFFEE');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem>([]);

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

  return (
    <Wrapper>
      <Header />
      <MenuNavbar currentFilter={filter} setFilter={setFilter} />
      <Content>
        <CommonGrid
          columns={4}
          gap={'2rem'}
          style={{ margin: '0 auto', paddingTop: '2rem' }}
        >
          {filteredMenu.map((item) => (
            <ItemBox key={item.id} onClick={() => handleCardClick(item)}>
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '260px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
              <h4>{item.name}</h4>
              <p>{item.price}원</p>
            </ItemBox>
          ))}
        </CommonGrid>
      </Content>
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
      <OrderList />
    </Wrapper>
  );
};

export default MenuPage;

const Wrapper = styled.div`
  background-color: #213ebb;
  // min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;
const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ItemBox = styled.div`
  width: 80%;
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
