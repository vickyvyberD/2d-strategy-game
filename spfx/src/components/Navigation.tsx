import * as React from 'react';
import { Nav, INavLinkGroup, INavLink } from '@fluentui/react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Dashboard',
          url: '/',
          key: 'dashboard',
          icon: 'Home',
        },
        {
          name: 'Transactions',
          url: '/transactions',
          key: 'transactions',
          icon: 'Money',
        },
        {
          name: 'Budget Planning',
          url: '/budget',
          key: 'budget',
          icon: 'Chart',
        },
      ],
    },
  ];

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement | HTMLDivElement>, item?: INavLink) => {
    if (item) {
      ev?.preventDefault();
      navigate(item.url);
    }
  };

  return (
    <Nav
      groups={navLinkGroups}
      selectedKey={location.pathname === '/' ? 'dashboard' : location.pathname.substring(1)}
      onLinkClick={onLinkClick}
      styles={{
        root: {
          width: 208,
          height: '100%',
          boxSizing: 'border-box',
          border: '1px solid #edebeb',
          overflowY: 'auto',
        },
      }}
    />
  );
};

export default Navigation; 