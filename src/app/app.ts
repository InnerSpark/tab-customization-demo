import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, MatMenuModule, MatIconModule, DragDropModule, CdkDragPlaceholder],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tab-customization-demo');
  tabs = signal([
    { label: 'Tab 1', content: 'Content for Tab 1' },
    { label: 'Tab 2', content: 'Content for Tab 2' },
    { label: 'Tab 3', content: 'Content for Tab 3' }
  ]);

  selectedTab = signal(0);

  deleteTab(index: number) {
    const arr = [...this.tabs()];
    arr.splice(index, 1);
    this.tabs.set(arr);
    if (this.selectedTab() >= arr.length) {
      this.selectedTab.set(arr.length - 1);
    }
  }

  editTab(index: number) {
    // Implement edit logic or open a dialog
    alert('Edit tab ' + (index + 1));
  }

  moveTabLeft(index: number) {
    if (index > 0) {
      const arr = [...this.tabs()];
      const [tab] = arr.splice(index, 1);
      arr.splice(index - 1, 0, tab);
      this.tabs.set(arr);
      this.selectedTab.set(index - 1);
    }
  }

  moveTabRight(index: number) {
    const arr = [...this.tabs()];
    if (index < arr.length - 1) {
      const [tab] = arr.splice(index, 1);
      arr.splice(index + 1, 0, tab);
      this.tabs.set(arr);
      this.selectedTab.set(index + 1);
    }
  }

  drop(event: { previousIndex: number; currentIndex: number }) {
    const prev = [...this.tabs()];
    const [moved] = prev.splice(event.previousIndex, 1);
    prev.splice(event.currentIndex, 0, moved);
    this.tabs.set(prev);
  }

  onTabKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowLeft') {
      this.moveTabLeft(index);
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.moveTabRight(index);
      event.preventDefault();
    }
  }
}
