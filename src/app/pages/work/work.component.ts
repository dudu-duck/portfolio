import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';

@Component({
    selector: 'page-work',
    standalone: true,
    imports: [
        CardComponent
    ],
    templateUrl: './work.component.html',
    styleUrl: './work.component.scss'
})
export class WorkComponent {
    protected materaSkills: string[] = ['Angular', 'Typescript'];

}
