import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
// import {} from 'react-dom';
// import React from 'react';
import { createRoot } from 'react-dom/client';
import { ImageSlider } from "./ImageSlider";

interface ImageSliderSettings {
	borderRadius: string;
}

const DEFAULT_SETTINGS: ImageSliderSettings = {
	borderRadius: "10"
}

export default class ImageSliderPlugin extends Plugin {
	settings: ImageSliderSettings;
	async onload() {
		await this.loadSettings();
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
			root.render(<ImageSlider images={imagesUri} borderRadius={this.settings.borderRadius} />);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ImageSliderSettingsTab(this.app, this));
	}

	async loadSettings() {
		
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}



	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class ImageSliderSettingsTab extends PluginSettingTab {
	plugin: ImageSliderPlugin;

	constructor(app: App, plugin: ImageSliderPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Border Radius')
			.setDesc('Set the border radius for the images')
			.addText(text => text
				.setPlaceholder('Eg: 10')
				.setValue(this.plugin.settings.borderRadius)
				.onChange(async (value) => {
					if (value) {
						this.plugin.settings.borderRadius = value;
						await this.plugin.saveSettings();
						this.app.workspace.getActiveViewOfType(MarkdownView)?.previewMode.rerender(true);
					}
				}));
	}
}
