import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskerMaterialModule } from '../tasker-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TaskThumbnailComponent } from './task-thumbnail/task-thumbnail.component';
import { TaskTreeComponent } from './task-tree/task-tree.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { TaskMainComponent } from './task-main/task-main.component';

import { TaskTreeResolverService } from './shared/task-tree-resolver.service';
import { TaskResolverService } from './shared/task-resolver.service';
import { TaskService } from './shared/task.service';
import { TaskFiltersService } from './shared/task-filters.service';

import { taskRouting } from './task.routing';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TaskNewComponent } from './task-new/task-new.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { StatusChooserComponent } from './status-chooser/status-chooser.component';

const SWIPER_CONFIG: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 'auto',
    keyboardControl: true
};


@NgModule({
    imports: [
        CommonModule,
        TaskerMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        taskRouting,
        SwiperModule.forRoot(SWIPER_CONFIG),
        NgDragDropModule.forRoot()
    ],
    declarations: [
        TaskTreeComponent,
        TaskThumbnailComponent,
        TaskDetailsComponent,
        TaskMainComponent,
        TaskNewComponent,
        TaskEditComponent,
        StatusChooserComponent
],
    providers: [
        TaskTreeResolverService,
        TaskResolverService,
        TaskService,
        TaskFiltersService
    ],
    entryComponents: [
        StatusChooserComponent
    ]
})
export class TaskModule { }
