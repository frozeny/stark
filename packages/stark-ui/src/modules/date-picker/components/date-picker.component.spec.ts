/* tslint:disable:completed-docs max-inline-declarations no-identical-functions no-big-function */
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Component, ViewChild } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { TranslateModule } from "@ngx-translate/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE } from "@nationalbankbelgium/stark-core";
import { MockStarkLoggingService, MockStarkRoutingService } from "@nationalbankbelgium/stark-core/testing";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { DEFAULT_DATE_MASK_CONFIG, StarkDatePickerComponent, StarkDatePickerMaskConfig } from "./date-picker.component";
import { STARK_DATE_FORMATS } from "./date-format.constants";
import { StarkTimestampMaskDirective } from "../../input-mask-directives";
import moment from "moment";

/**
 * To be able to test changes to the input fields, the Date Picker component is hosted inside the TestHostComponent class.
 * This one uses the Output "dateChange"
 */
@Component({
	selector: `host-component`,
	template: `
		<mat-form-field>
			<stark-date-picker
				[required]="required"
				[disabled]="isDisabled"
				[placeholder]="placeholder"
				[value]="value"
				(dateChange)="onValueChange($event)"
			></stark-date-picker>
		</mat-form-field>
	`
})
class TestHostComponent {
	@ViewChild(StarkDatePickerComponent)
	public datePickerComponent!: StarkDatePickerComponent;

	public placeholder?: string;
	public value?: Date;
	public isDisabled?: boolean;
	public required?: boolean;

	/**
	 * Simulates the OnValueChanges event of the date-picker component
	 * To be able to test the 'Changes' output
	 * @param value: Date.
	 */
	public onValueChange(value: Date): void {
		this.value = value;
	}
}

/**
 * To be able to test changes to the input fields, the Date Picker component is hosted inside the TestHostFormControlComponent class.
 * This one does not use the Output "dateChange"
 */
@Component({
	selector: `host-form-control-component`,
	template: `
		<mat-form-field>
			<stark-date-picker
				[required]="required"
				[placeholder]="placeholder"
				[dateMask]="dateMask"
				[formControl]="formControl"
			></stark-date-picker>
		</mat-form-field>
	`
})
class TestHostFormControlComponent {
	@ViewChild(StarkDatePickerComponent)
	public datePickerComponent!: StarkDatePickerComponent;

	public dateMask?: StarkDatePickerMaskConfig;
	public formControl = new FormControl();
	public placeholder?: string;
	public required?: boolean;
}

