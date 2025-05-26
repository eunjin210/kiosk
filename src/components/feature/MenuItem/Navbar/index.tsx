import styled from '@emotion/styled';
import { MenuCategoryType } from '@/type';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

type Props = {
  currentFilter: MenuCategoryType;
  setFilter: (category: MenuCategoryType) => void;
};
const categoryPairs: [MenuCategoryType, string][] = [
  ['COFFEE', '커피'],
  ['TEA', '차'],
  ['BEVERAGE', '음료'],
  ['DESSERT', '빵'],
];
const MenuNavbar = ({ currentFilter, setFilter }: Props) => {
  const selectType = useSelector((state: RootState) => state.mode);
  return (
    <Wrapper>
      <ScrollContainer>
        {categoryPairs.map(([eng, kor]) => (
          <CategoryButton
            key={eng}
            onClick={() => setFilter(eng)}
            className={currentFilter === eng ? 'active' : ''}
            selectType={selectType}
          >
            {selectType === 'default' ? eng : kor}
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

const CategoryButton = styled.button<{ selectType: 'default' | 'simple' }>`
  flex: 0 0 auto;
  // font-size: clamp(1rem, 3vw, 1.5rem);
  display: flex;
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

  font-size: ${({ selectType }) =>
    selectType === 'simple' ? '2rem' : 'clamp(1rem, 3vw, 1.5rem)'};

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
