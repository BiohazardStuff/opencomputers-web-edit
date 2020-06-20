import { RouteProps } from "react-router";
import { Switch, Route } from "react-router-dom";
import * as React from "react";
import { ComponentClass, createElement, ReactElement, ReactNode } from "react";

interface EnforcedRouteProps extends RouteProps {
  path: string,
}

interface RouteData {
  label: string,
  component: ComponentClass,
  props: EnforcedRouteProps,
}

export interface NavData {
  label: string,
  to: string,
}

export default class RouteManager {
  private _routeData: RouteData[];

  constructor() {
    this._routeData = [];
  }

  public registerRoute(label: string, component: ComponentClass, props: EnforcedRouteProps): void {
    this._routeData.push({
      label,
      component,
      props
    });
  }

  public outputSwitch(): ReactNode {
    return (
      <Switch>
        { this.outputRoutes() }
      </Switch>
    );
  }

  private outputRoutes(): ReactElement<RouteProps>[] {
    return this._routeData.map((routeData: RouteData, index: number) => {
      if (routeData.props.exact === undefined) {
        routeData.props.exact = true;
      }

      return (
        <Route key={ `route_${ index }` } { ...routeData.props }>
          { createElement(routeData.component) }
        </Route>
      );
    });
  }

  public getNavData(): NavData[] {
    return this._routeData.map(routeData => {
      return {
        label: routeData.label,
        to: routeData.props.path,
      }
    })
  }
}
