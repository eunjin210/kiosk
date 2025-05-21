import styled from '@emotion/styled';
import { MenuCategoryType } from '@/type';

type Props = {
  currentFilter: MenuCategoryType;
  setFilter: (category: MenuCategoryType) => void;
};
const categories: MenuCategoryType[] = ['COFFEE', 'TEA', 'BEVERAGE', 'DESSERT'];
const MenuNavbar = ({ currentFilter, setFilter }: Props) => {
  return (
    <Wrapper>
      <ScrollContainer>
        {categories.map((cat) => (
          <CategoryButton
            key={cat}
            onClick={() => setFilter(cat)}
            className={currentFilter === cat ? 'active' : ''}
          >
            {cat}
          </CategoryButton>
        ))}
      </ScrollContainer>
    </Wrapper>
  );
};

export default MenuNavbar;

const Wrapper = styled.header`
  width: 100vw;
  height: 3rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding-top: 3rem;

  @media (max-width: 768px) {
    height: 3.5rem;
    padding-top: 2.5rem;
  }

  @media (max-width: 480px) {
    height: 3rem;
    padding-top: 2rem;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 3rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 768px) {
    gap: 2rem;
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    padding: 0.5rem;
  }
`;

const CategoryButton = styled.button`
  flex: 0 0 auto;
  font-size: clamp(1rem, 3vw, 1.5rem);
  display: flex
  align-items: center;
  justify-content: center;
  height: 3rem;

  background-color: transparent;
  border: none;
  font-weight: bold;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  color: black;

  &.active {
    background-color: #213ebb;
    color: white;
    border: none;
    border-bottom: none;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    outline: none;
  }
    
  &:focus {
    outline: none;
  }

    @media (max-width: 768px) {
    height: 2.8rem;
    font-size: clamp(0.9rem, 3vw, 1.3rem);
  }

  @media (max-width: 480px) {
    height: 2.5rem;
    font-size: clamp(0.85rem, 3vw, 1.2rem);
  }
`;

const NextButton = styled.button`
  position: relative;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin: 0 2.5rem 0 3rem;
  @media (max-width: 768px) {
    font-size: 1.3rem;
    width: 35px;
    margin: 0 1.8rem 0 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    width: 30px;
    margin: 0 1.2rem 0 1.5rem;
  }
`;
