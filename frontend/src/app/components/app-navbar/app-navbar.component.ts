import { Component, inject, OnInit, Renderer2, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DimensionsService } from '../../services/dimensions.service';
import { defaultDims } from '../../utils_other/defaults';
import { DimensionContextType } from '../../utils_other/types';
import { ThemeService } from '../../services/theme.service';
import { DOCUMENT } from '@angular/common';
import { LogoComponent } from '../../svgs/_nav/logo/logo.component';
import { ThemeToggleLightComponent } from '../../svgs/theme-toggle-light/theme-toggle-light.component';
import { ThemeToggleDarkComponent } from '../../svgs/theme-toggle-dark/theme-toggle-dark.component';

@Component({
  selector: 'app-app-navbar',
  imports: [RouterLink,LogoComponent, ThemeToggleLightComponent, ThemeToggleDarkComponent, RouterOutlet],
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.scss'
})
export class AppNavbarComponent implements OnInit {
  dims: DimensionContextType = defaultDims
   
  themeService = inject(ThemeService);
  dimensionsService = inject(DimensionsService); 
  router = inject(Router);
  route = inject(ActivatedRoute);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT); 

  theme = signal<'light' | 'dark'>('light');
  isLight = signal(true);
  currentRouteInfo = signal<{ welcome_message: string, tooltip: string, name: string }>({ welcome_message: '', tooltip: '',name:'' });

  leftNavOpen = signal(true)
  dropdownOpen = signal(false)
  userData = {username: "John Doe"}
  

  ngOnInit() {
    this.dimensionsService.dims$.subscribe(dims => {
      this.dims = dims 
    }); 
    this.updateThemeClass(this.themeService.isLight);
    this.themeService.theme$.subscribe(newTheme => {
      this.theme.set(newTheme);
      this.isLight.set(this.themeService.isLight) 
      this.updateThemeClass(this.themeService.isLight);
    });
    const currentRoute = this.allLinksNames.find(route => this.matchRoute(route.to));
    if (currentRoute) {
      this.currentRouteInfo.set({
        welcome_message: currentRoute.welcome_message,
        tooltip: currentRoute.tooltip,
        name: currentRoute.name,
      });
    }
    this.router.events.subscribe(() => {
      const currentRoute = this.allLinksNames.find(route => this.matchRoute(route.to));
      if (currentRoute) {
        this.currentRouteInfo.set({
          welcome_message: currentRoute.welcome_message,
          tooltip: currentRoute.tooltip,
          name: currentRoute.name,
        });
      }
    });
  }

  private updateThemeClass(isLight: boolean) {
    const rootElement = this.document.getElementById('root');
    if (rootElement) {
      if (isLight) {
        this.renderer.removeClass(rootElement, 'dark');
      } else {
        this.renderer.addClass(rootElement, 'dark');
      }
    }
  }

  toggleLeftNav() { 
    this.leftNavOpen.set(!this.leftNavOpen())
  }
  handleLogout() {
    localStorage.removeItem('access_token');
    window.location.href = "/";
  }
  
  matchRoute(path: string): boolean {
    return this.router.isActive(path, {
      paths: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
  
  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme); 
  }
  


  allLinksNames = [
    {
      to: "/app",
      name: "Home",
      welcome_message: `Hello there diligent person!`,
      tooltip:
        "Welcome to the Taskify Web Application! Here you can learn more about its capabilities and how to use it.",
    },
    {
      to: "/app/user",
      name: "Settings",
      welcome_message: `Welcome to your Profile!`,
      tooltip:
        "Here you can look at your profile, change your password or modify your account.",
    },
    {
      to: "/app/dashboard",
      name: "Dashboard",
      welcome_message: `Welcome to your Dashboard!`,
      tooltip: "Here you can have a good overview of your overall activity.",
    },
    {
      to: "/app/tasks",
      name: "Tasks",
      welcome_message: `Welcome to the Tasks section!`,
      tooltip:
        "Here you can review, update or delete tasks. Use filters for more specific selection.",
    },
    {
      to: "/app/tasks/$taskid",
      name: "Single Task",
      welcome_message: `Welcome to the Single Task section!`,
      tooltip: "Here you can review each individual Task and modify it.",
    },
  ];
  navbarMainLinks = [
    {
      to: "/app/dashboard",
      name: "Dashboard",
      // icon: Dashboard,
    },
    {
      to: "/app/tasks",
      name: "Tasks",
      // icon: Tasks,
    },
  ];
  navbarToolLinks = [
    {
      to: "/app/user",
      name: "Settings",
      // icon: Settings,
    },
  ];
  navbarTopLinks = [
    { to: "/app", name: "Home" },
    { to: "/app/user", name: "Settings" },
  ];
  delayClasses = [
    "",
    "delay-[50ms]",
    "delay-[100ms]",
    "delay-[150ms]",
    "delay-[200ms]",
    "delay-[250ms]",
  ];
}
