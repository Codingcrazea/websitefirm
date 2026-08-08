import fs from 'fs/promises';
import path from 'path';
import { CompanyConfig, SiteConfig, NavigationConfig, SEOConfig } from '@/types/config';

const CONFIG_DIR = path.join(process.cwd(), 'config');

export async function getCompanyConfig(): Promise<CompanyConfig> {
  const filePath = path.join(CONFIG_DIR, 'company.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileData);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const filePath = path.join(CONFIG_DIR, 'site.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileData);
}

export async function getNavigationConfig(): Promise<NavigationConfig> {
  const filePath = path.join(CONFIG_DIR, 'navigation.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileData);
}

export async function getSEOConfig(): Promise<SEOConfig> {
  const filePath = path.join(CONFIG_DIR, 'seo.json');
  const fileData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileData);
}

export async function updateConfigFile(filename: string, data: Record<string, any>): Promise<boolean> {
  const filePath = path.join(CONFIG_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  return true;
}
