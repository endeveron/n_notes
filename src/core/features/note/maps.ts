import { createTypedMap, defineEntries } from '@/core/utils';

export const folderColors = defineEntries([
  ['teal', { light: '#00c7b1', dark: '#009689' }],
  ['sky', { light: '#00bcff', dark: '#0084d1' }],
  ['purple', { light: '#c27aff', dark: '#8b00eb' }],
  ['gray', { light: '#99a1af', dark: '#4a5565' }],
] as const);

export const folderColorMap = createTypedMap(folderColors);

export type FolderColorKey = (typeof folderColors)[number][0];
