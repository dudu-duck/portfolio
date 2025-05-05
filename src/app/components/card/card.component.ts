import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'job-card',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss'
})
export class CardComponent {
    @Input() job: 'matera' | 'infotreasury' = 'matera';
    @Input() header: string = '';
    @Input() date: string = '';
    @Input() skills: string[] = [];

    protected imgSrc: string = '';

    constructor() {
    }

    ngOnInit(): void {
        this.imgSrc = this.job == 'matera' ? '../../../assets/images/matera.png' : '../../../assets/images/infotreasury.png';

    }

}
