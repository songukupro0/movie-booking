import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private searchService = inject(SearchService);
  private destroy$ = new Subject<void>();

  @Input() placeholder = 'Nhập tên phim, diễn viên, thể loại...';
  @Input() initialValue = '';
  @Output() searchChange = new EventEmitter<string>();

  isFocused = signal(false);

  form = this.fb.nonNullable.group({ keyword: [''] });

  ngOnInit(): void {
    if (this.initialValue) {
      this.form.controls.keyword.setValue(this.initialValue, { emitEvent: false });
    }

    // Real-time: pipe value changes vào SearchService
    this.form.controls.keyword.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((val) => {
        this.searchService.search(val);
        this.searchChange.emit(val);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const kw = this.form.controls.keyword.value;
    this.searchService.search(kw);
    this.searchChange.emit(kw);
  }

  clear(): void {
    this.form.controls.keyword.setValue('');
    this.searchService.search('');
    this.searchChange.emit('');
  }

  get hasValue(): boolean {
    return !!this.form.controls.keyword.value?.trim();
  }
}
