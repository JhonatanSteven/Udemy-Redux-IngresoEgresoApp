import * as fromUI from "./ui.acciones";
export interface State {
  isLoading: boolean;
}
const initState: State = {
  isLoading: false
};

export function uiReducer(state = initState, action: fromUI.acciones) {
  switch (action.type) {
    case fromUI.ACTIVAR_LOADING:
      return {
        isLoading: true
      };
    case fromUI.DESACTIVAR_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}
