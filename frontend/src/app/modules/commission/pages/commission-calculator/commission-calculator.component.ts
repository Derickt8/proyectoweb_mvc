import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { CommissionService } from '../../../../core/commission/commission.service';
import {
  Commission,
  CommissionMetrics,
  CommissionResponse,
  CommissionSummary,
  CommissionSummaryResponse,
  Seller,
} from '../../../../core/commission/commission.types';
import { ButtonCustomType } from '../../../../core/utils/button-custom.type';
import { ButtonCreateCustomComponent } from '@/custom-components/button-create-custom/button-create-custom.component';
import { CardCustomComponent } from '@/custom-components/ui/card-custom/card-custom.component';
import { PaginatorComponent } from '@/custom-components/ui/paginator-custom/paginator.component';

export type CommissionTabType = 'sales' | 'sellers';

@Component({
  selector: 'app-commission-calculator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    PercentPipe,
    ButtonCreateCustomComponent,
    CardCustomComponent,
    PaginatorComponent,
  ],
  templateUrl: './commission-calculator.component.html',
  styleUrl: './commission-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionCalculatorComponent implements OnInit {
  private readonly _commissionService = inject(CommissionService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly createButtonSaleConfig: ButtonCustomType = {
    title: 'Nueva Venta',
    icon: 'heroicons_outline:plus',
    class: 'btn-create-sale',
  };

  readonly calculateButtonCommissionConfig: ButtonCustomType = {
    title: 'Calcular Comisiones',
    icon: 'heroicons_outline:calculator',
    class: 'btn-calculate',
  };

  readonly isLoadingCommission = signal<boolean>(false);
  readonly isSubmittingSaleCommission = signal<boolean>(false);
  readonly isCreateSaleModalOpenCommission = signal<boolean>(false);
  readonly selectedCommissionTab = signal<CommissionTabType>('sales');

  readonly commissionSalesList = signal<Commission[]>([]);
  readonly pageIndexCommission = signal<number>(1);
  readonly pageSizeCommission = signal<number>(10);
  readonly totalRecordsCommission = signal<number>(0);
  readonly pageSizeOptionsCommission = signal<number[]>([10, 25, 50, 100]);

  readonly commissionSummaryList = signal<CommissionSummary[]>([]);
  readonly summaryPageIndexCommission = signal<number>(1);
  readonly summaryPageSizeCommission = signal<number>(10);
  readonly totalSummaryRecordsCommission = signal<number>(0);

  readonly metricsCommission = signal<CommissionMetrics | null>(null);
  readonly sellerListCommission = signal<Seller[]>([]);

  readonly commissionDateFilterForm = new FormGroup({
    startDate: new FormControl<string>('2025-05-01', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl<string>('2025-06-30', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  readonly createSaleCommissionForm = new FormGroup({
    sellerId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    saleDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number>(500, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
  });

  readonly hasResultsCommission = computed(
    () =>
      this.totalRecordsCommission() > 0 ||
      this.commissionSummaryList().length > 0,
  );

  readonly totalSalesAmountCommission = computed(
    () => this.metricsCommission()?.totalSalesAmount ?? 0,
  );

  readonly totalCommissionAmountCommission = computed(
    () => this.metricsCommission()?.totalCommissionAmount ?? 0,
  );

  readonly totalSalesCountCommission = computed(
    () => this.metricsCommission()?.totalSalesCount ?? 0,
  );

  readonly activeSellersCountCommission = computed(
    () => this.metricsCommission()?.activeSellersCount ?? 0,
  );

  ngOnInit(): void {
    this.loadInitialDataCommission();
  }

  loadInitialDataCommission(): void {
    this.loadSellers$()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (sellers) => {
          this.sellerListCommission.set(sellers);
          if (sellers.length > 0) {
            this.createSaleCommissionForm.controls.sellerId.setValue(sellers[0].id);
          }
        },
      });

    this.executeSearchCommission();
  }

  executeSearchCommission(): void {
    this.pageIndexCommission.set(1);
    this.summaryPageIndexCommission.set(1);
    this.loadCommissions(this.pageIndexCommission(), this.pageSizeCommission());
    this.loadSummariesBySeller(
      this.summaryPageIndexCommission(),
      this.summaryPageSizeCommission(),
    );
    this.loadMetricsCommission();
  }

  loadCommissions(page: number, limit: number): void {
    this.isLoadingCommission.set(true);
    const filterValues = this.commissionDateFilterForm.getRawValue();
    const where: Record<string, unknown> = {};
    if (filterValues.startDate && filterValues.endDate) {
      where['startDate'] = filterValues.startDate;
      where['endDate'] = filterValues.endDate;
    }

    this.loadCommissions$(page, limit, where)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.commissionSalesList.set(response.data);
          this.totalRecordsCommission.set(response.total);
          this.isLoadingCommission.set(false);
        },
        error: () => {
          this.commissionSalesList.set([]);
          this.totalRecordsCommission.set(0);
          this.isLoadingCommission.set(false);
        },
      });
  }

  loadSummariesBySeller(page: number, limit: number): void {
    const filterValues = this.commissionDateFilterForm.getRawValue();
    const where: Record<string, unknown> = {};
    if (filterValues.startDate && filterValues.endDate) {
      where['startDate'] = filterValues.startDate;
      where['endDate'] = filterValues.endDate;
    }

    this.loadSummaries$(page, limit, where)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.commissionSummaryList.set(response.data);
          this.totalSummaryRecordsCommission.set(response.total);
        },
        error: () => {
          this.commissionSummaryList.set([]);
          this.totalSummaryRecordsCommission.set(0);
        },
      });
  }

  loadMetricsCommission(): void {
    const filterValues = this.commissionDateFilterForm.getRawValue();
    const where: Record<string, unknown> = {};
    if (filterValues.startDate && filterValues.endDate) {
      where['startDate'] = filterValues.startDate;
      where['endDate'] = filterValues.endDate;
    }

    this.loadMetrics$(where)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (metrics) => {
          this.metricsCommission.set(metrics);
        },
        error: () => {
          this.metricsCommission.set(null);
        },
      });
  }

  setCommissionTab(tab: CommissionTabType): void {
    this.selectedCommissionTab.set(tab);
  }

  onPageChangeCommission(newPage: number): void {
    this.pageIndexCommission.set(newPage);
    this.loadCommissions(this.pageIndexCommission(), this.pageSizeCommission());
  }

  onPageSizeChangeCommission(newSize: number): void {
    this.pageSizeCommission.set(newSize);
    this.pageIndexCommission.set(1);
    this.loadCommissions(this.pageIndexCommission(), this.pageSizeCommission());
  }

  onSummaryPageChangeCommission(newPage: number): void {
    this.summaryPageIndexCommission.set(newPage);
    this.loadSummariesBySeller(
      this.summaryPageIndexCommission(),
      this.summaryPageSizeCommission(),
    );
  }

  onSummaryPageSizeChangeCommission(newSize: number): void {
    this.summaryPageSizeCommission.set(newSize);
    this.summaryPageIndexCommission.set(1);
    this.loadSummariesBySeller(
      this.summaryPageIndexCommission(),
      this.summaryPageSizeCommission(),
    );
  }

  openCreateSaleModal(): void {
    this.isCreateSaleModalOpenCommission.set(true);
  }

  closeCreateSaleModal(): void {
    this.isCreateSaleModalOpenCommission.set(false);
  }

  handleCreateSale(): void {
    if (this.createSaleCommissionForm.invalid) {
      return;
    }

    this.isSubmittingSaleCommission.set(true);
    const formValue = this.createSaleCommissionForm.getRawValue();

    this.createSale$(formValue)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingSaleCommission.set(false);
          this.closeCreateSaleModal();
          this.executeSearchCommission();
        },
        error: () => {
          this.isSubmittingSaleCommission.set(false);
        },
      });
  }

  private loadCommissions$(
    page: number,
    limit: number,
    where: Record<string, unknown>,
  ): Observable<CommissionResponse> {
    return this._commissionService.findAll(page, limit, where);
  }

  private loadSummaries$(
    page: number,
    limit: number,
    where: Record<string, unknown>,
  ): Observable<CommissionSummaryResponse> {
    return this._commissionService.findSummariesBySeller(page, limit, where);
  }

  private loadMetrics$(
    where: Record<string, unknown>,
  ): Observable<CommissionMetrics> {
    return this._commissionService.getMetrics(where);
  }

  private loadSellers$(): Observable<Seller[]> {
    return this._commissionService.getSellers();
  }

  private createSale$(
    data: Partial<Commission>,
  ): Observable<Commission> {
    return this._commissionService.createSale(data);
  }
}
