import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-custom-select',
  imports: [],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
})
export class CustomSelectComponent implements OnInit, OnDestroy {
  options = input<{ value: string; title: string }[]>([]);
  selected = input<string>();

  containerClassName = input<string>(' w-fit ');
  selectionClassName = input<string>(
    ' px-3 py-1 border border-gray-500 bg-gray-50 dark:bg-gray-700 rounded-md cursor-pointer '
  );
  dropdownClassName = input<string>(
    ' absolute left-0 right-0 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-500 rounded-md shadow-lg z-10 '
  );

  selectionChange = output<string>();

  isOpen = signal(false);
  openUpwards = signal(false);

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.checkDropdownPosition();
    }
  }

  selectOption(optionId: number) {
    const option = this.options()[optionId];
    this.selectionChange.emit(option.value);
    this.isOpen.set(false);
  }

  get selectedTitle() {
    const selectedOption = this.options().find(
      (option) => option.value === this.selected()
    );
    return selectedOption ? selectedOption.title : '';
  }
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
  checkDropdownPosition() {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = this.elementRef.nativeElement.offsetHeight;

    if (rect.bottom + dropdownHeight > viewportHeight * 0.9) {
      this.openUpwards.set(true);
    } else {
      this.openUpwards.set(false);
    }
  }
}
