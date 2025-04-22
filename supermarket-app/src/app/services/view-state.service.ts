import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ViewMode = 'search' | 'sco' | 'checkout' | 'paymentComplete';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private viewModeSubject = new BehaviorSubject<ViewMode>('search');
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public viewMode$ = this.viewModeSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() {}

  setViewMode(mode: ViewMode): void {
    this.viewModeSubject.next(mode);
  }

  getViewMode(): ViewMode {
    return this.viewModeSubject.value;
  }

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }
}
