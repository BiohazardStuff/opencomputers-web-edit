import { Component, Context, ContextType } from "react";

import { AppContext, ApplicationContext } from "../../components/core/context-provider/ContextProvider";

export default abstract class ContextComponent<P = {}, S = {}> extends Component<P, S> {
  static contextType: Context<ApplicationContext> = AppContext;
  declare context: ContextType<typeof AppContext>;
}
