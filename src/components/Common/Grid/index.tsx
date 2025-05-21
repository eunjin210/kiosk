import styled from '@emotion/styled';

type Props = {
  columns: number;
  gap?: number | string;
} & React.HTMLAttributes<HTMLDivElement>;

const CommonGrid: React.FC<Props> = ({
  children,
  columns,
  ...props
}: Props) => {
  return (
    <Wrapper columns={columns} {...props}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<Pick<Props, 'columns' | 'gap'>>(
  {
    display: 'grid',
  },
  ({ gap }) => ({
    gap: typeof gap === 'number' ? `${gap}px` : (gap ?? '0'),
  }),
  ({ columns }) => {
    if (typeof columns === 'number') {
      return {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      };
    }
  }
);

export default CommonGrid;
