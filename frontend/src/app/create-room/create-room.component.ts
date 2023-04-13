import {Component, OnInit, ViewChild, Output, EventEmitter} from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";
import { first } from "rxjs/operators";
import { Room } from "src/app/models/Room";
import { AuthService } from "src/app/services/auth.service";
import { RoomService } from "src/app/services/room.service";

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  @ViewChild("formDirective") formDirective: NgForm;
  @Output() create: EventEmitter<any> = new EventEmitter();

  roomForm: FormGroup;
  isAuthenticated = false;

  isOpen = false;

  constructor(private authService: AuthService, private roomService: RoomService) {}

  ngOnInit(): void {
    this.roomForm = this.createFormGroup();
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      topic: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
      timeO: new FormControl("20 Minutes", [Validators.required]),
      stance: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  onSubmit(formData: Pick<Room, "topic" | "timeO" | "stance">): void {

    this.roomService
      .createPost(formData, this.authService.userId)
      .pipe(first())
      .subscribe(() => {
        this.create.emit(null);
      });
    this.roomForm.reset();
    this.formDirective.resetForm();

  }

}
