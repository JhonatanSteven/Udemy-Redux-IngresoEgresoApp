import * as fromUI from "./shared/ui.reducer";
import * as fromAuth from "./auth/auth.reducer";
import { ActionReducerMap } from "@ngrx/store";

export interface AppSate {
  ui: fromUI.State;
  auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppSate> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer
};
