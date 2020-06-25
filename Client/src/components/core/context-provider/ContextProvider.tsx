import { Component, Context, ContextType, createContext, ReactNode } from "react";
import * as React from "react";

import WebEditClient from "../../../classes/web-edit-client";

export interface ApplicationContext {
  client: WebEditClient,
  development: boolean,
}

const appContext: ApplicationContext = {
  client: new WebEditClient(),
  development: process.env.NODE_ENV === "development",
};

export const AppContext: Context<ApplicationContext> = createContext<ApplicationContext>(appContext);

export type  AppContextType = ContextType<typeof AppContext>;

export default class ContextProvider extends Component {
  public render(): ReactNode {
    return (
      <AppContext.Provider value={ appContext }>
        { this.props.children }
      </AppContext.Provider>
    );
  }
}
