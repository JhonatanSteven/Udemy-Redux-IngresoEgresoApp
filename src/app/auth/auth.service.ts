import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";

import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
import { User } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private afAuthService: AngularFireAuth,
    private route: Router,
    private afDB: AngularFirestore
  ) {}

  initAuthListener() {
    this.afAuthService.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
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
          .then(() => this.route.navigate(["/"]));
      })
      .catch(error => {
        console.error(error);
        Swal.fire("Error en el login", error.message, "error");
      });
  }
  login(email: string, password: string) {
    this.afAuthService.auth
      .signInWithEmailAndPassword(email, password)
      .then(resp => {
        console.log(resp);
        this.route.navigate(["/"]);
      })
      .catch(error => {
        console.error(error);
        Swal.fire("Error en el login", error.message, "error");
      });
  }
  logout() {
    this.route.navigate(["/login"]);
    this.afAuthService.auth.signOut();
  }
}
