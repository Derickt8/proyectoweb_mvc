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
  ButtonCustomType,
  CommissionCalculationResponse,
  CommissionFilterPayload,
  CommissionMetrics,
  CommissionSaleItem,
  CommissionSellerSummary,
  CommissionTabType,
  CreateSalePayload,
  Seller,
} from '../../../../core/commission/commission.types';
import { ButtonCreateCustomComponent } from '@/custom-components/button-create-custom/button-create-custom.component';
import { CardCustomComponent } from '@/custom-components/ui/card-custom/card-custom.component';
import { PaginatorComponent } from '@/custom-components/ui/paginator-custom/paginator.component';

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
  readonly commissionSalesList = signal<CommissionSaleItem[]>([]);
  readonly commissionSummaryList = signal<CommissionSellerSummary[]>([]);
  readonly metricsCommission = signal<CommissionMetrics | null>(null);
  readonly sellerListCommission = signal<Seller[]>([]);
  readonly pageIndexCommission = signal<number>(1);
  readonly pageSizeCommission = signal<number>(5);

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
      this.commissionSalesList().length > 0 ||
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

  readonly paginatedSalesListCommission = computed(() => {
    const list = this.commissionSalesList();
    const page = this.pageIndexCommission();
    const size = this.pageSizeCommission();
    const startIndex = (page - 1) * size;
    return list.slice(startIndex, startIndex + size);
  });

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

    this.handleCalculateCommissions();
  }

  handleCalculateCommissions(): void {
    if (this.commissionDateFilterForm.invalid) {
      return;
    }

    this.isLoadingCommission.set(true);
    const filterPayload: CommissionFilterPayload =
      this.commissionDateFilterForm.getRawValue();

    this.calculateCommissions$(filterPayload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.commissionSalesList.set(response.sales);
          this.commissionSummaryList.set(response.summaries);
          this.metricsCommission.set(response.metrics);
          this.pageIndexCommission.set(1);
          this.isLoadingCommission.set(false);
        },
        error: () => {
          this.isLoadingCommission.set(false);
        },
      });
  }

  setCommissionTab(tab: CommissionTabType): void {
    this.selectedCommissionTab.set(tab);
  }

  onPageChangeCommission(newPage: number): void {
    this.pageIndexCommission.set(newPage);
  }

  onPageSizeChangeCommission(newSize: number): void {
    this.pageSizeCommission.set(newSize);
    this.pageIndexCommission.set(1);
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
    const payload: CreateSalePayload =
      this.createSaleCommissionForm.getRawValue();

    this.createSale$(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingSaleCommission.set(false);
          this.closeCreateSaleModal();
          this.handleCalculateCommissions();
        },
        error: () => {
          this.isSubmittingSaleCommission.set(false);
        },
      });
  }

  private calculateCommissions$(
    payload: CommissionFilterPayload,
  ): Observable<CommissionCalculationResponse> {
    return this._commissionService.calculateCommissions(payload);
  }

  private loadSellers$(): Observable<Seller[]> {
    return this._commissionService.getSellers();
  }

  private createSale$(
    payload: CreateSalePayload,
  ): Observable<CommissionSaleItem> {
    return this._commissionService.createSale(payload);
  }
}
