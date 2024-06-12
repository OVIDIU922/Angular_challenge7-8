import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-movie',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  searchForm!: FormGroup;  // Utilisation de l'opérateur "!" pour indiquer que searchForm sera initialisé avant d'être utilisé
  currentYear: number = new Date().getFullYear();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      movieGroup: this.fb.group({
        identifier: [''],
        title: [''],
      }, { validator: this.isRequiredValidator('identifier', 'title') }),
      type: ['série'],
      releaseYear: ['', [Validators.required, this.rangeDateValidator(1900, this.currentYear)]],
      fiche: ['']
    });

    // Set default value for fiche after form initialization
    this.searchForm.patchValue({ fiche: 'courte' });

    // Subscribe to value changes
    this.searchForm.valueChanges.subscribe(value => {
      console.log(value);
    });

    // Enable/disable fiche based on identifier field
    this.searchForm.get('movieGroup.identifier')?.valueChanges.subscribe(value => {
      const ficheControl = this.searchForm.get('fiche');
      if (value) {
        ficheControl?.enable();
      } else {
        ficheControl?.disable();
      }
    });
  }

  isRequiredValidator(idKey: string, titleKey: string) {
    return (group: FormGroup) => {
      const id = group.controls[idKey];
      const title = group.controls[titleKey];
      if (id.value || title.value) {
        return null;
      }
      return { isRequired: true };
    };
  }

  rangeDateValidator(minYear: number, maxYear: number) {
    return (control: any) => {
      const year = control.value;
      if (year >= minYear && year <= maxYear) {
        return null;
      }
      return {
        min: { minYear, maxYear }
      };
    };
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      console.log(JSON.stringify(this.searchForm.value));
    }
  }
}
