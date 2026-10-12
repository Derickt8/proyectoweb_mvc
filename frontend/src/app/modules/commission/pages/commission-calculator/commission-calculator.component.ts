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
  CommissionResponse,
  CommissionSummary,
  CommissionSummaryResponse,
  CommissionTabType,
  Seller,
} from '../../../../core/commission/commission.types';
import { ButtonCustomType } from '../../../../core/utils/button-custom.type';
import { ButtonCreateCustomComponent } from '@/custom-components/button-create-custom/button-create-custom.component';
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
    PaginatorComponent,
  ],
  templateUrl: './commission-calculator.component.html',
  styleUrl: './commission-calculator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionCalculatorComponent implements OnInit {
  private readonly _commissionService = inject(CommissionService);
  private readonly _destroyRef = inject(DestroyRef);

  readonly createButtonCommissionConfig: ButtonCustomType = {
    title: 'Nueva Venta',
    icon: 'heroicons_outline:plus',
    class: 'btn-create-sale',
  };

  readonly calculateButtonCommissionConfig: ButtonCustomType = {
    title: 'Buscar Comisiones',
    icon: 'heroicons_outline:magnifying-glass',
    class: 'btn-calculate',
  };

  readonly isLoadingCommission = signal<boolean>(false);
  readonly isSubmittingCommission = signal<boolean>(false);
  readonly isCreateModalOpenCommission = signal<boolean>(false);
  readonly selectedCommissionTab = signal<CommissionTabType>('sales');

  readonly commissionSalesList = signal<Commission[]>([]);
  readonly pageIndexCommission = signal<number>(1);
  readonly pageSizeCommission = signal<number>(10);
  readonly totalRecordsCommission = signal<number>(0);
  readonly pageSizeOptionsCommission = signal<number[]>([10, 25, 50, 100]);

  readonly commissionSummaryList = signal<CommissionSummary[]>([]);
  readonly pageIndexCommissionSummary = signal<number>(1);
  readonly pageSizeCommissionSummary = signal<number>(10);
  readonly totalRecordsCommissionSummary = signal<number>(0);

  readonly sellerListCommission = signal<Seller[]>([]);

  readonly commissionDateFilterForm = new FormGroup({
    startDate: new FormControl<string>(''),
    endDate: new FormControl<string>(''),
  });

  readonly createCommissionForm = new FormGroup({
    sellerId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    saleDate: new FormControl<string>(new Date().toISOString().split('T')[0], {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
  });

  readonly hasResultsCommission = computed(
    () =>
      this.totalRecordsCommission() > 0 ||
      this.commissionSummaryList().length > 0,
  );

  ngOnInit(): void {
    this.loadInitialDataCommission();
  }

  loadInitialDataCommission(): void {
    this.loadCommissionSellers$()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (sellers) => {
          this.sellerListCommission.set(sellers);
          if (sellers.length > 0) {
            this.createCommissionForm.controls.sellerId.setValue(sellers[0].id);
          }
        },
      });

    this.executeSearchCommission();
  }

  loadCommissionData(): void {
    this.isLoadingCommission.set(true);
    const filterValues = this.commissionDateFilterForm.getRawValue();
    const where: Record<string, unknown> = {};
    if (filterValues.startDate && filterValues.endDate) {
      where['startDate'] = filterValues.startDate;
      where['endDate'] = filterValues.endDate;
    }

    this.loadCommissions$(
      this.pageIndexCommission(),
      this.pageSizeCommission(),
      where,
    )
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

  loadCommissionSummaries(): void {
    const filterValues = this.commissionDateFilterForm.getRawValue();
    const where: Record<string, unknown> = {};
    if (filterValues.startDate && filterValues.endDate) {
      where['startDate'] = filterValues.startDate;
      where['endDate'] = filterValues.endDate;
    }

    this.loadCommissionSummaries$(
      this.pageIndexCommissionSummary(),
      this.pageSizeCommissionSummary(),
      where,
    )
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.commissionSummaryList.set(response.data);
          this.totalRecordsCommissionSummary.set(response.total);
        },
        error: () => {
          this.commissionSummaryList.set([]);
          this.totalRecordsCommissionSummary.set(0);
        },
      });
  }

  executeSearchCommission(): void {
    this.pageIndexCommission.set(1);
    this.pageIndexCommissionSummary.set(1);
    this.loadCommissionData();
    this.loadCommissionSummaries();
  }

  setCommissionTab(tab: CommissionTabType): void {
    this.selectedCommissionTab.set(tab);
  }

  onPageChangeCommission(newPage: number): void {
    this.pageIndexCommission.set(newPage);
    this.loadCommissionData();
  }

  onPageSizeChangeCommission(newSize: number): void {
    this.pageSizeCommission.set(newSize);
    this.pageIndexCommission.set(1);
    this.loadCommissionData();
  }

  onPageChangeCommissionSummary(newPage: number): void {
    this.pageIndexCommissionSummary.set(newPage);
    this.loadCommissionSummaries();
  }

  onPageSizeChangeCommissionSummary(newSize: number): void {
    this.pageSizeCommissionSummary.set(newSize);
    this.pageIndexCommissionSummary.set(1);
    this.loadCommissionSummaries();
  }

  openCreateCommissionModal(): void {
    this.isCreateModalOpenCommission.set(true);
  }

  closeCreateCommissionModal(): void {
    this.isCreateModalOpenCommission.set(false);
  }

  handleCreateCommission(): void {
    if (this.createCommissionForm.invalid) {
      return;
    }

    this.isSubmittingCommission.set(true);
    const formValue = this.createCommissionForm.getRawValue();

    this.createCommission$(formValue as Partial<Commission>)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this.isSubmittingCommission.set(false);
          this.closeCreateCommissionModal();
          this.executeSearchCommission();
        },
        error: () => {
          this.isSubmittingCommission.set(false);
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

  private loadCommissionSummaries$(
    page: number,
    limit: number,
    where: Record<string, unknown>,
  ): Observable<CommissionSummaryResponse> {
    return this._commissionService.findSummariesBySeller(page, limit, where);
  }

  private loadCommissionSellers$(): Observable<Seller[]> {
    return this._commissionService.getSellers();
  }

  private createCommission$(
    data: Partial<Commission>,
  ): Observable<Commission> {
    return this._commissionService.createSale(data);
  }
}
