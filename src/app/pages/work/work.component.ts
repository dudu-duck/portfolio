import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import { RouterModule } from '@angular/router';
import { links } from '../../core/links';

@Component({
    selector: 'page-work',
    standalone: true,
    imports: [
        CardComponent,
        RouterModule
    ],
    templateUrl: './work.component.html',
    styleUrl: './work.component.scss'
})
export class WorkComponent {
    protected links: Map<string, string> = links;
    protected materaSkills: string[] = ['Angular', 'Typescript', 'Javascript', 'C#', 'Visual Basic', 'HTML', 'SCSS', 'SQL SERVER 2019'];


    protected goToLink(url?: string): void {
        if (url) window.open(url, "_blank");
    }
}
