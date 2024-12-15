import {AfterViewInit, Component, effect, inject, OnInit, ViewChild} from '@angular/core';
import {StudentsStore} from '../../../core/stores/student.store';
import {MatPaginator} from '@angular/material/paginator';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-students',
  imports: [
    MatPaginator,
    MatNoDataRow,
    MatRow,
    MatHeaderRow,
    MatCell,
    MatHeaderCell,
    MatColumnDef,
    MatTable,
    MatProgressSpinner,
    MatInput,
    MatLabel,
    MatFormField,
    MatSort,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit, AfterViewInit {
  protected studentsStore = inject(StudentsStore);
  protected dataSource: MatTableDataSource<any>;
  protected displayedColumns: string[] = ['id', 'timestamp', 'studentName', 'phoneNumber', 'alternativePhone', 'parentName'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'id': return item['ID'];
        case 'timestamp': return item['Timestamp'];
        case 'studentName': return item['Student Name'];
        case 'phoneNumber': return item['Phone Number'];
        case 'alternativePhone': return item['Alternative Phone'];
        case 'parentName': return item['Parent Name'];
        default: return item[property];
      }
    };

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = filter.toLowerCase();
      return data['Student Name']?.toLowerCase().includes(searchStr) ||
        data['Phone Number']?.includes(searchStr) ||
        data['Alternative Phone']?.includes(searchStr) ||
        data['Parent Name']?.toLowerCase().includes(searchStr);
    };

    effect(() => {
      console.log('isLoading state:', this.studentsStore.isLoading());

      const students = this.studentsStore.students();
      this.dataSource.data = this.studentsStore.students();
      if (students.length > 0) {
        console.log('First student:', students[0]); // Debug log
        this.dataSource.data = students;
      }
      console.log(students);
    });
  }

  ngOnInit() {
    this.studentsStore.loadStudents();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
