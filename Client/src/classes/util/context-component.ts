import { Component, Context } from "react";

import { AppContext, AppContextType, ApplicationContext } from "../../components/core/context-provider/ContextProvider";

export default abstract class ContextComponent<P = {}, S = {}> extends Component<P, S> {
  static contextType: Context<ApplicationContext> = AppContext;
  declare context: AppContextType;
}
