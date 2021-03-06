import { Component, ElementRef, Inject, Input, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";
import { STARK_LOGGING_SERVICE, STARK_ROUTING_SERVICE, StarkLoggingService, StarkRoutingService } from "@nationalbankbelgium/stark-core";
import { AbstractStarkUiComponent } from "../../../common/classes/abstract-component";
import { StarkMenuSection } from "./app-menu-section.intf";
import { StarkMenuConfig } from "./app-menu-config.intf";
import { StarkMenuGroup } from "./app-menu-group.intf";

/**
 * Name of the component
 */
const componentName = "stark-app-menu";

/**
 * Component to display app-menu based on the options passed as parameters.
 */
@Component({
	selector: "stark-app-menu",
	templateUrl: "./app-menu.component.html",
	encapsulation: ViewEncapsulation.None,
	host: {
		class: componentName
	}
})
export class StarkAppMenuComponent extends AbstractStarkUiComponent implements OnInit {
	/**
	 * @internal
	 * @ignore
	 */
	private _menuConfig: StarkMenuConfig = {};

	/**
	 * Configuration of the menu
	 */
	@Input()
	public set menuConfig(menuConfig: StarkMenuConfig) {
		this._menuConfig = menuConfig;
		this.hasSections = this._menuConfig.hasOwnProperty("menuSections");
	}

	public get menuConfig(): StarkMenuConfig {
		return this._menuConfig;
	}

	/**
	 * Either the component have section or not
	 */
	public hasSections = false;

	/**
	 * Class constructor
	 * @param logger - The logger of the application
	 * @param routingService - The router of the application
	 * @param renderer - The custom render of the component
	 * @param elementRef - The elementRef of the component
	 */
	public constructor(
		@Inject(STARK_LOGGING_SERVICE) public logger: StarkLoggingService,
		@Inject(STARK_ROUTING_SERVICE) public routingService: StarkRoutingService,
		protected renderer: Renderer2,
		protected elementRef: ElementRef
	) {
		super(renderer, elementRef);
	}

	/**
	 * Component lifecycle hook
	 */
	public ngOnInit(): void {
		this.logger.debug(componentName + ": component initialized");
		super.ngOnInit();
	}

	/**
	 * @ignore
	 */
	public trackSection(index: number, _section: StarkMenuSection): number {
		return index;
	}

	/**
	 * @ignore
	 */
	public trackMenuGroup(index: number, _menuGroup: StarkMenuGroup): number {
		return index;
	}
}
