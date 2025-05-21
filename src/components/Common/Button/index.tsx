import styled from '@emotion/styled';

type Props = {
  theme?: 'normal' | 'blue' | 'white';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Props> = ({ ...props }: Props) => {
  return <Container {...props} />;
};

const Container = styled.button<Pick<Props, 'theme' | 'size'>>(
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 200ms',
    padding: '0 16px',
    width: 'auto',
    margin: '10px',
  },
  ({ size = 'medium' }) => {
    if (size === 'small') {
      return {
        borderRadius: '10px',
        height: '20px',
        fontSize: '10px',
      };
    }
    if (size === 'large') {
      return {
        borderRadius: '20px',
        height: '100px',
        fontSize: '50px',
      };
    }
    if (size === 'xlarge') {
      return {
        borderRadius: '20px',
        padding: '50px',
        height: '200px',
        fontSize: '80px',
        '@media (max-width: 768px)': {
          height: '140px',
          fontSize: '50px',
        },

        '@media (max-width: 480px)': {
          height: '80px',
          fontSize: '32px',
        },
      };
    }
    return {
      borderRadius: '15px',
      height: '25px',
      fontSize: '15px',
    };
  },

  ({ theme = 'normal' }) => {
    if (theme === 'blue') {
      return {
        boxShadow: '0 0 0 1px #ccc inset',
        color: '#ffff',
        backgroundColor: '#213EBB',
        border: '2px solid #ffff',
        outline: 'none',

        '&:hover': {
          backgroundColor: '#1A2F91',
          border: '2px solid #ffff',
        },
      };
    }
    if (theme === 'white') {
      return {
        boxShadow: '0 0 0 1px #ccc inset',
        color: '#213EBB',
        backgroundColor: '#ffff',
        border: '2px solid #213EBB',
        outline: 'none',

        '&:hover': {
          backgroundColor: '#ffff',
          border: '2px solid #213EBB',
        },
      };
    }
    return {
      color: '#000',
    };
  }
);

export default Button;
