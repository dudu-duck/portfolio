import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { links } from '../../core/links';

@Component({
    selector: 'footer',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

    protected sections: FooterSection[] = [
        {
            title: 'Páginas',
            items: [
                {
                    title: 'Trabalhos',
                    url: 'home'
                },
                {
                    title: 'Sobre mim',
                    url: 'about-me'
                },
            ]
        },
        {
            title: 'Vamos nos conectar',
            items: [
                {
                    title: 'Linkedin',
                    url: links.get('linkedin')
                },
                {
                    title: 'Github',
                    url: links.get('github')
                },
                {
                    title: 'Email',
                    url: links.get('email')
                },
            ]
        },
        {
            title: 'Mais detalhes',
            items: [
                {
                    title: 'CV',
                    url: links.get('resume')
                }
            ]
        },
    ]

    constructor(private router: Router) { }

    protected isApplicationRoute(url?: string): boolean {
        return !!(url && this.router.config.some(route => route.path == url));
    }
}

interface SectionItem {
    title: string;
    url?: string;
    file?: string;
}

interface FooterSection {
    title: string;
    items: SectionItem[];
}