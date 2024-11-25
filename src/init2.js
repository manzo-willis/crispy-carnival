import pkg from 'enquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const { prompt } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dependency Management
const createDependencyManager = () => {
	const dependencies = new Set();
	const devDependencies = new Set();
	const scripts = {};

	return {
		addDependency: (name, version) => dependencies.add({ name, version }),
		addDevDependency: (name, version) => devDependencies.add({ name, version }),
		addScript: (name, command) => { scripts[name] = command; },
		getDependencies: () => Array.from(dependencies),
		getDevDependencies: () => Array.from(devDependencies),
		getScripts: () => scripts
	};
};

// Feature Registry
const createFeatureRegistry = () => {
	const features = new Map();

	return {
		register: (name, setupFn) => {
			features.set(name, setupFn);
		},
		getFeature: (name) => features.get(name),
		listFeatures: () => Array.from(features.keys())
	};
};

// Configuration Loader
const createConfigLoader = (templateDir) => {
	return {
		async loadTemplate(feature) {
			const templatePath = path.join(templateDir, feature);
			try {
				return await fs.readdir(templatePath);
			} catch (error) {
				console.warn(chalk.yellow(`No template found for ${feature}`));
				return [];
			}
		}
	};
};

// Project Initializer
const createProjectInitializer = () => {
	return {
		async initPackageJson() {
			if (!await fs.pathExists('package.json')) {
				await execa('npm', ['init', '-y']);
			}
		},

		async updatePackageJson(dependencyManager) {
			const packageJson = await fs.readJson('package.json');
			const updatedPackageJson = {
				...packageJson,
				scripts: {
					...packageJson.scripts,
					...dependencyManager.getScripts()
				},
				devDependencies: {
					...packageJson.devDependencies,
					...Object.fromEntries(
						dependencyManager.getDependencies().map(dep => [dep.name, dep.version])
					)
				}
			};

			await fs.writeJson('package.json', updatedPackageJson, { spaces: 2 });
		},

		async installDependencies(dependencyManager) {
			const deps = dependencyManager.getDependencies();
			if (deps.length > 0) {
				await execa('npm', [
					'install',
					'-D',
					...deps.map(dep => `${dep.name}@${dep.version}`)
				]);
			}
		}
	};
};

// Feature Configurations
const registerFeatures = (featureRegistry, templateDir) => {
	const configLoader = createConfigLoader(templateDir);

	featureRegistry.register('sass', async (dependencyManager) => {
		dependencyManager.addDependency('sass', '^1.69.7');
		dependencyManager.addScript('sass:build', 'sass src/styles:public/css --style compressed');
		dependencyManager.addScript('sass:watch', 'sass src/styles:public/css --watch');

		await fs.ensureDir('src/styles');
		const templates = await configLoader.loadTemplate('sass');
		// Copy templates if needed
	});

	// Similarly register other features...
};

// Main Initialization Function
export async function initializeProject() {
	const featureRegistry = createFeatureRegistry();
	const dependencyManager = createDependencyManager();
	const projectInitializer = createProjectInitializer();
	const templateDir = path.join(__dirname, '..', 'templates');

	registerFeatures(featureRegistry, templateDir);

	console.log(chalk.blue('Welcome to Frontend Tools Setup!'));

	try {
		const { features } = await prompt([
			{
				type: 'multiselect',
				name: 'features',
				message: 'Select the features you want to set up:',
				choices: featureRegistry.listFeatures().map(feature => ({
					name: feature,
					message: `${feature.charAt(0).toUpperCase() + feature.slice(1)} configuration`
				}))
			}
		]);

		const spinner = ora('Setting up your project...').start();

		await projectInitializer.initPackageJson();

		// Setup selected features
		for (const feature of features) {
			const setupFn = featureRegistry.getFeature(feature);
			if (setupFn) {
				await setupFn(dependencyManager);
			}
		}

		await projectInitializer.updatePackageJson(dependencyManager);
		await projectInitializer.installDependencies(dependencyManager);

		spinner.succeed('Project setup completed successfully!');
	} catch (error) {
		console.error(chalk.red('Setup failed:'), error);
		process.exit(1);
	}
}