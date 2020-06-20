import { Component, ReactNode } from "react";
import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import VerticalAlign from "../../util/vertical-align/VerticalAlign";

import * as styles from "./AppHeader.module.scss";
import logo from "../../../img/logo_flat.png";
import { NavData } from "../../../classes/route-manager";

interface props extends RouteComponentProps {
  navData: NavData[],
}

class AppHeader extends Component<props> {
  public render(): ReactNode {
    return (
      <div className={ styles.appHeader }>
        <VerticalAlign>
          <img src={ logo } alt="OpenComputers Web Edit Logo" className={ styles.brandLogo } />
        </VerticalAlign>

        <VerticalAlign>
          <div className={ styles.brandText }>
            <Link to="/">OpenComputers Web Edit</Link>
          </div>
        </VerticalAlign>

        <nav className={ styles.headerNavigation }>
          { this.outputNavItems() }
        </nav>
      </div>
    );
  }

  private outputNavItems = (): ReactNode[] => {
    const pathname: string = this.props.location.pathname;

    return this.props.navData.map((navData: NavData, index: number) => {
      let className: string = styles.headerNavigationItem;
      if (pathname === navData.to) {
        className += ` ${ styles.headerNavigationItemCurrent }`;
      }

      return (
        <Link to={ navData.to } key={ `nav_${ index }` } className={ className }>
          <VerticalAlign>{ navData.label }</VerticalAlign>
        </Link>
      );
    });
  };
}

export default withRouter(AppHeader);
