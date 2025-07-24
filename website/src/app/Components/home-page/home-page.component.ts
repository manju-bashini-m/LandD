import { Component, signal } from '@angular/core';

import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';

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
  imports: [RouterLink, RouterOutlet, RouterLinkActive, NgIf, NgFor,CommonModule],
})
export class HomePageComponent {
  employeeName = signal(sessionStorage.getItem('Employee_Name') ?? '');
  employeeDesignation = signal(sessionStorage.getItem('Employee_Designation') ?? '');

  // Holds the index of the currently open sidebar section
  isSubNavigation = signal<number | null>(null);

  sideBarLinks: SideBarLink[] = [
    {
      pageName: 'Dashboard',
      icon: 'ph ph-chart-pie-slice',
      route: 'dashboard',
      downArrow: 'ph ph-caret-down',
      subNavigationLinks: [
        { pageName: 'Management', route: 'dashboard' }
      ]
    },
    {
      pageName: 'TN Management',
      icon: 'ph ph-identification-badge',
      route: 'tn-management',
      downArrow: 'ph ph-caret-down',
      subNavigationLinks: [
        { pageName: 'Team Structure', route: 'tn-management/TN_Structure' }
      ]
    },
    {
      pageName: 'Fresher Management',
      icon: 'ph ph-student',
      route: 'fresherManagement',
      downArrow: 'ph ph-caret-down',
      subNavigationLinks: [
        { pageName: 'Impact training', route: 'fresherManagement/impact-training' },
        { pageName: 'Internship', route: 'fresherManagement/Internship' },
        { pageName: 'CoE Training', route: 'tn-management' }
      ]
    },
    {
      pageName: 'Review Reports',
      icon: 'ph ph-note-pencil',
      route: 'reviewReports',
      downArrow: 'ph ph-caret-down',
      subNavigationLinks: [
        { pageName: 'Review | Pending', route: 'reviewReports/reviewPending' },
        { pageName: 'Review Form', route: 'reviewReports/reviewForm' },
        { pageName: 'Review | Individual', route: 'reviewReports/reviewIndividual' },
        { pageName: 'Review | Trainee', route: 'reviewReports/reviewTrainee' },
        { pageName: 'Question Bank', route: 'reviewReports/questionBank' }
      ]
    },
    {
      pageName: 'Courses',
      icon: 'ph ph-book-bookmark',
      route: 'courses',
      downArrow: '',
      subNavigationLinks: []
    },
    {
      pageName: 'Notifications',
      icon: 'ph ph-bell-ringing',
      route: 'notifications',
      downArrow: 'ph ph-caret-down',
      subNavigationLinks: [
        { pageName: 'E-mail', route: 'notifications/email' }
      ]
    }
  ];

  constructor(private router: Router) {
    this.updateCaretIcons();
  }

  subNavLink(index: number): void {
    const current = this.isSubNavigation();
    this.isSubNavigation.set(current === index ? null : index);
    this.updateCaretIcons();
  }

  updateCaretIcons(): void {
    const openIndex = this.isSubNavigation();
    this.sideBarLinks.forEach((link, i) => {
      link.downArrow = link.subNavigationLinks.length > 0
        ? (openIndex === i ? 'ph ph-caret-up' : 'ph ph-caret-down')
        : '';
    });
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  isParentLinkActive(link: SideBarLink): boolean {
    return link.subNavigationLinks.some(sub => this.router.url.includes(sub.route));
  }
}
