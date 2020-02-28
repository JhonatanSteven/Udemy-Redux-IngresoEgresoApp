import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { map } from "rxjs/operators";

import Swal from "sweetalert2";
import { User } from "./user.model";
import { AppSate } from "../app.reducer";
import { Store } from "@ngrx/store";
import { SetUserAction } from "./auth.actions";
import { Subscription } from "rxjs";
import {
  ActivarLoadingAction,
  DesactivarLoadingAction
} from "../shared/ui.acciones";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private userSubscription: Subscription = new Subscription();
  constructor(
    private afAuthService: AngularFireAuth,
    private route: Router,
    private afDB: AngularFirestore,
    private store: Store<AppSate>
  ) {}

  initAuthListener() {
    this.afAuthService.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.userSubscription = this.afDB
          .doc(`${fbUser.uid}/usuario`)
          .valueChanges()
          .subscribe((usuarioObj: any) => {
            const newUser = new User(usuarioObj);
            this.store.dispatch(new SetUserAction(newUser));
          });
      } else {
        this.userSubscription.unsubscribe();
      }
    });
  }
  isAuth() {
    return this.afAuthService.authState.pipe(
      map(fbUser => {
        if (fbUser == null) {
          this.route.navigate(["/login"]);
        }
        return fbUser != null;
      })
    );
  }

  crearUsuario(name: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());

    this.afAuthService.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {
        const user: User = {
          nombre: name,
          email: resp.user.email,
          uid: resp.user.uid
        };

        this.afDB
          .doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.route.navigate(["/"]);
            this.store.dispatch(new DesactivarLoadingAction());
          });
      })
      .catch(error => {
        console.error(error);
        Swal.fire("Error en el login", error.message, "error");
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }
  login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuthService.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log(resp);
        this.route.navigate(["/"]);
        this.store.dispatch(new DesactivarLoadingAction());
      })
      .catch(error => {
        console.error(error);
        Swal.fire("Error en el login", error.message, "error");
        this.store.dispatch(new DesactivarLoadingAction());
      });
  }
  logout() {
    this.route.navigate(["/login"]);
    this.afAuthService.auth.signOut();
  }
}
