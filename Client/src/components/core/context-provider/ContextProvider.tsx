import { Component, Context, createContext, ReactNode } from "react";
import * as React from "react";

import WebEditClient from "../../../classes/web-edit-client";

export interface ApplicationContext {
  client: WebEditClient,
}

const appContext: ApplicationContext = {
  client: new WebEditClient(),
};

export const AppContext: Context<ApplicationContext> = createContext<ApplicationContext>(appContext);

export default class ContextProvider extends Component {
  public render(): ReactNode {
    return (
      <AppContext.Provider value={ appContext }>
        { this.props.children }
      </AppContext.Provider>
    );
  }
}
