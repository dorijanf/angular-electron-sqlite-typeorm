import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SyncQueueComponent } from "./sync-queue.component";

describe("SyncQueueComponent", () => {
  let component: SyncQueueComponent;
  let fixture: ComponentFixture<SyncQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncQueueComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
