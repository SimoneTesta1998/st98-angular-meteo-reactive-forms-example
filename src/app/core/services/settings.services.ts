import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})

export class SettingsServces {
  isMetric$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  setMetric(value: boolean) {
    this.isMetric$.next(value);
  }
}