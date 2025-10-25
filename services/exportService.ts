import type { Project } from '../types';

export interface ExportOptions {
    showLines: boolean;
    showNumbers: boolean;
    dotSize: number;
    lineStyle?: Project['lineStyle'];
    lineThickness?: number;
    dotColor?: string;
    lineColor?: string;
}

const getProjectBounds = (project: Project) => {
    if (project.dots.length === 0) return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
    const xs = project.dots.map(d => d.x);
    const ys = project.dots.map(d => d.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
};


export const exportToJsonString = (project: Project): string => {
    return JSON.stringify(project, null, 2);
};

export const exportToSvgString = (project: Project, options: ExportOptions): string => {
    const padding = 20;
    const { minX, minY, width, height } = getProjectBounds(project);
    const viewBoxWidth = width > 0 ? width + padding * 2 : 100;
    const viewBoxHeight = height > 0 ? height + padding * 2 : 100;
    const viewBoxX = width > 0 ? minX - padding : 0;
    const viewBoxY = height > 0 ? minY - padding : 0;
    
    const viewBox = `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`;
    
    let paths = '';
    if (options.showLines && project.dots.length > 1) {
        const pathData = project.dots.map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.x} ${d.y}`).join(' ');
        paths = `<path d="${pathData}" stroke="${options.lineColor || 'black'}" stroke-width="${options.lineThickness || 2}" fill="none" />`;
    }

    const dots = project.dots.map((dot, index) => {
        const circle = `<circle cx="${dot.x}" cy="${dot.y}" r="${options.dotSize}" fill="${options.dotColor || 'black'}" />`;
        const number = options.showNumbers ? `<text x="${dot.x}" y="${dot.y}" font-family="Arial" font-size="10" fill="white" text-anchor="middle" dy=".3em">${index + 1}</text>` : '';
        return circle + number;
    }).join('\\n');

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${viewBoxWidth}" height="${viewBoxHeight}">
        ${paths}
        ${dots}
    </svg>`;
};


const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToJson = (project: Project) => {
    const content = exportToJsonString(project);
    downloadFile(`${project.name || 'project'}.json`, content, 'application/json');
};

export const exportToSvg = (project: Project, options: ExportOptions) => {
    const content = exportToSvgString(project, options);
    downloadFile(`${project.name || 'project'}.svg`, content, 'image/svg+xml');
};

export const exportToPng = (project: Project, options: ExportOptions) => {
    const svgString = exportToSvgString(project, options);
    const { width, height } = getProjectBounds(project);
    const padding = 20;
    const canvas = document.createElement('canvas');
    const imageWidth = width > 0 ? width + padding * 2 : 100;
    const imageHeight = height > 0 ? height + padding * 2 : 100;
    canvas.width = imageWidth;
    canvas.height = imageHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${project.name || 'project'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = url;
};