describe("DatePickerComponent", () => {
	let component: StarkDatePickerComponent;

	beforeEach(async(() => {
		return TestBed.configureTestingModule({
			declarations: [StarkTimestampMaskDirective, StarkDatePickerComponent, TestHostComponent, TestHostFormControlComponent],
			imports: [
				NoopAnimationsModule,
				MatDatepickerModule,
				MatFormFieldModule,
				MatInputModule,
				MatMomentDateModule,
				FormsModule,
				ReactiveFormsModule,
				TranslateModule.forRoot()
			],
			providers: [
				{ provide: STARK_LOGGING_SERVICE, useValue: new MockStarkLoggingService() },
				{ provide: STARK_ROUTING_SERVICE, useClass: MockStarkRoutingService },
				{ provide: MAT_DATE_FORMATS, useValue: STARK_DATE_FORMATS },
				{ provide: MAT_DATE_LOCALE, useValue: "en-us" },
				{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }
			]
		}).compileComponents();
	}));

	describe("using formControl", () => {
		let hostComponent: TestHostFormControlComponent;
		let hostFixture: ComponentFixture<TestHostFormControlComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostFormControlComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding

			component = hostComponent.datePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();

				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeNull();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBe(false);
				expect(component.required).toBeUndefined();
				expect(component.max).toBeUndefined();
				expect(component.min).toBeUndefined();
				expect(component.pickerId).toBeDefined();
				expect(component.pickerId).toEqual("");
				expect(component.pickerName).toBeDefined();
				expect(component.pickerName).toEqual("");
				expect(component.placeholder).toEqual("");
				expect(component.dateChange).toBeDefined();
				expect(component.dateInput).toBeDefined();
			});
		});

		describe("mat-datepicker properties binding", () => {
			it("the id of the MatDatepicker should be pickerId", () => {
				component.pickerId = "test-id";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector("#test-id");
				expect(input).not.toBeNull();
			});

			it("the id of the MatDatepickerInput should be pickerId + '-input'", () => {
				component.pickerId = "test-id";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector("#test-id-input");
				expect(input).not.toBeNull();
			});

			it("the name of the MatDatepickerInput should be pickerName", () => {
				component.pickerName = "test-name";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector('[name="test-name"]');
				expect(input).not.toBeNull();
			});

			it("the MatDatepickerInput should be disabled when isDisabled is true", () => {
				hostComponent.formControl.disable();
				hostFixture.detectChanges();
				expect(component.pickerInput.disabled).toBe(true);
			});

			it("the MatDatepickerInput min date should be minDate", () => {
				const minDate = new Date(2018, 6, 1);
				component.min = minDate;
				hostFixture.detectChanges();
				expect(component.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.min).toDate()).toEqual(minDate);
			});

			it("the MatDatepickerInput max date should be maxDate", () => {
				const maxDate = new Date(2018, 6, 2);
				component.max = maxDate;
				hostFixture.detectChanges();
				expect(component.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.max).toDate()).toEqual(maxDate);
			});

			it("the MatDatepickerInput value should be date", () => {
				const date = new Date(2018, 6, 3);
				hostComponent.formControl.setValue(date);
				hostFixture.detectChanges();
				expect(component.pickerInput.value).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.value).toDate()).toEqual(date);
			});

			it("the MatDatepickerInput dateMaskConfig should be DEFAULT_DATE_MASK_CONFIG when dateMask is TRUE or empty string", () => {
				hostComponent.dateMask = true;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(DEFAULT_DATE_MASK_CONFIG);

				hostComponent.dateMask = <any>"";
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(DEFAULT_DATE_MASK_CONFIG);
			});

			it("the MatDatepickerInput dateMaskConfig should be undefined when dateMask is FALSE", () => {
				hostComponent.dateMask = false;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBeUndefined();
			});

			it("the MatDatepickerInput dateMaskConfig should be dateMaskConfig", () => {
				const dateMaskConfig: StarkDatePickerMaskConfig = {
					format: "DD-MM-YYYY"
				};

				hostComponent.dateMask = dateMaskConfig;
				hostFixture.detectChanges();
				expect(component.dateMaskConfig).toBe(dateMaskConfig);
			});
		});

		describe("Dates filter", () => {
			it("filterOnlyWeekdays() should filter week days", () => {
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 16))).toBe(true);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 17))).toBe(true);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 18))).toBe(true);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 19))).toBe(true);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 20))).toBe(true);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 21))).toBe(false);
				expect(component.filterOnlyWeekdays(new Date(2018, 6, 22))).toBe(false);
			});

			it("filterOnlyWeekends() should filter week days", () => {
				expect(component.filterOnlyWeekends(new Date(2018, 6, 16))).toBe(false);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 17))).toBe(false);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 18))).toBe(false);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 19))).toBe(false);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 20))).toBe(false);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 21))).toBe(true);
				expect(component.filterOnlyWeekends(new Date(2018, 6, 22))).toBe(true);
			});

			it("dateFilter should be filterOnlyWeekdays() when dateFilter is OnlyWeekdays", () => {
				component.dateFilter = "OnlyWeekdays";
				hostFixture.detectChanges();
				expect(typeof component.dateFilter).toBe("function");
				if (typeof component.dateFilter === "function") {
					expect(component.dateFilter).toBe(component.filterOnlyWeekdays);
				}
			});

			it("dateFilter should be filterOnlyWeekends() when dateFilter is OnlyWeekends", () => {
				component.dateFilter = "OnlyWeekends";
				expect(typeof component.dateFilter).toBe("function");
				if (typeof component.dateFilter === "function") {
					expect(component.dateFilter).toBe(component.filterOnlyWeekends);
				}
			});

			it("dateFilter() should be dateFilter in other cases", () => {
				expect(component.dateFilter).toBeUndefined();
				const func: any = (date: Date): boolean => {
					const day: number = date.getDay();
					return day === 3;
				};
				component.dateFilter = func;
				expect(component.dateFilter).toBe(func);
			});
		});
	});

	describe("NOT using formControl", () => {
		let hostComponent: TestHostComponent;
		let hostFixture: ComponentFixture<TestHostComponent>;

		beforeEach(() => {
			hostFixture = TestBed.createComponent(TestHostComponent);
			hostComponent = hostFixture.componentInstance;
			hostFixture.detectChanges(); // trigger initial data binding

			component = hostComponent.datePickerComponent;
		});

		describe("on initialization", () => {
			it("should set internal component properties", () => {
				expect(hostFixture).toBeDefined();
				expect(component).toBeDefined();

				expect(component.logger).not.toBeNull();
				expect(component.logger).toBeDefined();
			});

			it("should NOT have any inputs set", () => {
				expect(component.value).toBeUndefined();
				expect(component.dateFilter).toBeUndefined();
				expect(component.disabled).toBeUndefined();
				expect(component.required).toBeUndefined();
				expect(component.max).toBeUndefined();
				expect(component.min).toBeUndefined();
				expect(component.pickerId).toBeDefined();
				expect(component.pickerId).toEqual("");
				expect(component.pickerName).toBeDefined();
				expect(component.pickerName).toEqual("");
				expect(component.placeholder).toEqual("");
				expect(component.dateChange).toBeDefined();
				expect(component.dateInput).toBeDefined();
			});
		});

		describe("mat-datepicker properties binding", () => {
			it("the id of the MatDatepicker should be pickerId", () => {
				component.pickerId = "test-id";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector("#test-id");
				expect(input).not.toBeNull();
			});

			it("the id of the MatDatepickerInput should be pickerId + '-input'", () => {
				component.pickerId = "test-id";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector("#test-id-input");
				expect(input).not.toBeNull();
			});

			it("the name of the MatDatepickerInput should be pickerName", () => {
				component.pickerName = "test-name";
				hostFixture.detectChanges();
				const input: HTMLElement = hostFixture.nativeElement.querySelector('[name="test-name"]');
				expect(input).not.toBeNull();
			});

			it("the MatDatepickerInput should be disabled when isDisabled is true", () => {
				hostComponent.isDisabled = true;
				hostFixture.detectChanges();
				expect(component.pickerInput.disabled).toBe(true);
			});

			it("the MatDatepickerInput min date should be minDate", () => {
				const minDate = new Date(2018, 6, 1);
				component.min = minDate;
				hostFixture.detectChanges();
				expect(component.pickerInput.min).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.min).toDate()).toEqual(minDate);
			});

			it("the MatDatepickerInput max date should be maxDate", () => {
				const maxDate = new Date(2018, 6, 2);
				component.max = maxDate;
				hostFixture.detectChanges();
				expect(component.pickerInput.max).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.max).toDate()).toEqual(maxDate);
			});

			it("the MatDatepickerInput value should be date", () => {
				const date = new Date(2018, 6, 3);
				hostComponent.value = date;
				hostFixture.detectChanges();
				expect(component.pickerInput.value).not.toBeNull();
				expect((<moment.Moment>component.pickerInput.value).toDate()).toEqual(date);
			});
		});
	});
});
