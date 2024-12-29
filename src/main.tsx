import {
	App,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
// import {} from 'react-dom';
// import React from 'react';
import { createRoot } from "react-dom/client";
import { ImageSlider } from "./ImageSlider";

interface ImageSliderSettings {
	borderRadius: string;
}

declare module "obsidian" {
	interface WorkspaceLeaf {
		rebuildView(): void;
	}
	interface App {
		setting: {
			onClose: () => void;
			closeActiveTab: () => void;
		}
	}
}

const DEFAULT_SETTINGS: ImageSliderSettings = {
	borderRadius: "10",
};

export default class ImageSliderPlugin extends Plugin {
	settings: ImageSliderSettings;
	needRefresh: boolean = false;
	async onload() {
		await this.loadSettings();
		this.registerMarkdownCodeBlockProcessor("slider", (source, el, ctx) => {
			// console.log('csv', source);
			const extractImagePaths = (text: string) => {
				// Regex patterns
				const wikilinkPattern = /\[\[(.*?)\]\]/g;
				const markdownPattern = /\[.*?\]\((.*?)\)/g;

				// Extract paths
				const wikilinkPaths = [...text.matchAll(wikilinkPattern)].map(
					(match) => match[1]
				);
				const markdownPaths = [...text.matchAll(markdownPattern)].map(
					(match) => match[1]
				);

				// Combine results
				return [...wikilinkPaths, ...markdownPaths];
			};
			const getResourcePaths = (imagePaths: string[]) => {
				let imagesUri: string[] = [];
				imagePaths.forEach((image) => {
					const file = this.app.vault.getAbstractFileByPath(image);
					if (file instanceof TFile) {
						imagesUri.push(this.app.vault.getResourcePath(file));
					}
				});
				return imagesUri;
			};
			const parsedImages = extractImagePaths(source);
			let imagesUri = getResourcePaths(parsedImages);
			const root = createRoot(el);
			root.render(
				<ImageSlider
					images={imagesUri}
					borderRadius={this.settings.borderRadius}
				/>
			);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ImageSliderSettingsTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	public refreshOpenViews(): boolean {
		try {
			this.app.workspace.getLeavesOfType("markdown").forEach((leaf) => leaf.rebuildView());
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}
}

class ImageSliderSettingsTab extends PluginSettingTab {
	plugin: ImageSliderPlugin;
	needRefresh: boolean = false;

	constructor(app: App, plugin: ImageSliderPlugin) {
		super(app, plugin);
		this.plugin = plugin;

		app.setting.onClose = () => {
			if (this.needRefresh) {
				this.plugin.refreshOpenViews();
			}
			// this.plugin.refreshOpenViews();
			app.setting.closeActiveTab();
		}
		// this.plugin.refreshOpenViews();

	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Border Radius")
			.setDesc("Set the border radius for the images")
			.addText((text) =>
				text
					.setPlaceholder("Eg: 10")
					.setValue(this.plugin.settings.borderRadius)
					.onChange(async (value) => {
						if (value) {
							if (this.plugin.settings.borderRadius !== value) {
								this.needRefresh = true;
							} else {
								this.needRefresh = false;
							}
							this.plugin.settings.borderRadius = value;
							await this.plugin.saveSettings();
							// this.app.workspace.getActiveViewOfType(MarkdownView)?.previewMode.rerender(true);

							// try {
							// 	this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
							// 		leaf.rebuildView();
							// 	})
							// } catch (error) {
							// 	new Notice('Error rebuilding views');
							// }
							// this.app.workspace.getActiveViewOfType(MarkdownView)?.
							// this.app.workspace.getActiveViewOfType(editorEditorField)?.previewMode.rerender(true);
						}
					})
			);
	}
}
