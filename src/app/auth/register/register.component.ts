import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth.service";
import { AppSate } from "../../app.reducer";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscription: Subscription;
  constructor(
    private authService: AuthService,
    private store: Store<AppSate>
  ) {}

  ngOnInit() {
    this.subscription = this.store.select("ui").subscribe(ui => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data: any) {
    this.authService.crearUsuario(data.nombre, data.email, data.password);
    console.log("Register", data);
  }
}
