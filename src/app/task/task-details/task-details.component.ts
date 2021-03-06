import { CommentService } from './../../comment/shared/comment.service';
import { CommentComponent } from './../../comment/comment.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AddCommentComponent } from './../../comment/add-comment/add-comment.component';
import { CommentModel } from './../../comment/shared/comment-model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from "@angular/router";
import { Router } from "@angular/router";
import { UserService } from "../../users/user/user.service";
import { TaskService } from "../shared/task.service";
import { TaskStatus, Task, IControlPoint } from '../shared/task.model';
import { User } from '../../users/user/user';
import { UsersFiltersService } from '../shared/users-filters.service';
import { YesNoModalComponent } from '../../modals/yes-no-modal/yes-no-modal.component';
@Component({
    selector: 'tskr-task-details',
    templateUrl: './task-details.component.html',
    styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
    private Task: Task;
    private TaskID: number;
    private Title: String;
    private ControlPointsInUse: IControlPoint[];
    private DaysRemaining: number[];
    private UserNames: String[];
    private AllUsers: User[];
    private Description: String;
    private Comments: String;
    private TaskStatus: string;
    private printStatus: string;
    private taskPerformers: User[];
    private mainPerformer: User;

    @ViewChild('Comments') commentComponent: CommentComponent;

    constructor(private _route: ActivatedRoute,
        private commentService: CommentService,
        private _navRoute: Router,
        public snackBar: MatSnackBar,
        private _taskService: TaskService,
        private _usersMilestoneService: UsersFiltersService,
        public dialog: MatDialog) {

        this.UserNames = new Array();
        this.DaysRemaining = new Array();
        this.ControlPointsInUse = new Array();
        this.taskPerformers = new Array();

        this._navRoute.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }

        this._navRoute.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                // trick the Router into believing it's last link wasn't previously loaded
                this._navRoute.navigated = false;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        });
    }
    ngOnInit() {
        this.taskPerformers.length = 0;
        this.ControlPointsInUse.length = 0;
        this._route.data.forEach((data) => {
            this._route.params.subscribe(params => this.TaskID = params['id']);
            this.commentService.getTaskComments(this.TaskID).subscribe(res => this.commentComponent.commentList = res);
            let task: Task;
            task = this._taskService.getChosenTask(this.TaskID);
            if (task !== undefined) {
                this.Task = task;
                this.Title = task.title;
                this.Description = task.description;
                this.ControlPointsInUse.length = 0;
                this.ControlPointsInUse = task.controlPointIds;
                this.taskPerformers.length = 0;
                this.taskPerformers = task.taskPerformers;
                this.TaskStatus = TaskStatus[task.statusId];
                this.getMainPerformer(task.mainPerformer);
            }
            else {
                this._navRoute.navigate(['/tasks']);
            }
        });
    }

    getMainPerformer(id: number) {
        this.mainPerformer = this._usersMilestoneService.getUserById(id);
    }

    isMilestoneInUse(selecded: IControlPoint) {
        this.ControlPointsInUse.forEach(element => {
            if (selecded.id === element.id) return "primary";
        });
    }

    cancel() {
        this._navRoute.navigate(['/tasks']);
    }

    deleteTask(ID: number): void {
        const dialogRef = this.dialog.open(YesNoModalComponent, {
            width: '480px',
            data: { message: 'Czy na pewno chcesz usunać to zadanie?' }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this._taskService.deleteTask(this.Task.id).subscribe(res => {
                    this._taskService.deleteLocalTask(this.Task);
                });
                this._navRoute.navigate(['/tasks/']);
                this.snackBar.open('Zadanie zostało usunięte', '', { duration: 2000 });
            }
        });
    }

    editTask() {
        this._navRoute.navigate(['/tasks/edit/' + this.TaskID]);
    }

    addComment(): void {
        const dialogRef = this.dialog.open(AddCommentComponent, {
            width: '480px',
            data: { taskId: this.TaskID }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.commentComponent.commentList.push(result);
            }
        });
    }

}



