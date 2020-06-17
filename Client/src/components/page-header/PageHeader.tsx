import { Component, ReactNode } from "react";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import VerticalAlign from "../vertical-align/VerticalAlign";

import * as styles from "./PageHeader.module.scss";
import logo from "../../img/logo_flat.png";

interface NavItem {
  label: string,
  to: string,
}

const navItems: NavItem[] = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Test Tools",
    to: "/test",
  },
];

class PageHeader extends Component<RouteComponentProps<any>> {
  public render(): ReactNode {
    return (
      <div className={ styles.pageHeader }>
        <VerticalAlign>
          <img src={ logo } alt="OpenComputers Web Edit Logo" className={ styles.brandLogo } />
        </VerticalAlign>

        <VerticalAlign>
          <div className={ styles.brandText }>OpenComputers Web Edit</div>
        </VerticalAlign>

        <nav className={ styles.headerNavigation }>
          { this.outputNavItems() }
        </nav>
      </div>
    );
  }

  private outputNavItems = (): ReactNode[] => {
    const pathname: string = this.props.location.pathname;

    return navItems.map((navItem: NavItem, index: number) => {
      let className: string = styles.headerNavigationItem;
      if (pathname === navItem.to) {
        className += ` ${ styles.headerNavigationItemCurrent }`;
      }

      return (
        <Link to={ navItem.to } key={ `key_${ index }` } className={ className }>
          <VerticalAlign>{ navItem.label }</VerticalAlign>
        </Link>
      );
    });
  };
}

export default withRouter(PageHeader);
