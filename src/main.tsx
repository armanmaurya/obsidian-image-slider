import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
// import {} from 'react-dom';
// import React from 'react';
import { ReactApp } from '../ReactView';
import { Root, createRoot } from 'react-dom/client';
import { ItemView, WorkspaceLeaf } from 'obsidian';
import { StrictMode } from 'react';
import { ImageSlider } from "./ImageSlider";

// Remember to rename these classes and interfaces!


const CsvTable = ({ rows }: { rows: string[][] }) => {
	return (
		<table>
			<tbody style={{ border: '2px solid red' }}>
				{rows.map((cols, i) => (
					<tr key={i}>
						{cols.map((col, j) => (
							<td key={j}>{col}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	async onload() {
		this.registerMarkdownCodeBlockProcessor('slider', (source, el, ctx) => {
			// console.log('csv', source);
			const images = source.split('\n').filter((row) => row.length > 0);
			let parsedImages: string[] = [];
			images.forEach((image) => {
				parsedImages.push(image.slice(2, image.length - 2));
			});

			let imagesUri: string[] = [];
			parsedImages.forEach((image) => {
				const file = this.app.vault.getAbstractFileByPath(image);
				if (file instanceof TFile) {
					imagesUri.push(this.app.vault.getResourcePath(file));
				}
			});

			const root = createRoot(el);
			root.render(<ImageSlider images={imagesUri} />);
		});
	}
}
