import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmartService } from '../../../services/smart.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import {ClientAppService} from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public patient: any;
  public error: any;
  public showingPou = false;
  public showingTData = true;

  private _unsubscribe = new Subject<void>();

  constructor(private _zone: NgZone,
              private _smartService: SmartService,
              private _route: ActivatedRoute,
              private _clientAppService: ClientAppService) { }

  /**
   * Fetch the Patient Resource based on the Patient in Context
   */
  ngOnInit() {
    this._clientAppService.getAllClientApps()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(clientApps => {
        const uniqueName = this._route.snapshot.paramMap.get('uniqueName');
        const clientApp = clientApps.find(q => q.uniqueName === uniqueName);
        if (clientApp.dashboardDefaultLaunch === 'pou') {
          this.toggleOnPOU();
        } else {
          this.toggleOnTData();
        }
      });
    this._smartService.getClient()
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(smartClient => {
        const api: FHIR.SMART.Api = smartClient.api;
        const searchParams: FHIR.SMART.SearchParams = {
          type: 'Patient',
          patient: smartClient.patient.id,
        };
        // Makes use of the SMART on FHIR JS Client search api method
        api.search(searchParams).then(response => {
          this._zone.run(() => {
            this.patient = response.data;
            this.error = null;
          });
        }, error => {
          this._zone.run(() => {
            this.error = error;
          });
        });
      });
  }

  toggleOnPOU() {
   this.showingPou = true;
   this.showingTData = false;
  }

  toggleOnTData() {
    this.showingPou = false;
    this.showingTData = true;
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}
