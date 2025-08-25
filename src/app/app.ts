import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface Tab {
  id: string;
  label: string;
  content?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, HttpClientModule, MatTabsModule, MatIconModule, MatButtonModule, MatDialogModule, MatMenuModule, FormsModule, DragDropModule],
})
export class AppComponent {
  tabs = signal<Tab[]>([]);
  selectedTab = signal<string>('');
  selectedTabIndex = computed(() => this.tabs().findIndex(tab => tab.id === this.selectedTab()));

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.loadTabs();
  }

  loadTabs() {
    this.http.get<Tab[]>('/api/tabs').subscribe(tabs => {
      this.tabs.set(tabs);
      if (tabs.length) this.selectedTab.set(tabs[0].id);
    });
  }

  addTab() {
    const newTab: Tab = { id: Date.now().toString(), label: 'New Tab' };
    const updated = [...this.tabs(), newTab];
    this.tabs.set(updated);
    this.selectedTab.set(newTab.id);
    this.saveTabs(updated);
  }

  deleteTab(tabId: string) {
    const updated = this.tabs().filter(tab => tab.id !== tabId);
    this.tabs.set(updated);
    if (updated.length) this.selectedTab.set(updated[0].id);
    this.saveTabs(updated);
  }

  drop(event: any) {
    const arr = [...this.tabs()];
    const [removed] = arr.splice(event.previousIndex, 1);
    arr.splice(event.currentIndex, 0, removed);
    this.tabs.set(arr);
    this.saveTabs(arr);
    // Focus the moved tab for correct tab order
    setTimeout(() => {
      const tabElements = document.querySelectorAll('.tab-item');
      if (tabElements[event.currentIndex]) {
        (tabElements[event.currentIndex] as HTMLElement).focus();
      }
    }, 0);
  }

  moveTabLeft(index: number) {
    if (index > 0) {
      const arr = [...this.tabs()];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      this.tabs.set(arr);
      this.saveTabs(arr);
      // Focus the moved tab for correct tab order
      setTimeout(() => {
        const tabElements = document.querySelectorAll('.tab-item');
        if (tabElements[index - 1]) {
          (tabElements[index - 1] as HTMLElement).focus();
        }
      }, 0);
    }
  }

  moveTabRight(index: number) {
    const arr = [...this.tabs()];
    if (index < arr.length - 1) {
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      this.tabs.set(arr);
      this.saveTabs(arr);
      // Focus the moved tab for correct tab order
      setTimeout(() => {
        const tabElements = document.querySelectorAll('.tab-item');
        if (tabElements[index + 1]) {
          (tabElements[index + 1] as HTMLElement).focus();
        }
      }, 0);
    }
  }

  async editTab(tab?: Tab) {
    if (!tab) return;
    const { EditTabDialog } = await import('./edit-tab-dialog');
    const dialogRef = this.dialog.open(EditTabDialog, {
      data: { tabName: tab.label },
      width: '320px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result !== undefined && result.trim() !== '') {
        const arr = this.tabs().map(t => t.id === tab.id ? { ...t, label: result } : t);
        this.tabs.set(arr);
        this.saveTabs(arr);
      }
    });
  }

  saveTabs(tabs: Tab[]) {
    this.http.post('/api/tabs', tabs).subscribe();
  }

  getSelectedTab(): Tab | undefined {
    return this.tabs().find(tab => tab.id === this.selectedTab());
  }

  getSelectedTabIndex(): number {
    return this.tabs().findIndex(tab => tab.id === this.selectedTab());
  }
}
