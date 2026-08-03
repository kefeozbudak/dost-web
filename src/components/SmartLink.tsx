import React from 'react';
import { Link } from 'react-router-dom';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  url?: string;
  href?: string;
  to?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  target?: string;
  rel?: string;
}

export default function SmartLink({
  url,
  href,
  to,
  className,
  children,
  style,
  onClick,
  target,
  rel,
  ...props
}: SmartLinkProps) {
  const rawUrl = (url || href || to || '').trim();

  // 1. If empty or hash placeholder, prevent default page jump
  if (!rawUrl || rawUrl === '#') {
    return (
      <a
        href="#"
        className={className}
        style={style}
        onClick={(e) => {
          e.preventDefault();
          if (onClick) onClick(e);
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  // 2. External links (http://, https://, mailto:, tel:)
  if (/^(https?:\/\/|mailto:|tel:)/i.test(rawUrl)) {
    return (
      <a
        href={rawUrl}
        target={target || '_blank'}
        rel={rel || 'noopener noreferrer'}
        className={className}
        style={style}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  // 3. Internal SPA route navigation
  let internalPath = rawUrl;
  if (!internalPath.startsWith('/')) {
    internalPath = '/' + internalPath;
  }

  return (
    <Link
      to={internalPath}
      className={className}
      style={style}
      onClick={(e) => {
        if (onClick) onClick(e);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
