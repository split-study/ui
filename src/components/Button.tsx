import {
  FC,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ReactNode,
} from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { Loader } from '.';

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string;
};
type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  href?: undefined;
};

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isDisabled?: boolean;
  isLoading?: boolean;
} & (LinkProps | ButtonProps);

export const Button: FC<Props> = ({
  className,
  variant = 'primary',
  children,
  isDisabled = false,
  isLoading = false,
  ...props
}) => {
  const classNames = cn(className, 'p-2 rounded-md text-white transition-all', {
    'bg-green-500 hover:bg-green-600': variant === 'primary',
    'bg-blue-500 hover:bg-blue-600': variant === 'secondary',
    'bg-red-500 hover:bg-red-600': variant === 'danger',
    'pointer-events-none cursor-not-allowed opacity-50':
      isDisabled || isLoading,
  });

  const content = !isLoading ? children : <Loader size={20} />;

  if (props?.href) {
    const { href, ...restProps } = props;

    return (
      <Link to={href} {...restProps} className={classNames}>
        {content}
      </Link>
    );
  }

  return (
    // @ts-ignore
    <button
      {...props}
      className={classNames}
      disabled={isDisabled || isLoading}
    >
      {content}
    </button>
  );
};
