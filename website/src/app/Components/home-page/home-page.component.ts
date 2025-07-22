import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive ,RouterOutlet} from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

interface SubNavigationLink {
  pageName: string;
  route: string;
}

interface SideBarLink {
  pageName: string;
  icon: string;
  route: string;
  downArrow: string;
  subNavigationLinks: SubNavigationLink[];
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  standalone: true,
  imports: [RouterLink,RouterOutlet, RouterLinkActive, NgIf, NgFor],
})
export class HomePageComponent {
  employeeName = signal(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('Employee_Name') ?? '' : '');
  employeeDesignation = signal(typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('Employee_Designation') ?? '' : '');
  isSubNavigation = signal<boolean[]>([]);

  readonly sideBarLinks: SideBarLink[] = [
    {
      pageName: "Dashboard",
      icon: "ph ph-chart-pie-slice",
      route: "dashboard",
      downArrow: "ph ph-caret-down",
      subNavigationLinks: [{ pageName: "Management", route: "dashboard" }]
    },
    {
      pageName: "TN Management",
      icon: "ph ph-identification-badge",
      route: "tn-management",
      downArrow: "ph ph-caret-down",
      subNavigationLinks: [{ pageName: "Team Structure", route: "tn-management/TN_Structure" }]
    },
    {
      pageName: "Fresher Management",
      icon: "ph ph-student",
      route: "fresherManagement",
      downArrow: "ph ph-caret-down",
      subNavigationLinks: [
        { pageName: "Impact training", route: "fresherManagement/impact-training" },
        { pageName: "Internship", route: "fresherManagement/Internship" },
        { pageName: "CoE Training", route: "tn-management" }
      ]
    },
    {
      pageName: "Review Reports",
      icon: "ph ph-note-pencil",
      route: "reviewReports",
      downArrow: "ph ph-caret-down",
      subNavigationLinks: [
        { pageName: "Review | Pending", route: "reviewReports/reviewPending" },
        { pageName: "Review Form", route: "reviewReports/reviewForm" },
        { pageName: "Review | Individual", route: "reviewReports/reviewIndividual" },
        { pageName: "Review | Trainee", route: "reviewReports/reviewTrainee" },
        { pageName: "Question Bank", route: "reviewReports/questionBank" }
      ]
    },
    {
      pageName: "Courses",
      icon: "ph ph-book-bookmark",
      route: "courses",
      downArrow: "",
      subNavigationLinks: []
    },
    {
      pageName: "Notifications",
      icon: "ph ph-bell-ringing",
      route: "notifications",
      downArrow: "ph ph-caret-down",
      subNavigationLinks: [{ pageName: "E-mail", route: "notifications/email" }]
    }
  ];

  constructor(private router: Router) {
    this.isSubNavigation.set(this.sideBarLinks.map(() => false));
  }

  subNavLink(index: number): void {
    const toggled = [...this.isSubNavigation()];
    const isOpen = toggled[index];
    const hasSubLinks = this.sideBarLinks[index].subNavigationLinks.length > 0;

    this.isSubNavigation.set(this.sideBarLinks.map(() => false));
    this.sideBarLinks.forEach(link => link.downArrow = 'ph ph-caret-down');

    if (!isOpen && hasSubLinks) {
      toggled[index] = true;
      this.sideBarLinks[index].downArrow = 'ph ph-caret-up';
      this.isSubNavigation.set(toggled);
    }
  }

 

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
